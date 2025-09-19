import React, { useMemo, useState } from 'react';
import { GridBase } from '@/components/shared/GridBase';
import { createGridActionColumn } from '@/components/shared/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridCharters } from '../api/queries';
import { useLocation } from 'wouter';
import { CHARTER_GRID, type CharterColumnConfig } from '../constants';
import { supabase } from '@/lib/supabase/client';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import type { SavedView } from '@/hooks/useSavedViews';

export function ChartersPage() {
  const { data = [], isLoading } = useGridCharters();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    for (const config of CHARTER_GRID) {
      if (!keySet.has(config.field)) continue;
      if (config.visibility === 'suppress') continue;

      const def: ColDef<any> = { field: config.field, headerName: config.headerName };
      if (config.visibility === 'hide') def.hide = true;

      switch (config.valueType) {
        case 'select':
          def.filter = 'agSetColumnFilter';
          if (config.selectOptions && config.selectOptions.length) {
            def.filterParams = { values: config.selectOptions as any } as any;
          } else if (config.lookupField) {
            const [table, column] = config.lookupField.split('.');
            def.filterParams = {
              values: (p: any) => {
                (supabase as any).from(table).select(column).order(column, { ascending: true }).then(({ data, error }: any) => {
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
          break;
      }

      defs.push(def);
    }

    const sortCfg = CHARTER_GRID.find((c) => c.sortKey === true);
    if (sortCfg) {
      const col = defs.find((d) => d.field === sortCfg.field);
      if (col) {
        col.sortable = true;
        col.sort = 'asc';
      }
    } else {
      const nameCol = defs.find((d) => d.field === 'full_name' || d.field === 'name' || d.field === 'short_name');
      if (nameCol) {
        nameCol.headerName = 'Name';
        nameCol.sortable = true;
        nameCol.sort = 'asc';
      }
    }

    defs.push(createGridActionColumn('charter'));
    return defs;
  }, [data]);


  if (isLoading) return <div>Loading charters.</div>;

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'kanban') {
      navigate('/charters/kanban');
    } else if (viewMode === 'split') {
      navigate('/charters/split');
    }
    // table view stays on current page
  };

  const handleAddNew = () => {
    console.log('Add new charter');
  };

  const handleApplySavedView = (view: SavedView) => {
    if (!gridApi) return;

    // Apply quick filter
    setQuick(view.quickFilter);
    gridApi.setGridOption('quickFilterText', view.quickFilter);

    // Apply column state (visibility, width, order)
    gridApi.applyColumnState({
      state: view.columnState,
      applyOrder: true
    });

    // Apply sorting
    gridApi.setSortModel(view.sortModel);

    // Apply filters
    Object.keys(view.filters).forEach(colId => {
      const filterModel = view.filters[colId];
      gridApi.setFilterModel({
        [colId]: filterModel
      });
    });
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
      <GridPageHeader 
        entityType="charter"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="table"
        onViewModeChange={handleViewModeChange}
        onAddNew={handleAddNew}
        onApplySavedView={handleApplySavedView}
        onSaveCurrentView={handleSaveCurrentView}
      />
      <GridBase
        columnDefs={cols}
        rowData={data as any[]}
        gridOptions={{
          quickFilterText: quick,
          pagination: false,
          sideBar: {
            toolPanels: [
              { id: 'columns', labelDefault: 'Columns', labelKey: 'columns', iconKey: 'columns', toolPanel: 'agColumnsToolPanel' },
              { id: 'filters', labelDefault: 'Filters', labelKey: 'filters', iconKey: 'filter', toolPanel: 'agFiltersToolPanel' },
            ],
            position: 'right',
            hiddenByDefault: false,
          },
          onGridReady: (params) => {
            setGridApi(params.api);
            params.api.setSideBarVisible(true);
            params.api.closeToolPanel();
          },
          onRowClicked: (e) => {
            const eventTarget = e.event instanceof Event ? (e.event.target as HTMLElement | null) : null;
            if (eventTarget) {
              if (eventTarget.closest('select.row-action-select')) return;
              const cellEl = eventTarget.closest('[col-id]');
              const colId = cellEl instanceof HTMLElement ? cellEl.getAttribute('col-id') : null;
              if (colId && colId.startsWith('__charter_actions')) return;
            }
            navigate(`/charters/${e.data.id}`);
          },
        }}
      />
    </div>
  );
}
