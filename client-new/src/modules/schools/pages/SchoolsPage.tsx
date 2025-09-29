import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { GridBase } from '@/components/shared/GridBase';
import { createGridActionColumn } from '@/components/shared/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridSchools } from '../api/queries';
import { useLocation } from 'wouter';
import { SCHOOL_GRID, type SchoolColumnConfig, SCHOOL_FIELD_METADATA } from '../constants';
import { CreateSchoolModal } from '../components/CreateSchoolModal';
import { supabase } from '@/lib/supabase/client';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import type { SavedView } from '@/hooks/useSavedViews';

export function SchoolsPage() {
  const { data = [], isLoading } = useGridSchools();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [lookupOptions, setLookupOptions] = useState<Record<string, string[]>>({});
  const [lookupLabelMaps, setLookupLabelMaps] = useState<Record<string, Record<string, string>>>({});

  const getUniqueValuesFromData = useCallback((field: string): string[] => {
    const set = new Set<string>();
    for (const row of data) {
      const raw = (row as any)?.[field];
      if (Array.isArray(raw)) {
        for (const item of raw) {
          if (item != null) set.add(String(item));
        }
      } else if (raw != null) {
        set.add(String(raw));
      }
    }
    return Array.from(set.values());
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    async function loadLookups() {
      const nextOptions: Record<string, string[]> = {};
      const nextLabels: Record<string, Record<string, string>> = {};
      await Promise.all(
        SCHOOL_GRID.map(async (config) => {
          let values: string[] | null = null;
          let labelMap: Record<string, string> | undefined;
          try {
            const gridLookupField = (config as any).lookupField as string | undefined;
            if (gridLookupField) {
              const [rawTable, rawColumn] = gridLookupField.split('.');
              const fieldMeta = (SCHOOL_FIELD_METADATA as Record<string, any>)[config.field] || undefined;
              const lookupMeta = fieldMeta?.lookup;
              const table = lookupMeta?.table ?? rawTable;
              // If only a single column is provided via lookupField (table.labelColumn),
              // assume the value column is the standard 'value' and the label column is the provided one.
              const valueColumn = lookupMeta?.valueColumn ?? 'value';
              const labelColumn = lookupMeta?.labelColumn ?? rawColumn;
              const selectCols = valueColumn === labelColumn ? valueColumn : `${valueColumn}, ${labelColumn}`;
              const { data: rows, error } = await (supabase as any)
                .from(table)
                .select(selectCols)
                .order(labelColumn, { ascending: true });
              if (!error && Array.isArray(rows)) {
                const seen = new Set<string>();
                const vals: string[] = [];
                const labels: Record<string, string> = {};
                for (const row of rows) {
                  const rawValue = row?.[valueColumn];
                  if (rawValue == null) continue;
                  const val = String(rawValue);
                  if (!seen.has(val)) {
                    seen.add(val);
                    vals.push(val);
                  }
                  const rawLabel = row?.[labelColumn];
                  if (rawLabel != null) labels[val] = String(rawLabel);
                }
                if (vals.length) {
                  values = vals;
                  if (Object.keys(labels).length) labelMap = labels;
                }
              }
            } else if ((config as any).enumName) {
              const enumType = (config as any).enumName as string;
              const { data: rows, error } = await (supabase as any).rpc('enum_values', { enum_type: enumType });
              if (!error && Array.isArray(rows)) {
                const vals = rows.map((r: any) => String(r.value ?? r));
                if (vals.length) values = vals;
              }
            }
          } catch (_) {
            values = null;
          }

          if (!values || !values.length) {
            const fallback = getUniqueValuesFromData(config.field);
            if (fallback.length) values = fallback;
          }

          if (values && values.length) {
            nextOptions[config.field] = values;
          }
          if (labelMap && Object.keys(labelMap).length) {
            nextLabels[config.field] = labelMap;
          }
        })
      );

      if (!cancelled) {
        setLookupOptions(nextOptions);
        setLookupLabelMaps(nextLabels);
      }
    }

    loadLookups();
    return () => {
      cancelled = true;
    };
  }, [data, getUniqueValuesFromData]);

  const [showCreate, setShowCreate] = useState(false);
  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Automatic selection column is provided by baseGridOptions; no manual checkbox column here

    // Simple badge renderer for arrays (used for ages_served)
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
              {map?.[String(v)] ?? String(v)}
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
        case 'select': {
          def.filter = 'agSetColumnFilter';
          const options = config.selectOptions && config.selectOptions.length
            ? (config.selectOptions as any)
            : lookupOptions[config.field] ?? getUniqueValuesFromData(config.field);
          if (Array.isArray(options) && options.length) {
            def.filterParams = { values: options } as any;
          }
          break;
        }
        case 'multi': {
          if (config.field === 'ages_served') {
            def.filter = 'agSetColumnFilter';
            const values = lookupOptions[config.field] ?? getUniqueValuesFromData(config.field);
            if (values.length) {
              def.filterParams = { values } as any;
            }
            def.cellRenderer = BadgesRenderer as any;
          } else {
            def.filter = 'agTextColumnFilter';
            def.filterValueGetter = ((p: any) => {
              const v = p.value;
              const arr = Array.isArray(v) ? v : (v != null ? [v] : []);
              const map = lookupLabelMaps[config.field];
              return arr.map((x) => map?.[String(x)] ?? String(x)).join(', ');
            }) as any;
            def.valueFormatter = (p: any) => Array.isArray(p.value) ? p.value.join(', ') : (p.value ?? '');
          }
          break;
        }
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

      const labelMap = lookupLabelMaps[config.field];
      if (labelMap && Object.keys(labelMap).length) {
        if (config.valueType === 'multi') {
          const formatArray = (arr: any[]): string => arr.map((item) => labelMap[String(item)] ?? String(item)).join(', ');
          const originalFormatter = def.valueFormatter;
          def.valueFormatter = (p: any) => {
            const arr = Array.isArray(p.value) ? p.value : (p.value != null ? [p.value] : []);
            return formatArray(arr);
          };
          if (def.filter === 'agTextColumnFilter') {
            def.filterValueGetter = ((p: any) => {
              const arr = Array.isArray(p.value) ? p.value : (p.value != null ? [p.value] : []);
              return formatArray(arr);
            }) as any;
          }
          if (def.filter === 'agSetColumnFilter') {
            const existing = (def.filterParams ?? {}) as any;
            if (!existing.values) {
              const values = lookupOptions[config.field] ?? getUniqueValuesFromData(config.field);
              if (values.length) existing.values = values;
            }
            existing.valueFormatter = (params: any) => labelMap[String(params.value)] ?? String(params.value ?? '');
            def.filterParams = existing;
          }
          if (def.cellRenderer === (BadgesRenderer as any)) {
            def.cellRendererParams = { map: labelMap } as any;
          }
        } else {
          const formatValue = (value: any): string => {
            if (value == null) return '';
            if (Array.isArray(value)) {
              return value.map((item) => labelMap[String(item)] ?? String(item)).join(', ');
            }
            return labelMap[String(value)] ?? String(value);
          };
          def.valueFormatter = (p: any) => formatValue(p.value);
          if (def.filter === 'agSetColumnFilter') {
            const existing = (def.filterParams ?? {}) as any;
            if (!existing.values) {
              const values = lookupOptions[config.field] ?? getUniqueValuesFromData(config.field);
              if (values.length) existing.values = values;
            }
            existing.valueFormatter = (params: any) => labelMap[String(params.value)] ?? String(params.value ?? '');
            def.filterParams = existing;
          }
        }
      } else if (config.field === 'ages_served' && def.cellRenderer === (BadgesRenderer as any)) {
        def.cellRendererParams = undefined;
      }

      // Current TLs: render comma-separated links using parallel people_id array
      if (config.field === 'current_tls') {
        def.cellRenderer = (p: any) => {
          const names = typeof p.value === 'string' ? (p.value as string).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          const ids: any[] = Array.isArray(p?.data?.people_id) ? p.data.people_id : [];
          if (!names.length) return '';
          const parts: any[] = [];
          names.forEach((name: string, idx: number) => {
            const id = ids[idx];
            const click = (e: any) => { e?.stopPropagation?.(); if (id) navigate(`/educators/${encodeURIComponent(String(id))}`); };
            if (idx > 0) parts.push(<span key={`sep-${idx}`}>, </span>);
            parts.push(
              <a key={`tl-${idx}`} href="#" onClick={click} style={{ color: '#0f8a8d', textDecoration: 'underline', cursor: 'pointer' }}>
                {name}
              </a>
            );
          });
          return <span>{parts}</span>;
        };
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

    // Remove right divider on the last data column before actions
    if (defs.length > 0) {
      const last = defs[defs.length - 1] as any;
      const prev = (last.headerClass as string) || '';
      last.headerClass = (prev ? prev + ' ' : '') + 'no-right-border';
    }
    defs.push(createGridActionColumn('school'));
    return defs;
  }, [data, lookupOptions, lookupLabelMaps, getUniqueValuesFromData]);


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
        selectedCount={selectedCount}
        currentViewMode="table"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => setShowCreate(true)}
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
      <CreateSchoolModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => {
          // After create, navigate to detail page
          navigate(`/schools/${id}`);
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
              if (colId && colId.startsWith('__school_actions')) return;
            }
            navigate(`/schools/${e.data.id}`);
          },
        }}
      />
    </div>
  );
}
