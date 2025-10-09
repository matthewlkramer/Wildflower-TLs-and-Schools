import React, { useEffect, useMemo, useState } from 'react';
import { useGridEducators } from '../api/queries';
import KanbanBoard from '@/shared/components/KanbanBoard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { EDUCATOR_KANBAN_CONSTANTS_TABLE, EDUCATOR_GRID } from '../views';
import { GridPageHeader } from '@/shared/components/GridPageHeader';
import { useLocation } from 'wouter';
import type { SavedView } from '@/shared/hooks/useSavedViews';
import { formatFieldLabel } from '@/shared/utils/ui-utils';

export function EducatorsKanbanPage() {
  const { data = [], isLoading } = useGridEducators();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const groupField = EDUCATOR_GRID.find((c) => c.kanbanKey)?.field || 'kanban_group';
  // Kanban-specific UI state
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const storageKeyCols = 'kanban-columns-educators';
  const storageKeyFilters = 'kanban-filters-educators';
  const [cardFields, setCardFields] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyCols) || '[]'); } catch { return []; }
  });
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyFilters) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(storageKeyCols, JSON.stringify(cardFields)); }, [cardFields]);
  useEffect(() => { localStorage.setItem(storageKeyFilters, JSON.stringify(filters)); }, [filters]);

  // Load constants for lane definitions: value (label), order, optional visibility
  const constantsTable = EDUCATOR_KANBAN_CONSTANTS_TABLE;
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
      // Search in common text fields
      const searchableFields = ['full_name', 'name', 'current_role', 'current_role_at_active_school', 'email'];
      return searchableFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchText);
      });
    });
  }, [data, quick]);

  // Apply Kanban filters (simple equals/contains across selected fields using unique values present)
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
    // From constants (ensures empty lanes show)
    for (const [k] of constMap.entries()) if (!suppressedKeys.has(k)) keys.add(k);
    // From data
    for (const r of filteredItems) {
      const v = (r as any)[groupField];
      const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
      if (!suppressedKeys.has(key)) keys.add(key);
    }
    if (!keys.has('__UNSPECIFIED__')) keys.add('__UNSPECIFIED__');
    // Sort by constants order if present, else alpha
    return Array.from(keys).sort((a, b) => {
      const aoRaw = constMap.get(a)?.order;
      const boRaw = constMap.get(b)?.order;
      const ao = Number.isFinite(aoRaw as number) ? (aoRaw as number) : Number.POSITIVE_INFINITY;
      const bo = Number.isFinite(boRaw as number) ? (boRaw as number) : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return a.localeCompare(b);
    });
  }, [filteredItems, groupField, constMap, suppressedKeys]);

  // Sort cards by module's primary sort field (from config) or name
  const primarySort = useMemo(() => (EDUCATOR_GRID.find((c: any) => c.sortKey)?.field) || 'full_name', []);
  const columns = useMemo(() => groupKeys.map((k) => ({
    key: k,
    label: k === '__UNSPECIFIED__' ? 'Unspecified' : formatFieldLabel(constMap.get(k)?.label ?? k),
    sortBy: (a: any, b: any) => String(a?.[primarySort] ?? '').localeCompare(String(b?.[primarySort] ?? '')),
  })), [groupKeys, primarySort, constMap]);

  const initialCollapsed = useMemo(() => {
    const set = new Set<string>();
    // Collapse those explicitly marked collapsed
    for (const [k, v] of constMap.entries()) if (v.visibility === 'collapsed') set.add(k);
    // Also collapse any lane marked expanded that currently has zero items
    const counts = new Map<string, number>();
    for (const r of filteredItems) {
      const v = (r as any)[groupField];
      const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const [k, v] of constMap.entries()) {
      if (v.visibility === 'expanded' && (counts.get(k) ?? 0) === 0) set.add(k);
    }
    // Always collapse unspecified
    set.add('__UNSPECIFIED__');
    return Array.from(set);
  }, [constMap, filteredItems, groupField]);

  const handleViewModeChange = (viewMode: string) => {
    if (viewMode === 'table') {
      navigate('/educators');
    } else if (viewMode === 'split') {
      navigate('/educators/split');
    }
    // kanban view stays on current page
  };

  const handleApplySavedView = (view: SavedView) => {
    // Apply quick filter for kanban view
    setQuick(view.quickFilter);
    // Note: Other filter settings don't apply to kanban view
  };

  const handleSaveCurrentView = () => {
    // For kanban view, we mainly save the quick filter
    return {
      filters: {}, // Kanban doesn't use grid filters
      sortModel: [], // Kanban has its own sorting
      columnState: [], // Kanban doesn't use columns
      quickFilter: quick
    };
  };

  return (
    <div>
      <GridPageHeader 
        entityType="educator"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="kanban"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => console.log('Add new educator')}
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
        onCardClick={(item) => {
          const id = String((item as any).id);
          navigate(`/educators/${id}`);
        }}
        renderCard={(t) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{(t as any).full_name || (t as any).name || ''}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{(t as any).current_role_at_active_school || (t as any).current_role || ''}</div>
            {cardFields.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cardFields.map((f) => (
                  <div key={f} style={{ fontSize: 11, color: '#334155' }}>
                    <span style={{ color: '#64748b' }}>{formatFieldLabel((EDUCATOR_GRID.find((c: any) => c.field === f)?.headerName) || f)}: </span>
                    <span>{renderFieldValue((t as any)[f])}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />

      {/* Columns modal */}
      {showColumns && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setShowColumns(false)}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 520, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Choose Columns for Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, maxHeight: '50vh', overflow: 'auto' }}>
              {EDUCATOR_GRID.filter((c: any) => c.visibility !== 'suppress' && c.field !== groupField).map((c: any) => {
                const checked = cardFields.includes(c.field);
                return (
                  <label key={c.field} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      setCardFields((prev) => {
                        const set = new Set(prev);
                        if (e.target.checked) set.add(c.field); else set.delete(c.field);
                        return Array.from(set);
                      });
                    }} />
                    <span>{formatFieldLabel(c.headerName || c.field)}</span>
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

      {/* Filters modal */}
      {showFilters && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setShowFilters(false)}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 520, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Set Filters</h3>
            <p style={{ marginTop: 0, marginBottom: 8, color: '#64748b', fontSize: 12 }}>Select values to include for each field.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '50vh', overflow: 'auto' }}>
              {EDUCATOR_GRID.filter((c: any) => c.visibility !== 'suppress').map((c: any) => {
                const uniq = uniqueValues(filteredByPanel, c.field);
                if (uniq.length === 0) return null;
                const sel = new Set(filters[c.field] || []);
                return (
                  <div key={c.field}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{formatFieldLabel(c.headerName || c.field)}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {uniq.map((val) => (
                        <label key={String(val)} style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '2px 8px', fontSize: 12, cursor: 'pointer' }}>
                          <input type="checkbox" checked={sel.has(String(val))} onChange={(e) => {
                            setFilters((prev) => {
                              const next = { ...prev } as Record<string, string[]>;
                              const s = new Set(next[c.field] || []);
                              if (e.target.checked) s.add(String(val)); else s.delete(String(val));
                              next[c.field] = Array.from(s);
                              // drop empty arrays to simplify
                              if (next[c.field].length === 0) delete next[c.field];
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
