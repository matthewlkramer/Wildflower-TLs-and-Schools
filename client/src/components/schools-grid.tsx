import { useMemo, useCallback, useState } from "react";
import { ColDef, GridReadyEvent, GridApi, ICellRendererParams, ValueGetterParams } from "ag-grid-community";
import { Link } from "wouter";
import { ExternalLink, Trash2, MoreVertical, FilePlus2, ClipboardList, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadgeCellRenderer, MultiValueCellRenderer } from "@/components/shared/grid-renderers";
import { type School } from "@/types/db-options";
import { getStatusColor } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { updateSchool } from "@/integrations/supabase/wftls";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { GridBase } from "@/components/shared/GridBase";
import { useAgGridFeatures } from "@/hooks/use-aggrid-features";
import { STAGE_STATUS_ORDER, STAGE_STATUS_DEFAULT, MEMBERSHIP_STATUS_ORDER } from "@/constants/filters";
// TODO: Add these options to schema.generated
// import { SCHOOLS_OPTIONS_AGESSERVED as AGES_SERVED_OPTIONS, SCHOOLS_OPTIONS_GOVERNANCEMODEL as GOVERNANCE_MODEL_OPTIONS } from "@/types/db-options";
import { useToast } from "@/hooks/use-toast";
import { EditNameModal } from "@/components/edit-name-modal";
import { createTextFilter } from "@/utils/ag-grid-utils";
import { useGridHeight } from "@/components/shared/use-grid-height";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEducatorLookup } from "@/hooks/use-lookup";
import { LinkifyEducatorNames } from "@/components/shared/Linkify";

interface SchoolCellRendererParams extends ICellRendererParams {
  data: School;
}

interface SchoolsGridProps {
  schools: any[];
  isLoading: boolean;
  onFilteredCountChange?: (count: number) => void;
  onSelectionChanged?: (rows: any[]) => void;
}

