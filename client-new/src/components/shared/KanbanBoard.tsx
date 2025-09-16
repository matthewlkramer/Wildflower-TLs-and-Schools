import React, { useEffect, useMemo, useRef, useState } from 'react';

type Column<T> = {
  key: string;
  label: string;
  sortBy?: (a: T, b: T) => number;
};

export interface KanbanBoardProps<T> {
  items: T[];
  columns: Column<T>[];
  groupBy: (item: T) => string | undefined | null;
  getId: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  onItemMove?: (opts: { id: string; from: string; to: string }) => void | Promise<void>;
  emptyText?: string;
  initialCollapsedKeys?: string[];
}

export function KanbanBoard<T>(props: KanbanBoardProps<T>) {
  const { items, columns, groupBy, getId, renderCard, onItemMove, emptyText, initialCollapsedKeys } = props;

  const groups = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const c of columns) map.set(c.key, []);
    for (const item of items) {
      const raw = groupBy(item);
      const k = raw == null || raw === '' ? '__UNSPECIFIED__' : String(raw);
      const key = columns.find((c) => c.key === k) ? k : '__UNSPECIFIED__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items, columns, groupBy]);

  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(initialCollapsedKeys || []));
  // Apply initial collapsed keys once when available (prevents re-collapsing after user expands)
  const appliedInitial = useRef(false);
  useEffect(() => {
    if (appliedInitial.current) return;
    if (!initialCollapsedKeys || initialCollapsedKeys.length === 0) return;
    setCollapsed(new Set(initialCollapsedKeys));
    appliedInitial.current = true;
  }, [initialCollapsedKeys]);
  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const dndEnabled = !!onItemMove;
  const onDragStart = (e: React.DragEvent, item: T, from: string) => {
    if (!dndEnabled) return;
    const id = getId(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, from }));
  };
  const onDragOver = (e: React.DragEvent) => { if (dndEnabled) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } };
  const onDrop = (e: React.DragEvent, to: string) => {
    if (!dndEnabled) return;
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const { id, from } = JSON.parse(raw);
      if (from === to) return;
      onItemMove && onItemMove({ id, from, to });
    } catch {}
  };

  // Basic inline style approximations (no Tailwind here)
  const colStyle = (isCollapsed: boolean): React.CSSProperties => ({
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, display: 'flex', flexDirection: 'column',
    maxHeight: '75vh', flexShrink: 0, width: isCollapsed ? 56 : 280,
  });
  const headerStyle: React.CSSProperties = { padding: '8px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 };
  const cardsWrapStyle: React.CSSProperties = { padding: 8, overflowY: 'auto', minHeight: '4rem' };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 'max-content', display: 'flex', gap: 16 }}>
        {columns.map((col) => {
          const cards = groups.get(col.key) || [];
          const sorted = col.sortBy ? [...cards].sort(col.sortBy) : cards;
          const isCollapsed = collapsed.has(col.key);
          return (
            <div key={col.key} style={colStyle(isCollapsed)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.key)} title={isCollapsed ? `${col.label} (${sorted.length})` : undefined}>
              <div style={headerStyle}>
                {isCollapsed ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 120, margin: '0 auto' }}>
                    <div style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      fontSize: 12, fontWeight: 600, color: '#334155',
                      whiteSpace: 'nowrap',
                    }}>{col.label}</div>
                  </div>
                ) : (
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.label}</h3>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{sorted.length}</span>
                  <button type="button" style={{ fontSize: 12, color: '#64748b', border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => toggleCollapsed(col.key)}>{isCollapsed ? '▶' : '◀'}</button>
                </div>
              </div>
              {!isCollapsed && (
                <div style={cardsWrapStyle}>
                  {sorted.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '8px 4px' }}>{emptyText || 'No items'}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sorted.map((item) => (
                        <div key={getId(item)} style={{ position: 'relative', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: dndEnabled ? 'grab' : 'default' }} draggable={dndEnabled} onDragStart={(e) => onDragStart(e, item, col.key)}>
                          {renderCard(item)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanBoard;
