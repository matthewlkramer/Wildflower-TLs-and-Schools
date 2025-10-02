import React, { useMemo, useState } from 'react';
import { useGridSchools, useSchoolDetails } from '../api/queries';
import { GridBase } from '@/shared/components/GridBase';
import type { ColDef } from 'ag-grid-community';
import { useLocation } from 'wouter';
import { SCHOOL_GRID } from '../views';
import { SCHOOL_FIELD_METADATA } from '../views';
import { SCHOOL_VIEW_SPEC } from '../views';
import { asTabs } from '@/shared/views/types';
import { supabase } from '@/core/supabase/client';
import { SavedViewsManager } from '@/shared/components/SavedViewsManager';
import { GridPageHeader } from '@/shared/components/GridPageHeader';
import { Input } from '@/shared/components/ui/input';
import { Button as MButton, Menu, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { DetailsRenderer } from '@/shared/components';
import type { SavedView } from '@/shared/hooks/useSavedViews';

export function SchoolsSplitPage() {
  const { data = [], isLoading } = useGridSchools();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [gridApi, setGridApi] = useState<any>(null);
  const [vmAnchor, setVmAnchor] = useState<null | HTMLElement>(null);
  const openVm = Boolean(vmAnchor);

  // Get details for selected school
  const { data: selectedSchoolData } = useSchoolDetails(selectedSchoolId || '');

  // Auto-select first school if none selected
  React.useEffect(() => {
    if (data.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(String(data[0].id));
    }
  }, [data, selectedSchoolId]);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Create all columns for filtering, but hide all except the name column
    for (const config of SCHOOL_GRID) {
      if (!keySet.has(config.field)) continue;
      if (config.visibility === 'suppress') continue;

      const def: ColDef<any> = { field: config.field, headerName: config.headerName };
      
      // Hide all columns except the name column
      const nameField = SCHOOL_GRID.find(c => c.sortKey)?.field || 'school_name';
      if (config.field !== nameField) {
        def.hide = true;
      } else {
        // For the visible name column, remove header controls
        def.flex = 1;
        def.sortable = true;
        def.sort = 'asc';
        def.suppressHeaderMenuButton = true;
        def.suppressHeaderFilterButton = true;
        def.floatingFilter = false;
      }

      // Add appropriate filters for all columns
      switch (config.valueType) {
        case 'select':
          def.filter = 'agSetColumnFilter';
          if (config.selectOptions && config.selectOptions.length) {
            def.filterParams = { values: config.selectOptions as any } as any;
          } else if (config.lookupField) {
            const [table, column] = config.lookupField.split('.');
            def.filterParams = {
              values: (p: any) => {
                const svc = table.startsWith('ref_') ? (supabase as any).schema('ref_tables') : (supabase as any);
                svc.from(table).select(column).order(column, { ascending: true }).then(({ data, error }: any) => {
                  if (error) { p.success([]); return; }
                  const vals = Array.from(new Set((data || []).map((r: any) => r?.[column]).filter((v: any) => v != null))).map((v: any) => String(v));
                  p.success(vals);
                });
              }
            } as any;
          } else if (config.enumName) {
            def.filterParams = {
              values: (p: any) => {
                (supabase as any).rpc('enum_values', { enum_type: config.enumName }).then(({ data, error }: any) => {
                  if (error) { p.success([]); return; }
                  const vals = Array.isArray(data) ? data.map((r: any) => r.value ?? r).map(String) : [];
                  p.success(vals);
                });
              }
            } as any;
          }
          break;
        case 'multi':
          def.filter = 'agTextColumnFilter';
          def.valueFormatter = (p: any) => Array.isArray(p.value) ? p.value.join(', ') : (p.value ?? '');
          break;
        case 'boolean':
          def.filter = 'agSetColumnFilter';
          def.filterParams = { values: ['Yes', 'No'] } as any;
          def.valueFormatter = (p: any) => {
            const v = p.value;
            if (v === true || v === 'true' || v === 1) return 'Yes';
            if (v === false || v === 'false' || v === 0) return 'No';
            return v ?? '';
          };
          break;
        case 'number':
          def.filter = 'agNumberColumnFilter';
          break;
        case 'date':
          def.filter = 'agDateColumnFilter';
          break;
        default:
          def.filter = 'agTextColumnFilter';
          break;
      }

      defs.push(def);
    }

    return defs;
  }, [data]);

  if (isLoading) return <div>Loading schools...</div>;

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'table') {
      navigate('/schools');
    } else if (viewMode === 'kanban') {
      navigate('/schools/kanban');
    }
    // split view stays on current page
  };

  const handleApplySavedView = (view: SavedView) => {
    if (!gridApi) return;

    // Apply quick filter
    setQuick(view.quickFilter);
    gridApi.setGridOption('quickFilterText', view.quickFilter);

    // Apply all filters from saved view
    if (view.filters && Object.keys(view.filters).length > 0) {
      gridApi.setFilterModel(view.filters);
    }

    // Apply column state and sorting
    if (view.columnState && view.columnState.length > 0) {
      gridApi.applyColumnState({
        state: view.columnState,
        applyOrder: false // Don't change column order in split view
      });
    }

    if (view.sortModel && view.sortModel.length > 0) {
      gridApi.setSortModel(view.sortModel);
    }
  };

  const handleSaveCurrentView = () => {
    if (!gridApi) {
      return {
        filters: {},
        sortModel: [],
        columnState: [],
        quickFilter: quick
      };
    }

    return {
      filters: gridApi.getFilterModel() || {},
      sortModel: gridApi.getSortModel() || [],
      columnState: gridApi.getColumnState() || [],
      quickFilter: quick
    };
  };

  return (
    <div>
      {/* Top header without add new button */}
      <GridPageHeader 
        entityType="school"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="split"
        onViewModeChange={handleViewModeChange}
        // Don't pass onAddNew to hide the button
      />

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '16px' }}>
        {/* Left side - Single column grid */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          {/* Saved views above the grid */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SavedViewsManager
              entityType="school"
              onApplyView={handleApplySavedView}
              onSaveCurrentView={handleSaveCurrentView}
            />
          </div>
          
          <GridBase
            columnDefs={cols}
            rowData={data as any[]}
            gridOptions={{
              quickFilterText: quick,
              pagination: false,
              sideBar: {
                toolPanels: [
                  {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                  },
                ],
                position: 'right',
                hiddenByDefault: false,
              },
              onGridReady: (params) => {
                setGridApi(params.api);
                params.api.setSideBarVisible(true);
                params.api.openToolPanel('filters');
              },
              onRowClicked: (e) => {
                setSelectedSchoolId(String(e.data.id));
              },
              onSelectionChanged: (e) => {
                const selectedRows = e.api.getSelectedRows();
                if (selectedRows.length > 0) {
                  setSelectedSchoolId(String(selectedRows[0].id));
                }
              },
              rowSelection: {
                mode: 'singleRow',
                enableClickSelection: true,
                checkboxes: false
              },
            }}
          />
        </div>

        {/* Right side - Detail view */}
        <div style={{ flex: 1, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: 12 }}>
          {selectedSchoolId && selectedSchoolData ? (
            <DetailsRenderer
              entityId={selectedSchoolId}
              tabs={asTabs(SCHOOL_VIEW_SPEC)}
            />
          ) : (
            <div style={{ padding: '20px', color: '#6b7280' }}>
              Select a school from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