// Custom cell renderers
const SchoolNameCellRenderer = (params: SchoolCellRendererParams) => {
  const school = params.data;
  const label = school.school_name || school.shortName || school.name;
  return (
    <Link href={`/school/${school.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
      {label}
    </Link>
  );
};

// Using StatusBadgeCellRenderer from shared grid-renderers

const MembershipStatusCellRenderer = (params: SchoolCellRendererParams) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <div className="flex items-center h-full">
      <Badge variant={value === 'Active' ? "default" : "secondary"}>
        {value}
      </Badge>
    </div>
  );
};

// Using MultiValueCellRenderer from shared grid-renderers

const CurrentTLsCellRenderer = (params: SchoolCellRendererParams & { educatorByName: Map<string,string> }) => {
  const currentTLs = params?.data?.currentTLs;
  const names = Array.isArray(currentTLs) ? currentTLs : (currentTLs ? [String(currentTLs)] : []);
  return <LinkifyEducatorNames names={names} educatorByName={params.educatorByName} /> as any;
};

const ActionsCellRenderer = ({ data: school }: { data: School }) => {
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const open = () => { try { window.location.href = `/school/${school.id}`; } catch {} };
  
  const handleEditSave = async (newName: string) => {
    await updateSchool(school.id, { name: newName });
    queryClient.invalidateQueries({ queryKey: ['supabase/grid_school'] });
    toast({ title: "School name updated", description: `Name changed to "${newName}"` });
  };
  const markInactive = async () => {
    if (!confirm('Mark school inactive (archive)?')) return;
    try { await updateSchool(school.id, { archived: true }); queryClient.invalidateQueries({ queryKey: ['supabase/grid_school'] }); } catch (e) { alert('Failed to archive'); }
  };
  const createNote = async () => {
    const notes = window.prompt('New note for this school:');
    if (!notes) return;
    try {
      await apiRequest('POST', `/api/school-notes`, { schoolId: school.id, notes });
      alert('Note created');
    } catch (e) { alert('Failed to create note'); }
  };
  const createTask = async () => {
    const item = window.prompt('Task description:');
    if (!item) return;
    const dueDate = window.prompt('Due date (YYYY-MM-DD), optional:') || undefined;
    try { await apiRequest('POST', `/api/action-steps`, { schoolId: school.id, item, dueDate }); alert('Task created'); } catch (e) { alert('Failed to create task'); }
  };

  const sendEmail = () => {
    const to = (school as School & {email?: string; primaryContactEmail?: string}).email || (school as School & {email?: string; primaryContactEmail?: string}).primaryContactEmail || '';
    const q = to ? `?to=${encodeURIComponent(to)}` : '';
    try { window.location.href = `/compose-email${q}`; } catch {}
  };

  return (
    <>
    <select
      aria-label="Actions"
      defaultValue=""
      onChange={(e)=>{ const v=e.target.value; e.currentTarget.selectedIndex=0; switch(v){ case 'open': open(); break; case 'edit': setEditModalOpen(true); break; case 'note': createNote(); break; case 'task': createTask(); break; case 'email': sendEmail(); break; case 'archive': markInactive(); break; }}}
      className="h-6 text-xs border rounded-md px-1 bg-white"
    >
      <option value="" disabled>Actions</option>
      <option value="open">Open</option>
      <option value="edit">Edit</option>
      <option value="note">Add note</option>
      <option value="task">Add task</option>
      <option value="email">Send email</option>
      <option value="archive">Archive</option>
    </select>
      <EditNameModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentName={school.shortName || school.name || ''}
        entityType="school"
        onSave={handleEditSave}
      />
    </>
  );
};

export default function SchoolsGrid({ schools, isLoading, fields, onFilteredCountChange, onSelectionChanged }: SchoolsGridProps) {
  const { toast } = useToast();
  const gridHeight = useGridHeight();
  const { entReady, filterForText } = useAgGridFeatures();
  const { educatorByName } = useEducatorLookup();
  
  const columnDefs: ColDef[] = useMemo(() => {
    return [
    {
      field: "school_name",
      headerName: "School Name",
      width: 200,
      cellRenderer: SchoolNameCellRenderer,
      ...createTextFilter(),
      valueGetter: (params: ValueGetterParams<any>) => params.data?.school_name ?? params.data?.shortName ?? params.data?.name,
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
      sort: 'asc',
    },
    {
      field: "stage_status",
      headerName: "Stage/Status",
      width: 140,
      cellRenderer: StatusBadgeCellRenderer,
      // Prefer Enterprise Set Filter with ordered values; otherwise fall back to text filter
      filter: entReady ? 'agMultiColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady 
        ? ({ values: STAGE_STATUS_ORDER } as any)
        : ({ textFormatter: (v: any) => String(v ?? '').trim().toLowerCase(), defaultOption: 'contains' } as any),
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
    },
    {
      field: "membership_status",
      headerName: "Membership",
      width: 160,
      cellRenderer: MembershipStatusCellRenderer,
      filter: entReady ? 'agMultiColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady 
        ? ({ values: MEMBERSHIP_STATUS_ORDER } as any)
        : undefined,
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
    },
    {
      field: "current_tls",
      headerName: "Current TLs",
      width: 120,
      cellRenderer: (p: any) => CurrentTLsCellRenderer({ ...(p || {}), educatorByName }),
      sortable: false,
      filter: false,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || '';
      },
    },
    {
      field: "projected_open",
      headerName: "Proj. Open",
      width: 120,
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      valueGetter: (p: any) => p?.data?.projected_open ?? p?.data?.projectedOpen ?? '',
    },
    {
      field: "all_ages_served",
      headerName: "Ages",
      width: 140,
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? undefined : { defaultOption: 'contains', debounceMs: 150 },
      valueGetter: (params) => params.data?.all_ages_served ?? (Array.isArray(params.data?.agesServed) ? params.data?.agesServed?.join(', ') : (params.data?.agesServed || '')),
    },
    {
      field: "governance_model",
      headerName: "Gov. Model",
      width: 160,
      cellRenderer: (params: any) => {
        const value = params.value;
        if (!value) return <span></span>;
        
        return (
          <div className="flex items-center h-full">
            <Badge className={getStatusColor(value)}>
              {value}
            </Badge>
          </div>
        );
      },
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? ({ values: GOVERNANCE_MODEL_OPTIONS } as any) : { defaultOption: 'contains', debounceMs: 150 },
    },

    {
      field: "actions",
      headerName: "",
      width: 140,
      minWidth: 130,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true as any,
      suppressHeaderContextMenu: true as any,
      resizable: false,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' } as any,
    },
    ];
  }, [entReady]);

  const defaultColDef: ColDef = { ...DEFAULT_COL_DEF };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[280px]" style={{ height: gridHeight }}>
        <div className="ag-theme-material h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500">Loading schools...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!schools || schools.length === 0) {
    return (
      <div className="w-full min-h-[280px]" style={{ height: gridHeight }}>
        <div className="ag-theme-material h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500">No schools found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[280px]" style={{ height: gridHeight }}>
      <GridBase 
        rowData={schools} 
        columnDefs={columnDefs} 
        defaultColDefOverride={defaultColDef}
        style={{ height: '100%' }}
        gridProps={{
          getRowId: (p:any)=>p?.data?.id,
          sideBar: (DEFAULT_GRID_PROPS as any).sideBar,
          enableAdvancedFilter: true as any,
          onGridReady: (params: GridReadyEvent) => {
            params.api.sizeColumnsToFit();
          },
          onFirstDataRendered: (ev: any) => {
            try {
              const count = ev.api.getDisplayedRowCount();
              onFilteredCountChange?.(count);
            } catch {}
          },
          onFilterChanged: (ev: any) => {
            try {
              const count = ev.api.getDisplayedRowCount();
              onFilteredCountChange?.(count);
            } catch {}
          },
          onSelectionChanged: (ev: any) => {
            try {
              const rows = ev.api.getSelectedRows?.() || [];
              onSelectionChanged?.(rows as School[]);
            } catch {}
          },
          context: { componentName: 'schools-grid' },
        }}
      />
    </div>
  );
}
