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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import { useAgGridFeatures } from "@/hooks/use-aggrid-features";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { useGridHeight } from "@/components/shared/use-grid-height";
import { createTextFilter } from "@/utils/ag-grid-utils";
// Inline action icons (no dropdown)

interface TeachersGridProps {
  teachers: Educator[];
  isLoading: boolean;
  fields?: string[]; // when provided, render dynamic columns for all fields except id
  onFilteredCountChange?: (count: number) => void;
  onAddTeacher?: () => void;
  onSelectionChanged?: (rows: Educator[]) => void;
}

// School Link Component that finds school ID by name
const SchoolLink = ({ schoolName }: { schoolName: string }) => {
  const { data: schools } = useQuery<School[]>({
    queryKey: ['/api/schools'],
  });

  const school = schools?.find(s => s.name === schoolName);
  
  if (!school) {
    return <span>{schoolName}</span>;
  }

  return (
    <Link 
      href={`/school/${school.id}`} 
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      {schoolName}
    </Link>
  );
};

// Using shared renderers from grid-renderers.tsx

// Action buttons renderer
const ActionRenderer = ({ data: teacher }: { data: Educator }) => {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PUT', `/api/educators/${id}`, { archived: true }),
    onMutate: async (id: string) => {
      // Optimistically remove from cache
      const key = ['/api/educators'];
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
        queryClient.setQueryData(['/api/educators'], context.previous);
      }
      toast({
        title: "Error",
        description: "Failed to delete educator. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educators'] });
      toast({
        title: "Educator deleted",
        description: "The educator has been successfully deleted.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educators'] });
    }
  });

  const onOpen = () => { try { window.location.href = `/teacher/${teacher.id}`; } catch {} };
  const onEditName = async () => {
    const current = teacher.fullName || '';
    const next = window.prompt('Edit name', current);
    if (next == null || next === current) return;
    try {
      await apiRequest('PUT', `/api/educators/${teacher.id}`, { fullName: next });
      queryClient.invalidateQueries({ queryKey: ['/api/educators'] });
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
    <>
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
        className="h-7 text-xs border rounded-md px-1 bg-white"
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
    </>
  );
};

export default function TeachersGrid({ teachers, isLoading, onFilteredCountChange, onAddTeacher, onSelectionChanged }: TeachersGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridHeight = useGridHeight();
  const { entReady, filterForText } = useAgGridFeatures();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Height managed by shared hook

  const columnDefs: ColDef[] = useMemo(() => {
    // If fields prop is provided, render dynamic columns for each field except id
    const pretty = (key: string) => key
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^\w/, (c) => c.toUpperCase());

    if (fields && fields.length) {
      return fields
        .filter((f) => f !== 'id')
        .map((f): ColDef => ({
          headerName: pretty(f),
          field: f,
          filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
          filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
          sortable: true,
          flex: 1,
          minWidth: 120,
          valueGetter: (p: any) => {
            const v = p?.data?.[f];
            if (Array.isArray(v)) return v.join(', ');
            if (v && typeof v === 'object') return JSON.stringify(v);
            return v ?? '';
          },
        }));
    }

    return [
    {
      headerName: "Educator Name",
      field: "fullName",
      ...createTextFilter(),
      minWidth: 200,
      cellRenderer: ({ data: teacher }: { data: Educator }) => (
        <Link href={`/teacher/${teacher.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {teacher.fullName}
        </Link>
      ),
      sort: 'asc',
    },
    {
      headerName: "Current role/school",
      field: "currentRoleSchool",
      // Text filter with contains logic similar to Google Sheets
      ...createTextFilter(),
      minWidth: 300,
      valueGetter: ({ data }: { data: Educator }) => data?.currentRoleSchool || '',
      cellRenderer: ({ data }: { data: Educator }) => {
        const roleText = data?.currentRoleSchool || '';
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
      headerName: "Montessori Certified",
      field: "montessoriCertified",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? ({ values: ['Yes', 'No', null] } as any) : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 160,
      valueGetter: ({ data }: { data: Educator }) => (
        data?.montessoriCertified === true ? 'Yes' : (data?.montessoriCertified === false ? 'No' : '')
      ),
      cellRenderer: ({ data }: { data: Educator }) => (
        <BadgeRenderer value={data?.montessoriCertified === true ? 'Yes' : (data?.montessoriCertified === false ? 'No' : '')} field="montessoriCertified" />
      )
    },
    {
      headerName: "Race/Ethnicity",
      field: "raceEthnicity",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 140,
      valueGetter: ({ data }: { data: Educator }) => (Array.isArray(data?.raceEthnicity) ? data.raceEthnicity.join(', ') : (data?.raceEthnicity || '')),
      cellRenderer: ({ data }: { data: Educator }) => (
        <PillRenderer value={data.raceEthnicity || []} />
      )
    },
    {
      headerName: "Discovery Status",
      field: "discoveryStatus",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 140,
      cellRenderer: ({ data }: { data: Educator }) => (
        <BadgeRenderer value={data.discoveryStatus || ''} field="discoveryStatus" />
      )
    },
    {
      headerName: "Type",
      field: "individualType",
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      minWidth: 120,
      valueGetter: ({ data }: { data: Educator }) => data?.individualType || '',
      cellRenderer: ({ data }: { data: Educator }) => (
        <PillRenderer value={data.individualType || ''} />
      )
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionRenderer,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true as any,
      suppressHeaderContextMenu: true as any,
      width: 100,
      pinned: 'right'
    }
    ];
  }, [fields, entReady, filterForText]);

  const defaultColDef: ColDef = useMemo(() => ({ ...DEFAULT_COL_DEF }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();
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
                const model: any = {};
                model.currentRoleSchool = { filterType: 'text', type: 'notContains', filter: 'Paused' };
                if (entReady) {
                  const all = Array.from(new Set((teachers || []).map(t => t?.discoveryStatus).filter(Boolean)));
                  model.discoveryStatus = { filterType: 'set', values: all.filter(v => String(v) !== 'Paused') };
                } else {
                  model.discoveryStatus = { filterType: 'text', type: 'notEqual', filter: 'Paused' };
                }
                if (entReady) {
                  const allTypes = Array.from(new Set((teachers || []).map(t => t?.individualType).filter(Boolean)));
                  model.individualType = { filterType: 'set', values: allTypes.filter(v => String(v) !== 'Community Member') };
                } else {
                  model.individualType = { filterType: 'text', type: 'notEqual', filter: 'Community Member' };
                }
                ev.api.setFilterModel(model);
                ev.api.onFilterChanged();
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
