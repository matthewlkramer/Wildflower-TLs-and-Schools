import React, { useEffect, useMemo, useState } from 'react';
import { useGridSchools } from '../api/queries';
import KanbanBoard from '@/shared/components/KanbanBoard';
import { SCHOOL_KANBAN_CONSTANTS_TABLE, SCHOOL_GRID } from '../views';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { GridPageHeader } from '@/shared/components/GridPageHeader';
import { useLocation } from 'wouter';
import type { SavedView } from '@/shared/hooks/useSavedViews';

export function SchoolsKanbanPage() {
  const { data = [], isLoading } = useGridSchools();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const groupField = SCHOOL_GRID.find((c) => c.kanbanKey)?.field || 'stage_status';
  const queryClient = useQueryClient();
  // Kanban-specific UI state
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const storageKeyCols = 'kanban-columns-schools';
  const storageKeyFilters = 'kanban-filters-schools';
  const [cardFields, setCardFields] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyCols) || '[]'); } catch { return []; }
  });
  const [filtersPanel, setFiltersPanel] = useState<Record<string, string[]>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKeyFilters) || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem(storageKeyCols, JSON.stringify(cardFields)); }, [cardFields]);
  useEffect(() => { localStorage.setItem(storageKeyFilters, JSON.stringify(filtersPanel)); }, [filtersPanel]);

  // Enum options for modal selections
  const { data: ssjStages = [] } = useQuery({
    queryKey: ['enum', 'ssj_stages'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: 'ssj_stages' });
      if (error) throw error; return (data || []).map((r: any) => r.value);
    }
  });
  const { data: schoolStatuses = [] } = useQuery({
    queryKey: ['enum', 'school_statuses'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('enum_values', { enum_type: 'school_statuses' });
      if (error) throw error; return (data || []).map((r: any) => r.value);
    }
  });

  type ModalState = {
    open: boolean;
    id?: string;
    currentStage?: string | null;
    currentStatus?: string | null;
    stage?: string | null;
    status?: string | null;
  };
  const [modal, setModal] = useState<ModalState>({ open: false });

  // Load constants table
  const constantsTable = SCHOOL_KANBAN_CONSTANTS_TABLE;
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
      // Search in common text fields for schools
      const searchableFields = ['school_name', 'name', 'city', 'state', 'address', 'email'];
      return searchableFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchText);
      });
    });
  }, [data, quick]);

  // Apply modal filters
  const filteredByPanel = useMemo(() => {
    const entries = Object.entries(filtersPanel).filter(([, vals]) => Array.isArray(vals) && vals.length > 0);
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
  }, [quickFilteredData, filtersPanel]);

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


  const primarySort = useMemo(() => (SCHOOL_GRID.find((c: any) => c.sortKey)?.field) || 'school_name', []);
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
      navigate('/schools');
    } else if (viewMode === 'split') {
      navigate('/schools/split');
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
        entityType="school"
        quickFilter={quick}
        onQuickFilterChange={setQuick}
        currentViewMode="kanban"
        onViewModeChange={handleViewModeChange}
        onAddNew={() => console.log('Add new school')}
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
          const toKey = (to || '').toString().trim().toLowerCase();
          const item = (data as any[]).find((r: any) => String(r.id) === String(id));
          const currentStatus = item?.status ?? null;
          const currentStage = item?.ssj_stage ?? null;

          const isStage = ['visioning', 'planning', 'startup', 'year 1'].includes(toKey);
          const isTerminal = ['open', 'disaffiliated', 'permanently closed', 'perm. closed', 'perm closed'].includes(toKey);
          const isPausedOrUnspecified = toKey === 'paused' || to === '__UNSPECIFIED__';

          const stageMap: Record<string, string> = {
            'visioning': 'Visioning',
            'planning': 'Planning',
            'startup': 'Startup',
            'year 1': 'Year 1',
          };
          const statusMap: Record<string, string> = {
            'open': 'Open',
            'disaffiliated': 'Disaffiliated',
            'permanently closed': 'Permanently Closed',
            'perm. closed': 'Permanently Closed',
            'perm closed': 'Permanently Closed',
            'paused': 'Paused',
            'emerging': 'Emerging',
          };

          if (isStage) {
            const newStage = stageMap[toKey];
            try {
              const { error: e1 } = await supabase.from('schools').update({ status: 'Emerging' as any }).eq('id', id);
              if (e1) throw e1;
              const { error: e2 } = await (supabase as any).from('school_ssj_data').upsert({ school_id: id, ssj_stage: newStage });
              if (e2) throw e2;
            } catch (err) {
              console.error('Failed to update school/ssj_stage', err);
            } finally {
              queryClient.invalidateQueries({ queryKey: ['view/grid_school'] });
            }
            return;
          }

          if (isTerminal) {
            const newStatus = statusMap[toKey] as string;
            const newStage = 'Complete';
            try {
              const { error: e1 } = await supabase.from('schools').update({ status: newStatus as any }).eq('id', id);
              if (e1) throw e1;
              const { error: e2 } = await (supabase as any).from('school_ssj_data').upsert({ school_id: id, ssj_stage: newStage });
              if (e2) throw e2;
            } catch (err) {
              console.error('Failed to update school/ssj_stage', err);
            } finally {
              queryClient.invalidateQueries({ queryKey: ['view/grid_school'] });
            }
            return;
          }

          if (isPausedOrUnspecified) {
            setModal({
              open: true,
              id: String(id),
              currentStage,
              currentStatus,
              stage: currentStage,
              status: currentStatus,
            });
            return;
          }
        }}
        onCardClick={(item) => {
          const id = String((item as any).id);
          navigate(`/schools/${id}`);
        }}
        renderCard={(s) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{(s as any).school_name || (s as any).long_name || (s as any).short_name || ''}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{(s as any).stage_status || (s as any).status || ''}</div>
            {cardFields.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cardFields.map((f) => (
                  <div key={f} style={{ fontSize: 11, color: '#334155' }}>
                    <span style={{ color: '#64748b' }}>{(SCHOOL_GRID.find((c: any) => c.field === f)?.headerName) || f}: </span>
                    <span>{renderFieldValue((s as any)[f])}</span>
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
              {SCHOOL_GRID.filter((c: any) => c.visibility !== 'suppress' && c.field !== groupField).map((c: any) => {
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
                    <span>{c.headerName || c.field}</span>
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
              {SCHOOL_GRID.filter((c: any) => c.visibility !== 'suppress').map((c: any) => {
                const uniq = uniqueValues(filteredByPanel, c.field);
                if (uniq.length === 0) return null;
                const sel = new Set(filtersPanel[c.field] || []);
                return (
                  <div key={c.field}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{c.headerName || c.field}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {uniq.map((val: any) => (
                        <label key={String(val)} style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '2px 8px', fontSize: 12, cursor: 'pointer' }}>
                          <input type="checkbox" checked={sel.has(String(val))} onChange={(e) => {
                            setFiltersPanel((prev) => {
                              const next = { ...prev } as Record<string, string[]>;
                              const s = new Set(next[c.field] || []);
                              if (e.target.checked) s.add(String(val)); else s.delete(String(val));
                              next[c.field] = Array.from(s);
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
              <button type="button" onClick={() => setFiltersPanel({})} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Clear All</button>
              <div>
                <button type="button" onClick={() => setShowFilters(false)} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', marginRight: 8 }}>Close</button>
                <button type="button" onClick={() => setShowFilters(false)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 420, maxWidth: '90vw', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>Update Status and SSJ Stage</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>SSJ Stage</span>
                <select
                  value={modal.stage ?? ''}
                  onChange={(e) => setModal((m) => ({ ...m, stage: e.target.value || null }))}
                  style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                >
                  <option value="">(none)</option>
                  {ssjStages.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>School Status</span>
                <select
                  value={modal.status ?? ''}
                  onChange={(e) => setModal((m) => ({ ...m, status: e.target.value || null }))}
                  style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                >
                  <option value="">(none)</option>
                  {schoolStatuses.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModal({ open: false })}
                  style={{ background: 'transparent', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                >Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!modal.id) { setModal({ open: false }); return; }
                    try {
                      if (modal.status != null) {
                        const { error: e1 } = await supabase.from('schools').update({ status: modal.status as any }).eq('id', modal.id);
                        if (e1) throw e1;
                      }
                      if (modal.stage != null) {
                        const { error: e2 } = await (supabase as any).from('school_ssj_data').upsert({ school_id: modal.id, ssj_stage: modal.stage });
                        if (e2) throw e2;
                      }
                    } catch (err) {
                      console.error('Failed updating via modal', err);
                    } finally {
                      setModal({ open: false });
                      queryClient.invalidateQueries({ queryKey: ['view/grid_school'] });
                    }
                  }}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
                >Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Kanban Columns/Filters overlays */}
      {showColumns && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setShowColumns(false)}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 520, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Choose Columns for Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, maxHeight: '50vh', overflow: 'auto' }}>
              {SCHOOL_GRID.filter((c: any) => c.visibility !== 'suppress' && c.field !== groupField).map((c: any) => {
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
                    <span>{c.headerName || c.field}</span>
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
              {SCHOOL_GRID.filter((c: any) => c.visibility !== 'suppress').map((c: any) => {
                const uniq = uniqueValues(filteredByPanel, c.field);
                if (uniq.length === 0) return null;
                const sel = new Set(filtersPanel[c.field] || []);
                return (
                  <div key={c.field}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{c.headerName || c.field}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {uniq.map((val: any) => (
                        <label key={String(val)} style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '2px 8px', fontSize: 12, cursor: 'pointer' }}>
                          <input type="checkbox" checked={sel.has(String(val))} onChange={(e) => {
                            setFiltersPanel((prev) => {
                              const next = { ...prev } as Record<string, string[]>;
                              const s = new Set(next[c.field] || []);
                              if (e.target.checked) s.add(String(val)); else s.delete(String(val));
                              next[c.field] = Array.from(s);
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
              <button type="button" onClick={() => setFiltersPanel({})} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Clear All</button>
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
