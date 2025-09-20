import React, { useEffect, useMemo, useState } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { GridBase } from '@/components/shared/GridBase';
import { createGridActionColumn } from '@/components/shared/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridEducators } from '../api/queries';
import { useLocation } from 'wouter';
import { EDUCATOR_GRID, type EducatorColumnConfig } from '../constants';
import { supabase } from '@/lib/supabase/client';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import type { SavedView } from '@/hooks/useSavedViews';

export function EducatorsPage() {
  const { data = [], isLoading } = useGridEducators();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [lookups, setLookups] = useState<Record<string, Record<string, string>>>({});

  // Preload lookup maps for columns that specify `lookupField` (table.labelColumn).
  useEffect(() => {
    let cancelled = false;
    async function loadLookups() {
      const entries = EDUCATOR_GRID.filter((c) => Boolean((c as any).lookupField)).map((c) => (c as any).lookupField as string);
      const distinct = Array.from(new Set(entries));
      const next: Record<string, Record<string, string>> = { ...lookups };
      for (const key of distinct) {
        if (!key || next[key]) continue;
        const [table, labelColumn] = key.split('.');
        if (!table || !labelColumn) continue;
        const sel = `value, ${labelColumn}`;
        const { data, error } = await (supabase as any).from(table).select(sel).order(labelColumn, { ascending: true });
        if (!cancelled && !error && Array.isArray(data)) {
          const map: Record<string, string> = {};
          for (const row of data) {
            const v = row?.value;
            const lbl = row?.[labelColumn];
            if (v != null) map[String(v)] = String(lbl ?? v);
          }
          next[key] = map;
        }
      }
      if (!cancelled) {
        setLookups(next);
        if (gridApi) gridApi.refreshCells({ force: true });
      }
    }
    loadLookups();
    return () => { cancelled = true; };
  }, [gridApi]);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Simple badge renderer for arrays (used for race_ethnicity)
    const BadgesRenderer: React.FC<ICellRendererParams & { map?: Record<string, string> }> = (p) => {
      const map = (p as any).map as Record<string, string> | undefined;
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
              {(map && map[String(v)]) || String(v)}
            </span>
          ))}
        </div>
      );
    };

    for (const config of EDUCATOR_GRID) {
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
            // Display mapping for select (single) using lookup map if present
            const key = config.lookupField;
            def.valueFormatter = (p: any) => {
              const v = p.value;
              if (v == null) return '';
              const map = lookups[key];
              if (!map) return String(v);
              return map[String(v)] ?? String(v);
            };
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
          if (config.lookupField) {
            const key = config.lookupField;
            // Display badges specifically for race_ethnicity; others remain comma-separated
            if (config.field === 'race_ethnicity') {
              def.cellRenderer = BadgesRenderer as any;
              def.cellRendererParams = { map: lookups[key] } as any;
            } else {
              def.valueFormatter = (p: any) => {
                const arr = Array.isArray(p.value) ? p.value : (p.value != null ? [p.value] : []);
                const map = lookups[key];
                if (!map) return arr.map((x: any) => String(x)).join(', ');
                return arr.map((x: any) => map[String(x)] ?? String(x)).join(', ');
              };
            }
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

    const sortCfg = EDUCATOR_GRID.find((c) => c.sortKey === true);
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

    defs.push(createGridActionColumn('educator'));
    return defs;
  }, [data]);


  if (isLoading) return <div>Loading educators.</div>;

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'kanban') {
      navigate('/educators/kanban');
    } else if (viewMode === 'split') {
      navigate('/educators/split');
    }
    // table view stays on current page
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
        entityType="educator"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="table"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => console.log('Add new educator')}
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
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
              },
              {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
              },
            ],
            position: 'right',
            hiddenByDefault: false, // show the slim sidebar with icons
          },
          onGridReady: (params) => {
            setGridApi(params.api);
            params.api.setSideBarVisible(true);
            params.api.closeToolPanel(); // keep it collapsed by default
          },
          onRowClicked: (e) => {
            const eventTarget = e.event instanceof Event ? (e.event.target as HTMLElement | null) : null;
            if (eventTarget) {
              if (eventTarget.closest('select.row-action-select')) return;
              const cellEl = eventTarget.closest('[col-id]');
              const colId = cellEl instanceof HTMLElement ? cellEl.getAttribute('col-id') : null;
              if (colId && colId.startsWith('__educator_actions')) return;
            }
            navigate(`/educators/${e.data.id}`);
          },
        }}
      />
    </div>
  );
}
