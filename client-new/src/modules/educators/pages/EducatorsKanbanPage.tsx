import React, { useMemo, useState } from 'react';
import { useGridEducators } from '../api/queries';
import KanbanBoard from '@/components/shared/KanbanBoard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { EDUCATOR_KANBAN_CONSTANTS_TABLE, EDUCATOR_GRID } from '../constants';
import { GridPageHeader } from '@/components/shared/GridPageHeader';
import { useLocation } from 'wouter';
import type { SavedView } from '@/hooks/useSavedViews';

export function EducatorsKanbanPage() {
  const { data = [], isLoading } = useGridEducators();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');
  const groupField = EDUCATOR_GRID.find((c) => c.kanbanKey)?.field || 'kanban_group';

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

  const filteredItems = useMemo(() => quickFilteredData.filter((r: any) => {
    const v = r[groupField];
    const key = v == null || v === '' ? '__UNSPECIFIED__' : String(v).trim();
    return !suppressedKeys.has(key);
  }), [quickFilteredData, groupField, suppressedKeys]);

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
      />
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
    </div>
  );
}



