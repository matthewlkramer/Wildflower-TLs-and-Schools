import { useState, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, GridApi, themeMaterial } from "ag-grid-community";
// Modules are registered in initAgGridEnterprise at app startup
import { Link } from "wouter";
import { ExternalLink, Trash2, Plus, FilePlus2, ClipboardList, MessageSquareText, Pencil, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeRenderer, PillRenderer } from "@/components/shared/grid-renderers";
import { type Educator, type School } from "@shared/schema.generated";
import { getStatusColor } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { updateEducator } from "@/integrations/supabase/wftls";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import { useAgGridFeatures } from "@/hooks/use-aggrid-features";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { useGridHeight } from "@/components/shared/use-grid-height";
import { createTextFilter } from "@/utils/ag-grid-utils";
// Inline action icons (no dropdown)

interface TeachersGridProps {
  teachers: any[];
  isLoading: boolean;
  onFilteredCountChange?: (count: number) => void;
  onAddTeacher?: () => void;
  onSelectionChanged?: (rows: any[]) => void;
}

// Note: SchoolLink helper removed to avoid legacy /api fetches

// Using shared renderers from grid-renderers.tsx

// Action buttons renderer
const ActionRenderer = ({ data: teacher }: { data: Educator }) => {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => updateEducator(id, { archived: true }),
    onMutate: async (id: string) => {
      // Optimistically remove from cache
      const key = ['supabase/grid_educator'];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Educator[]>(key);
      if (previous) {
        queryClient.setQueryData<Educator[]>(key, previous.filter(t => t.id !== id));
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      // Roll back cache
      if (context?.previous) {
        queryClient.setQueryData(['supabase/grid_educator'], context.previous);
      }
      toast({
        title: "Error",
        description: "Failed to delete educator. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase/grid_educator'] });
      toast({
        title: "Educator deleted",
        description: "The educator has been successfully deleted.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase/grid_educator'] });
    }
  });

  const onOpen = () => { try { window.location.href = `/teacher/${teacher.id}`; } catch {} };
  const onEditName = async () => {
    const current = teacher.fullName || '';
    const next = window.prompt('Edit name', current);
    if (next == null || next === current) return;
    try {
      await updateEducator(teacher.id, { fullName: next });
      queryClient.invalidateQueries({ queryKey: ['supabase/grid_educator'] });
      toast({ title: 'Saved', description: 'Educator updated' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };
  const onArchive = () => setShowDeleteModal(true);
  const onCreateNote = () => { try { window.location.href = `/teacher/${teacher.id}`; } catch {} };
  const onCreateTask = () => { try { window.location.href = `/teacher/${teacher.id}`; } catch {} };
  const onLogInteraction = () => { try { window.location.href = `/teacher/${teacher.id}`; } catch {} };

  const onSendEmail = () => {
    const to = (teacher as any).currentPrimaryEmailAddress || '';
    const q = to ? `?to=${encodeURIComponent(to)}` : '';
    try { window.location.href = `/compose-email${q}`; } catch {}
  };

  return (
    <div className="flex items-center justify-center w-full">
      <select
        aria-label="Actions"
        defaultValue=""
        onChange={(e) => {
          const v = e.target.value;
          e.currentTarget.selectedIndex = 0;
          switch (v) {
            case 'open': onOpen(); break;
            case 'edit': onEditName(); break;
            case 'note': onCreateNote(); break;
            case 'task': onCreateTask(); break;
            case 'interaction': onLogInteraction(); break;
            case 'email': onSendEmail(); break;
            case 'archive': onArchive(); break;
          }
        }}
        className="h-6 text-xs border rounded-md px-2 bg-white"
      >
        <option value="" disabled>Actions</option>
        <option value="open">Open</option>
        <option value="edit">Edit</option>
        <option value="note">Add note</option>
        <option value="task">Add task</option>
        <option value="interaction">Log interaction</option>
        <option value="email">Send email</option>
        <option value="archive">Archive</option>
      </select>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={() => {
          deleteMutation.mutate(teacher.id);
          setShowDeleteModal(false);
        }}
        title="Delete Educator"
        description={`Are you sure you want to delete ${teacher.fullName}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default function TeachersGrid({ teachers, isLoading, onFilteredCountChange, onAddTeacher, onSelectionChanged }: TeachersGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridHeight = useGridHeight();
  const { entReady, filterForText } = useAgGridFeatures();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Height managed by shared hook

  const columnDefs: ColDef[] = useMemo(() => {
    return [
    {
      headerName: "Full Name",
      field: "fullName",
      ...createTextFilter(),
      minWidth: 200,
      valueGetter: ({ data }: { data: any }) => data?.full_name ?? data?.fullName ?? '',
      cellRenderer: ({ data }: { data: any }) => (
        <Link href={`/teacher/${data.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {data.full_name ?? data.fullName}
        </Link>
      ),
      sort: 'asc',
    },
    {
      headerName: "Role/School",
      field: "currentRoleSchool",
      // Text filter with contains logic similar to Google Sheets
      ...createTextFilter(),
      minWidth: 300,
      valueGetter: ({ data }: { data: any }) => data?.current_role_at_active_school ?? data?.currentRoleSchool ?? '',
      cellRenderer: ({ data }: { data: any }) => {
        const roleText = data?.current_role_at_active_school ?? data?.currentRoleSchool ?? '';
        const names = Array.isArray(data?.activeSchool) ? data.activeSchool : (data?.activeSchool ? [data.activeSchool] : []);
        const ids = Array.isArray(data?.activeSchoolIds) ? data.activeSchoolIds : [];
        return (
          <div className="flex flex-wrap items-center gap-1">
            {roleText && <span>{roleText}</span>}
            {names.length > 0 && (
              <span className="text-slate-400">•</span>
            )}
            {names.length > 0 && (
              <span className="flex flex-wrap gap-1">
                {names.map((n, i) => (
                  ids[i] ? (
                    <Link key={ids[i]} href={`/school/${ids[i]}`} className="text-blue-600 hover:underline">{n}</Link>
                  ) : (
                    <span key={`${n}-${i}`}>{n}</span>
                  )
                )).reduce((prev, curr, i) => (i ? [...prev, <span key={`sep-${i}`}>, </span>, curr] : [curr]), [] as any)}
              </span>
            )}
          </div>
        );
      }
    },
    {
      headerName: "Mont. Cert?",
      field: "montessoriCertified",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? ({ values: ['Yes', 'No', null] } as any) : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 160,
      valueGetter: ({ data }: { data: any }) => (
        (data?.has_montessori_cert ?? data?.montessoriCertified) ? 'Yes' : 'No'
      ),
      cellRenderer: ({ data }: { data: any }) => (
        <BadgeRenderer value={(data?.has_montessori_cert ?? data?.montessoriCertified) ? 'Yes' : 'No'} field="has_montessori_cert" />
      )
    },
    {
      headerName: "Race/ethnicity",
      field: "raceEthnicity",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 140,
      valueGetter: ({ data }: { data: any }) => (Array.isArray(data?.race_ethnicity) ? data.race_ethnicity.join(', ') : (data?.race_ethnicity ?? data?.raceEthnicity ?? '')),
      cellRenderer: ({ data }: { data: any }) => (
        <PillRenderer value={data.race_ethnicity || data.raceEthnicity || []} />
      )
    },
    {
      headerName: "Discovery",
      field: "discoveryStatus",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 140,
      cellRenderer: ({ data }: { data: any }) => (
        <BadgeRenderer value={data.discovery_status ?? data.discoveryStatus ?? ''} field="discovery_status" />
      )
    },
    {
      headerName: "Indiv. Type",
      field: "individualType",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 120,
      valueGetter: ({ data }: { data: any }) => data?.indiv_type ?? data?.individualType ?? '',
      cellRenderer: ({ data }: { data: any }) => (
        <PillRenderer value={data.indiv_type ?? data.individualType ?? ''} />
      )
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ActionRenderer,
      headerClass: 'ag-right-aligned-header',
      headerNameTooltip: undefined as any,
      // remove deprecated property to avoid AG Grid warnings
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true as any,
      suppressHeaderContextMenu: true as any,
      width: 160,
      minWidth: 140,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' } as any
    }
  ];
  }, [entReady, filterForText]);

  const defaultColDef: ColDef = useMemo(() => ({ ...DEFAULT_COL_DEF }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();
    // keep side panel collapsed by default
  }, []);
  // Enterprise readiness handled by useAgGridFeatures

  // Note: Quick filter is handled at the page level to avoid
  // inconsistencies when the grid re-initializes.

  if (isLoading) {
    return (
      <div className="h-[600px] bg-white rounded-lg border flex items-center justify-center">
        <div>Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[280px]" style={{ height: gridHeight }}>
      <GridBase
        rowData={teachers}
        columnDefs={columnDefs}
        defaultColDefOverride={defaultColDef}
        style={{ height: '100%' }}
        gridProps={{
          sideBar: (DEFAULT_GRID_PROPS as any).sideBar,
          enableAdvancedFilter: true as any,
        }}
      >
        <div className="relative h-full w-full">
          <AgGridReact
            {...DEFAULT_GRID_PROPS}
            getRowId={(p:any)=>p?.data?.id}
            onGridReady={onGridReady}
            rowData={teachers}
            columnDefs={columnDefs}
            defaultColDef={{ ...DEFAULT_COL_DEF, ...(defaultColDef || {}) }}
            onFirstDataRendered={(ev: any) => {
              try {
                const count = ev.api.getDisplayedRowCount();
                onFilteredCountChange?.(count);
              } catch {}
            }}
            onFilterChanged={(ev: any) => {
              try {
                const count = ev.api.getDisplayedRowCount();
                onFilteredCountChange?.(count);
              } catch {}
            }}
            onSelectionChanged={(ev: any) => {
              try {
                const rows = ev.api.getSelectedRows?.() || [];
                onSelectionChanged?.(rows as Educator[]);
              } catch {}
            }}
            context={{ componentName: 'teachers-grid' }}
          />
        </div>
      </GridBase>
    </div>
  );
}









