import { useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, GridApi, themeMaterial } from "ag-grid-community";
import { Link } from "wouter";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type School } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { GridBase } from "@/components/shared/GridBase";
import { useAgGridFeatures } from "@/hooks/use-aggrid-features";
import { STAGE_STATUS_ORDER, STAGE_STATUS_DEFAULT, MEMBERSHIP_STATUS_ORDER } from "@/constants/filters";
import { SCHOOLS_OPTIONS_AGES_SERVED as AGES_SERVED_OPTIONS, SCHOOLS_OPTIONS_GOVERNANCE_MODEL as GOVERNANCE_MODEL_OPTIONS } from "@/constants/airtable-schema";
import { useToast } from "@/hooks/use-toast";
import { createTextFilter } from "@/utils/ag-grid-utils";
import { useGridHeight } from "@/components/shared/use-grid-height";

interface SchoolsGridProps {
  schools: School[];
  isLoading: boolean;
  onFilteredCountChange?: (count: number) => void;
  onSelectionChanged?: (rows: School[]) => void;
}

// Custom cell renderers
const SchoolNameCellRenderer = (params: any) => {
  const school = params.data;
  return (
    <Link href={`/school/${school.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
      {school.shortName || school.name}
    </Link>
  );
};

const StatusBadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <div className="flex items-center h-full">
      <Badge className={getStatusColor(value)}>
        {value}
      </Badge>
    </div>
  );
};

const MembershipStatusCellRenderer = (params: any) => {
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

const MultiValueCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((value: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs">
          {value}
        </Badge>
      ))}
    </div>
  );
};

const CurrentTLsCellRenderer = (params: any) => {
  const school = params.data;
  const currentTLs = school.currentTLs;
  
  if (currentTLs && Array.isArray(currentTLs) && currentTLs.length > 0) {
    return <span>{currentTLs.join(', ')}</span>;
  }
  
  if (currentTLs && typeof currentTLs === 'string') {
    return <span>{currentTLs}</span>;
  }
  
  return <span className="text-slate-400">-</span>;
};

const ActionsCellRenderer = ({ data: school }: { data: School }) => {
  const handleDelete = async () => {
    const ok = window.confirm(`Are you sure you want to delete ${school.shortName || school.name}?`);
    if (!ok) return;
    try {
      await apiRequest('PUT', `/api/schools/${school.id}`, { archived: true });
      queryClient.invalidateQueries({ queryKey: ['/api/schools'] });
    } catch (e) {
      console.error('Failed to delete school', e);
      alert('Failed to delete school. Please try again.');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/school/${school.id}`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
        onClick={handleDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function SchoolsGrid({ schools, isLoading, onFilteredCountChange, onSelectionChanged }: SchoolsGridProps) {
  const { toast } = useToast();
  const gridHeight = useGridHeight();
  const { entReady, filterForText } = useAgGridFeatures();
  
  const columnDefs: ColDef[] = [
    {
      field: "name",
      headerName: "School Name",
      width: 200,
      cellRenderer: SchoolNameCellRenderer,
      ...createTextFilter(),
      valueGetter: (params) => params.data.shortName || params.data.name,
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
      sort: 'asc',
    },
    {
      field: "stageStatus",
      headerName: "Stage/Status",
      width: 140,
      cellRenderer: StatusBadgeCellRenderer,
      // Prefer Enterprise Set Filter with ordered values; otherwise fall back to text filter
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
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
      field: "membershipStatus",
      headerName: "Membership Status",
      width: 160,
      cellRenderer: MembershipStatusCellRenderer,
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
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
      field: "currentTLs",
      headerName: "Current TLs",
      width: 120,
      cellRenderer: CurrentTLsCellRenderer,
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
      field: "agesServed",
      headerName: "Ages Served",
      width: 140,
      cellRenderer: MultiValueCellRenderer,
      filter: entReady ? 'agSetColumnFilter' : 'agTextColumnFilter',
      filterParams: entReady ? ({ values: AGES_SERVED_OPTIONS } as any) : { defaultOption: 'contains', debounceMs: 150 },
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || '';
      },
    },
    {
      field: "governanceModel",
      headerName: "Governance Model",
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
      headerName: "Actions",
      width: 100,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

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
          ...DEFAULT_GRID_PROPS,
          getRowId: (p:any)=>p?.data?.id,
          onGridReady: (params: GridReadyEvent) => {
            params.api.sizeColumnsToFit();
          },
          onFirstDataRendered: (ev: any) => {
            try {
              if (entReady) {
                // Enterprise: preselect allowed set (ordered) including blanks
                ev.api.setFilterModel({
                  stageStatus: { filterType: 'set', values: STAGE_STATUS_DEFAULT } as any,
                } as any);
              } else {
                // Community: fall back to text filter excluding Paused
                ev.api.setFilterModel({
                  stageStatus: { filterType: 'text', type: 'notEqual', filter: 'Paused' },
                } as any);
              }
            } catch {}
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
