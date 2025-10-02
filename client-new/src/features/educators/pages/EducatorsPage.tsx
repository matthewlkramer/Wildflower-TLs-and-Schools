import React, { useEffect, useMemo, useState } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { GridBase } from '@/shared/components/GridBase';
import { createGridActionColumn } from '@/shared/components/GridRowActionsCell';
import type { ColDef } from 'ag-grid-community';
import { useGridEducators } from '../api/queries';
import { useLocation } from 'wouter';
import { EDUCATOR_GRID } from '../views';
// Removed unused constants import
import { supabase } from '@/core/supabase/client';
import { GridPageHeader } from '@/shared/components/GridPageHeader';
import type { SavedView } from '@/shared/hooks/useSavedViews';

export function EducatorsPage() {
  const { data = [], isLoading } = useGridEducators();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [lookups, setLookups] = useState<Record<string, Record<string, string>>>({});

  // Preload lookup maps for columns that specify `lookupField` (table.labelColumn).
  // Load on mount; refresh cells when lookups change or grid becomes ready.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = EDUCATOR_GRID.filter((c) => Boolean((c as any).lookupField)).map((c) => (c as any).lookupField as string);
      const distinct = Array.from(new Set(entries));
      const next: Record<string, Record<string, string>> = {};
      for (const key of distinct) {
        if (!key) continue;
        const [table, labelColumn] = key.split('.');
        if (!table || !labelColumn) continue;
        const sel = `value, ${labelColumn}`;
        const svc = table.startsWith('ref_') ? (supabase as any).schema('ref_tables') : (supabase as any);
        const { data, error } = await svc.from(table).select(sel).order(labelColumn, { ascending: true });
        if (cancelled) return;
        if (!error && Array.isArray(data)) {
          const map: Record<string, string> = {};
          for (const row of data) {
            const v = row?.value;
            const lbl = row?.[labelColumn];
            if (v != null) map[String(v)] = String(lbl ?? v);
          }
          next[key] = map;
        }
      }
      if (!cancelled) setLookups((prev) => ({ ...prev, ...next }));
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (gridApi) {
      try { gridApi.refreshCells({ force: true }); } catch {}
    }
  }, [lookups, gridApi]);

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const defs: ColDef<any>[] = [];

    // Automatic selection column is provided by baseGridOptions; no manual checkbox column here

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
                const svc = table.startsWith('ref_') ? (supabase as any).schema('ref_tables') : (supabase as any);
                svc.from(table).select(column).order(column, { ascending: true }).then(({ data, error }: any) => {
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
          if (config.lookupField) {
            const key = config.lookupField;
            const map = lookups[key] as Record<string, string> | undefined;
            // Race/Ethnicity: use set filter with canonical options and label mapping
            if (config.field === 'race_ethnicity') {
              def.filter = 'agSetColumnFilter';
              const deriveUnique = (): string[] => {
                const set = new Set<string>();
                for (const row of data) {
                  const raw = (row as any)?.[config.field];
                  if (Array.isArray(raw)) raw.forEach((x: any) => set.add(String(x)));
                  else if (raw != null) set.add(String(raw));
                }
                return Array.from(set.values());
              };
              const values = map ? Object.keys(map) : deriveUnique();
              def.filterParams = {
                values,
                valueFormatter: (p: any) => (map && p?.value != null ? (map[String(p.value)] ?? String(p.value)) : String(p?.value ?? '')),
              } as any;
              def.cellRenderer = BadgesRenderer as any;
              def.cellRendererParams = { map } as any;
            } else {
              // Other multi with lookup: text filter on labels
              def.filter = 'agTextColumnFilter';
              def.valueFormatter = (p: any) => {
                const arr = Array.isArray(p.value) ? p.value : (p.value != null ? [p.value] : []);
                if (!map) return arr.map((x: any) => String(x)).join(', ');
                return arr.map((x: any) => map[String(x)] ?? String(x)).join(', ');
              };
            }
          } else {
            // No lookup: simple text filter over joined array
            def.filter = 'agTextColumnFilter';
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

      // Make school names clickable
      if (config.field === 'active_school') {
        def.cellRenderer = (p: any) => {
          const label = String(p.value ?? '').trim();
          if (!label) return '';
          // Separate the school name from any parenthetical status e.g. "School Name (Planning)"
          const parenIdx = label.indexOf(' (');
          const schoolName = parenIdx > -1 ? label.slice(0, parenIdx) : label;
          const trailing = parenIdx > -1 ? label.slice(parenIdx) : '';

          const handleClick = async (e: any) => {
            e?.stopPropagation?.();
            // Prefer direct id from row when available
            let schoolId: string | null = p?.data?.active_school_id ?? null;
            // Fallback to lookups if id not present
            if (!schoolId) {
              try {
                const ds = await (supabase as any).from('details_schools').select('id,long_name').eq('long_name', schoolName).maybeSingle();
                if (!ds.error && ds.data?.id) schoolId = String(ds.data.id);
              } catch {}
              if (!schoolId) {
                try {
                  const tryMatch = async (col: string) => {
                    const res = await (supabase as any).from('schools').select('id').eq(col, schoolName).maybeSingle();
                    return !res.error && res.data?.id ? String(res.data.id) : null;
                  };
                  schoolId = (await tryMatch('short_name')) || (await tryMatch('long_name')) || (await tryMatch('legal_name'));
                } catch {}
              }
            }
            if (schoolId) navigate(`/schools/${encodeURIComponent(schoolId)}`);
          };
          return (
            <span>
              <a href="#" onClick={handleClick} style={{ color: '#0f8a8d', textDecoration: 'underline', cursor: 'pointer' }}>{schoolName}</a>
              {trailing ? <span>{trailing}</span> : null}
            </span>
          );
        };
      }

      if (config.field === 'current_role_at_active_school') {
        def.cellRenderer = (p: any) => {
          const text = String(p.value ?? '').trim();
          if (!text) return '';
          // Heuristic: extract school name after the last ' at '
          const idx = text.toLowerCase().lastIndexOf(' at ');
          const role = idx > -1 ? text.slice(0, idx) : text;
          const schoolLabelRaw = idx > -1 ? text.slice(idx + 4).trim() : '';
          // Separate the school name from any parenthetical status
          const parenIdx2 = schoolLabelRaw.indexOf(' (');
          const schoolLabel = parenIdx2 > -1 ? schoolLabelRaw.slice(0, parenIdx2) : schoolLabelRaw;
          const trailing2 = parenIdx2 > -1 ? schoolLabelRaw.slice(parenIdx2) : '';
          const handleClick = async (e: any) => {
            e?.stopPropagation?.();
            if (!schoolLabel && !p?.data?.active_school_id) return;
            let schoolId: string | null = p?.data?.active_school_id ?? null;
            if (!schoolId && schoolLabel) {
              try {
                const ds = await (supabase as any).from('details_schools').select('id,long_name').eq('long_name', schoolLabel).maybeSingle();
                if (!ds.error && ds.data?.id) schoolId = String(ds.data.id);
              } catch {}
              if (!schoolId) {
                try {
                  const tryMatch = async (col: string) => {
                    const res = await (supabase as any).from('schools').select('id').eq(col, schoolLabel).maybeSingle();
                    return !res.error && res.data?.id ? String(res.data.id) : null;
                  };
                  schoolId = (await tryMatch('short_name')) || (await tryMatch('long_name')) || (await tryMatch('legal_name'));
                } catch {}
              }
            }
            if (schoolId) navigate(`/schools/${encodeURIComponent(schoolId)}`);
          };
          return (
            <span>
              <span>{role}</span>
              {schoolLabel ? (
                <>
                  <span>{' at '}</span>
                  <a href="#" onClick={handleClick} style={{ color: '#0f8a8d', textDecoration: 'underline', cursor: 'pointer' }}>{schoolLabel}</a>
                  {trailing2 ? <span>{trailing2}</span> : null}
                </>
              ) : null}
            </span>
          );
        };
      }

      // Ensure multi-select arrays are searchable via text filter
      if (config.valueType === 'multi') {
        if (!def.filter) def.filter = 'agTextColumnFilter';
        const key = (config as any).lookupField as string | undefined;
        def.filterValueGetter = ((p: any) => {
          const v = p.value;
          const arr: any[] = Array.isArray(v) ? v : (v != null ? [v] : []);
          if (key && lookups[key]) {
            const map = lookups[key];
            return arr.map((x) => map[String(x)] ?? String(x)).join(', ');
          }
          return arr.map((x) => String(x)).join(', ');
        }) as any;
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

    // Remove right divider on the last data column before actions
    if (defs.length > 0) {
      const last = defs[defs.length - 1] as any;
      const prev = (last.headerClass as string) || '';
      last.headerClass = (prev ? prev + ' ' : '') + 'no-right-border';
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
        selectedCount={selectedCount}
        currentViewMode="table"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => console.log('Add new educator')}
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
            hiddenByDefault: true,
          },
          onGridReady: (params) => {
            setGridApi(params.api);
            // Hide the side bar icon rail by default; open via header buttons
            params.api.setSideBarVisible(false);
            params.api.closeToolPanel();
            try {
              const usp = new URLSearchParams(window.location.search);
              const panel = usp.get('panel');
              if (panel === 'columns' || panel === 'filters') {
                params.api.setSideBarVisible(true);
                params.api.openToolPanel(panel);
                // clean query param without reload
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
              if (colId && colId.startsWith('__educator_actions')) return;
            }
            navigate(`/educators/${e.data.id}`);
          },
        }}
      />
    </div>
  );
}
