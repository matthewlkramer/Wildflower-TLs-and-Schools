import React, { useEffect, useMemo, useState } from 'react';
import { useGridCharters } from '../api/queries';
import KanbanBoard from '@/components/shared/KanbanBoard';
import { CHARTER_KANBAN_CONSTANTS_TABLE, CHARTER_GRID } from '../views';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import { useLocation } from 'wouter';
import type { SavedView } from '@/hooks/useSavedViews';

export function ChartersKanbanPage() {
  const { data = [], isLoading } = useGridCharters();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const groupField = CHARTER_GRID.find((c) => c.kanbanKey)?.field || 'status';
  // Kanban-specific UI state
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const storageKeyCols = 'kanban-columns-charters';
  const storageKeyFilters = 'kanban-filters-charters';
  const [cardFields, setCardFields] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyCols) || '[]'); } catch { return []; }
  });
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyFilters) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(storageKeyCols, JSON.stringify(cardFields)); }, [cardFields]);
  useEffect(() => { localStorage.setItem(storageKeyFilters, JSON.stringify(filters)); }, [filters]);
  const queryClient = useQueryClient();

  const constantsTable = CHARTER_KANBAN_CONSTANTS_TABLE;
  const { data: constants = [] } = useQuery({
    queryKey: ['kanban-constants', constantsTable],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(constantsTable).select('*');
      if (error) throw error; return data || [];
    }
  });
  const constMap = useMemo(() => {
    const m = new Map<string, { order?: number; visibility?: 'expanded'|'collapsed'|'suppressed'; label?: string }>();
    for (const r of constants as any[]) {
      const key = String((r as any).value ?? '').trim();
      if (!key) continue;
      const visRaw = String((r as any).kanban_visibility ?? '').toLowerCase();
      const vis = visRaw === 'collapsed' ? 'collapsed' : visRaw === 'suppressed' ? 'suppressed' : visRaw === 'expanded' ? 'expanded' : undefined;
      const num = Number((r as any).order);
      const order = Number.isFinite(num) ? num : undefined;
      m.set(key, { order, visibility: vis, label: (r as any).label ?? undefined });
    }
    return m;
  }, [constants]);

  const suppressedKeys = useMemo(() => {
    const s = new Set<string>();
    for (const [k, v] of constMap.entries()) if (v.visibility === 'suppressed') s.add(k);
    return s;
  }, [constMap]);

  // Filter by quick filter text if provided
  const quickFilteredData = useMemo(() => {
    if (!quick.trim()) return data;
    const searchText = quick.toLowerCase();
    return data.filter((item: any) => {
      // Search in common text fields for charters
      const searchableFields = ['charter_name', 'name', 'full_name', 'short_name', 'status', 'city', 'state'];
      return searchableFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchText);
      });
    });
  }, [data, quick]);

  const filteredByPanel = useMemo(() => {
    const entries = Object.entries(filters).filter(([, vals]) => Array.isArray(vals) && vals.length > 0);
    if (entries.length === 0) return quickFilteredData;
    return quickFilteredData.filter((row: any) => {
      return entries.every(([field, vals]) => {
        const v = (row as any)[field];
        if (v == null) return false;
        if (Array.isArray(v)) {
          const set = new Set(vals.map(String));
          return v.some((x) => set.has(String(x)));
        }
        return vals.map(String).includes(String(v));
      });
    });
  }, [quickFilteredData, filters]);

  const filteredItems = useMemo(() => filteredByPanel.filter((r: any) => {
    const v = r[groupField];
    const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
    return !suppressedKeys.has(key);
  }), [filteredByPanel, groupField, suppressedKeys]);

  const groupKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const [k] of constMap.entries()) if (!suppressedKeys.has(k)) keys.add(k);
    for (const r of filteredItems) {
      const v = (r as any)[groupField];
      const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
      if (!suppressedKeys.has(key)) keys.add(key);
    }
    if (!keys.has('__UNSPECIFIED__')) keys.add('__UNSPECIFIED__');
    return Array.from(keys).sort((a, b) => {
      const aoRaw = constMap.get(a)?.order;
      const boRaw = constMap.get(b)?.order;
      const ao = Number.isFinite(aoRaw as number) ? (aoRaw as number) : Number.POSITIVE_INFINITY;
      const bo = Number.isFinite(boRaw as number) ? (boRaw as number) : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return a.localeCompare(b);
    });
  }, [filteredItems, groupField, constMap, suppressedKeys]);


  const primarySort = useMemo(() => (CHARTER_GRID.find((c: any) => c.sortKey)?.field) || 'charter_name', []);
  const columns = useMemo(() => groupKeys.map((k) => ({
    key: k,
    label: k === '__UNSPECIFIED__' ? 'Unspecified' : (constMap.get(k)?.label ?? k),
    sortBy: (a: any, b: any) => String(a?.[primarySort] ?? '').localeCompare(String(b?.[primarySort] ?? '')),
  })), [groupKeys, primarySort, constMap]);

  const initialCollapsed = useMemo(() => {
    const set = new Set<string>();
    for (const [k, v] of constMap.entries()) if (v.visibility === 'collapsed') set.add(k);
    const counts = new Map<string, number>();
    for (const r of filteredItems) {
      const v = (r as any)[groupField];
      const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    set.add('__UNSPECIFIED__');
    for (const [k, v] of constMap.entries()) {
      if (v.visibility === 'expanded' && (counts.get(k) ?? 0) === 0) set.add(k);
    }
    return Array.from(set);
  }, [constMap, filteredItems, groupField]);

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'table') {
      navigate('/charters');
    } else if (viewMode === 'split') {
      navigate('/charters/split');
    }
    // kanban view stays on current page
  };

  const handleApplySavedView = (view: SavedView) => {
    // Apply quick filter for kanban view
    setQuick(view.quickFilter);
  };

  const handleSaveCurrentView = () => {
    return {
      filters: {},
      sortModel: [],
      columnState: [],
      quickFilter: quick
    };
  };

  return (
    <div>
      <GridPageHeader 
        entityType="charter"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="kanban"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => console.log('Add new charter')}
        onApplySavedView={handleApplySavedView}
        onSaveCurrentView={handleSaveCurrentView}
        onOpenColumnsPanel={() => setShowColumns(true)}
        onOpenFiltersPanel={() => setShowFilters(true)}
      />
      <KanbanBoard<any>
        items={filteredItems}
        columns={columns}
        groupBy={(it) => (it as any)[groupField]}
        getId={(it) => String((it as any).id)}
        initialCollapsedKeys={initialCollapsed}
        onItemMove={async ({ id, to }) => {
          const newVal = to === '__UNSPECIFIED__' ? null : to;
          const { error } = await supabase.from('charters').update({ [groupField]: newVal }).eq('id', id);
          if (error) {
            console.error('Failed to move charter', error);
          } else {
            queryClient.invalidateQueries({ queryKey: ['view/grid_charter'] });
          }
        }}
        onCardClick={(item) => {
          const id = String((item as any).id);
          navigate(`/charters/${id}`);
        }}
        renderCard={(c) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{(c as any).charter_name || (c as any).full_name || (c as any).short_name || ''}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{(c as any).status || ''}</div>
            {cardFields.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cardFields.map((f) => (
                  <div key={f} style={{ fontSize: 11, color: '#334155' }}>
                    <span style={{ color: '#64748b' }}>{(CHARTER_GRID.find((cc: any) => cc.field === f)?.headerName) || f}: </span>
                    <span>{renderFieldValue((c as any)[f])}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
      {showColumns && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setShowColumns(false)}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 520, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Choose Columns for Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, maxHeight: '50vh', overflow: 'auto' }}>
              {CHARTER_GRID.filter((cc: any) => cc.visibility !== 'suppress' && cc.field !== groupField).map((cc: any) => {
                const checked = cardFields.includes(cc.field);
                return (
                  <label key={cc.field} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      setCardFields((prev) => {
                        const set = new Set(prev);
                        if (e.target.checked) set.add(cc.field); else set.delete(cc.field);
                        return Array.from(set);
                      });
                    }} />
                    <span>{cc.headerName || cc.field}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => setShowColumns(false)} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setShowFilters(false)}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 520, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Set Filters</h3>
            <p style={{ marginTop: 0, marginBottom: 8, color: '#64748b', fontSize: 12 }}>Select values to include for each field.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '50vh', overflow: 'auto' }}>
              {CHARTER_GRID.filter((cc: any) => cc.visibility !== 'suppress').map((cc: any) => {
                const uniq = uniqueValues(filteredByPanel, cc.field);
                if (uniq.length === 0) return null;
                const sel = new Set(filters[cc.field] || []);
                return (
                  <div key={cc.field}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{cc.headerName || cc.field}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {uniq.map((val: any) => (
                        <label key={String(val)} style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '2px 8px', fontSize: 12, cursor: 'pointer' }}>
                          <input type="checkbox" checked={sel.has(String(val))} onChange={(e) => {
                            setFilters((prev) => {
                              const next = { ...prev } as Record<string, string[]>;
                              const s = new Set(next[cc.field] || []);
                              if (e.target.checked) s.add(String(val)); else s.delete(String(val));
                              next[cc.field] = Array.from(s);
                              if (next[cc.field].length === 0) delete next[cc.field];
                              return next;
                            });
                          }} style={{ marginRight: 6 }} />
                          {String(val)}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => setFilters({})} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Clear All</button>
              <div>
                <button type="button" onClick={() => setShowFilters(false)} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', marginRight: 8 }}>Close</button>
                <button type="button" onClick={() => setShowFilters(false)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function uniqueValues(rows: any[], field: string): any[] {
  const set = new Set<string>();
  for (const r of rows || []) {
    const v = r?.[field];
    if (v == null) continue;
    if (Array.isArray(v)) { for (const x of v) set.add(String(x)); }
    else set.add(String(v));
  }
  return Array.from(set.values());
}

function renderFieldValue(v: any) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
}
