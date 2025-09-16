import React, { useMemo } from 'react';
import { useGridEducators } from '../api/queries';
import KanbanBoard from '@/components/shared/KanbanBoard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { EDUCATOR_KANBAN_GROUPING_FIELD, EDUCATOR_KANBAN_CONSTANTS_TABLE, EDUCATOR_GRID } from '../constants';

export function EducatorsKanbanPage() {
  const { data = [], isLoading } = useGridEducators();

  const groupField = EDUCATOR_KANBAN_GROUPING_FIELD;

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

  const filteredItems = useMemo(() => data.filter((r: any) => {
    const v = r[groupField];
    const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
    return !suppressedKeys.has(key);
  }), [data, groupField, suppressedKeys]);

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
    label: k === '__UNSPECIFIED__' ? 'Unspecified' : (constMap.get(k)?.label ?? k),
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

  return (
    <KanbanBoard<any>
      items={filteredItems}
      columns={columns}
      groupBy={(it) => (it as any)[groupField]}
      getId={(it) => String((it as any).id)}
      initialCollapsedKeys={initialCollapsed}
      renderCard={(t) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{(t as any).full_name || (t as any).name || ''}</div>
          <div style={{ fontSize: 12, color: '#475569' }}>{(t as any).current_role_at_active_school || (t as any).current_role || ''}</div>
        </div>
      )}
    />
  );
}
