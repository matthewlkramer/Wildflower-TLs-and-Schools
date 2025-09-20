import React, { useMemo, useState } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { GridBase } from '@/components/shared/GridBase';
import { createGridActionColumn } from '@/components/shared/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridSchools } from '../api/queries';
import { useLocation } from 'wouter';
import { SCHOOL_GRID, type SchoolColumnConfig } from '../constants';
import { supabase } from '@/lib/supabase/client';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import type { SavedView } from '@/hooks/useSavedViews';

export function SchoolsPage() {
  const { data = [], isLoading } = useGridSchools();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Simple badge renderer for arrays (used for ages_served)
    const BadgesRenderer: React.FC<ICellRendererParams> = (p) => {
      const arr = Array.isArray(p.value) ? p.value : (p.value != null ? [p.value] : []);
      if (!arr.length) return <></>;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {arr.map((v: any, idx: number) => (
            <span
              key={String(v) + idx}
              style={{
                fontSize: 12,
                background: '#e2e8f0',
                color: '#0f172a',
                borderRadius: 999,
                padding: '2px 8px',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              {String(v)}
            </span>
          ))}
        </div>
      );
    };

    for (const config of SCHOOL_GRID) {
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
          if (config.field === 'ages_served') {
            def.cellRenderer = BadgesRenderer as any;
          } else {
            def.valueFormatter = (p: any) => Array.isArray(p.value) ? p.value.join(', ') : (p.value ?? '');
          }
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

    const sortCfg = SCHOOL_GRID.find((c) => c.sortKey === true);
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

    defs.push(createGridActionColumn('school'));
    return defs;
  }, [data]);


  if (isLoading) return <div>Loading schools.</div>;

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'kanban') {
      navigate('/schools/kanban');
    } else if (viewMode === 'split') {
      navigate('/schools/split');
    }
    // table view stays on current page
  };

  const handleAddNew = () => {
    console.log('Add new school');
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
        entityType="school"
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
              if (colId && colId.startsWith('__school_actions')) return;
            }
            navigate(`/schools/${e.data.id}`);
          },
        }}
      />
    </div>
  );
}
