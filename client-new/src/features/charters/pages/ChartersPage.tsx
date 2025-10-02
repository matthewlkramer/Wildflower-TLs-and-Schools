import React, { useMemo, useState } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { GridBase } from '@/shared/components/GridBase';
import { createGridActionColumn } from '@/shared/components/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridCharters } from '../api/queries';
import { useLocation } from 'wouter';
import { CHARTER_GRID } from '../views';
// Removed unused constants import
import { supabase } from '@/core/supabase/client';
import { GridPageHeader } from '@/shared/components/GridPageHeader';
import type { SavedView } from '@/shared/hooks/useSavedViews';

export function ChartersPage() {
  const { data = [], isLoading } = useGridCharters();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Automatic selection column is provided by baseGridOptions; no manual checkbox column here

    // Simple badge renderer for arrays (used for initial_target_planes)
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
          def.filterValueGetter = ((p: any) => {
            const v = p.value;
            const arr = Array.isArray(v) ? v : (v != null ? [v] : []);
            return arr.map((x) => String(x)).join(', ');
          }) as any;
          if (config.field === 'initial_target_planes') {
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

    // Remove right divider on the last data column before actions
    if (defs.length > 0) {
      const last = defs[defs.length - 1] as any;
      const prev = (last.headerClass as string) || '';
      last.headerClass = (prev ? prev + ' ' : '') + 'no-right-border';
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
        selectedCount={selectedCount}
        currentViewMode="table"
        onViewModeChange={handleViewModeChange}
        onAddNew={handleAddNew}
        onApplySavedView={handleApplySavedView}
        onSaveCurrentView={handleSaveCurrentView}
        onOpenColumnsPanel={() => {
          if (!gridApi) return;
          const opened = gridApi.getOpenedToolPanel?.();
          if (opened === 'columns') {
            gridApi.closeToolPanel();
            gridApi.setSideBarVisible(false);
          } else {
            gridApi.setSideBarVisible(true);
            gridApi.openToolPanel('columns');
          }
        }}
        onOpenFiltersPanel={() => {
          if (!gridApi) return;
          const opened = gridApi.getOpenedToolPanel?.();
          if (opened === 'filters') {
            gridApi.closeToolPanel();
            gridApi.setSideBarVisible(false);
          } else {
            gridApi.setSideBarVisible(true);
            gridApi.openToolPanel('filters');
          }
        }}
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
            hiddenByDefault: true,
          },
          onGridReady: (params) => {
            setGridApi(params.api);
            params.api.setSideBarVisible(false);
            params.api.closeToolPanel();
            try {
              const usp = new URLSearchParams(window.location.search);
              const panel = usp.get('panel');
              if (panel === 'columns' || panel === 'filters') {
                params.api.setSideBarVisible(true);
                params.api.openToolPanel(panel);
                const url = new URL(window.location.href);
                url.searchParams.delete('panel');
                window.history.replaceState({}, '', url.toString());
              }
            } catch {}
          },
          onSelectionChanged: (e) => {
            try { setSelectedCount(e.api.getSelectedRows().length); } catch {}
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
