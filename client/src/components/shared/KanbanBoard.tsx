import React, { useMemo, useRef, useState } from "react";

type Column<T> = {
  key: string; // exact group key; no field fallback here
  label: string;
  // Optional sort order for cards in a column
  sortBy?: (a: T, b: T) => number;
};

export interface KanbanBoardProps<T> {
  items: T[];
  columns: Column<T>[];
  groupBy: (item: T) => string | undefined | null; // caller chooses a single field
  getId: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  onItemMove: (opts: { id: string; from: string; to: string }) => void | Promise<void>;
  emptyText?: string;
  initialCollapsedKeys?: string[]; // column keys that start collapsed
  selectedIds?: Set<string>;
  onToggleItem?: (id: string, checked: boolean) => void;
  onToggleColumn?: (key: string, checked: boolean) => void;
}

// Drag-and-drop, dependency-free Kanban using HTML5 DnD.
export function KanbanBoard<T>(props: KanbanBoardProps<T>) {
  const { items, columns, groupBy, getId, renderCard, onItemMove, emptyText, initialCollapsedKeys, selectedIds, onToggleItem, onToggleColumn } = props;

  const groups = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const c of columns) map.set(c.key, []);
    for (const item of items) {
      const raw = groupBy(item);
      const k = raw == null || raw === "" ? "__UNSPECIFIED__" : String(raw);
      const key = columns.find((c) => c.key === k) ? k : "__UNSPECIFIED__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items, columns, groupBy]);

  // Track drag state to allow styling feedback
  const [dragging, setDragging] = useState<{ id: string; from: string } | null>(null);
  // Track collapsed columns
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(initialCollapsedKeys || []));
  const toggleCollapsed = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const onDragStart = (e: React.DragEvent, item: T, from: string) => {
    const id = getId(item);
    setDragging({ id, from });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ id, from }));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent, to: string) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData("text/plain");
      const parsed = raw ? JSON.parse(raw) : dragging;
      if (!parsed) return;
      const { id, from } = parsed;
      if (from === to) return; // no-op
      onItemMove({ id, from, to });
    } finally {
      setDragging(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max flex gap-4">
        {columns.map((col) => {
          const cards = groups.get(col.key) || [];
          const sorted = col.sortBy ? [...cards].sort(col.sortBy) : cards;
          const isCollapsed = collapsed.has(col.key);
          const selectedCount = selectedIds ? sorted.filter((it) => selectedIds.has(getId(it))).length : 0;
          const allSelected = sorted.length > 0 && selectedCount === sorted.length;
          return (
            <div
              key={col.key}
              className={`bg-slate-50 rounded-md border border-slate-200 flex flex-col max-h-[75vh] flex-shrink-0 ${isCollapsed ? "w-[56px]" : "w-[280px]"}`}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.key)}
              title={isCollapsed ? `${col.label} (${sorted.length})` : undefined}
            >
              <div className="px-2 py-2 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isCollapsed && (
                    <input
                      type="checkbox"
                      aria-label="Select all in column"
                      checked={allSelected}
                      onChange={(e) => onToggleColumn && onToggleColumn(col.key, e.currentTarget.checked)}
                      className="h-4 w-4"
                    />
                  )}
                  <h3 className={`text-sm font-semibold text-slate-700 ${isCollapsed ? "truncate w-[36px]" : ""}`}>{col.label}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500 tabular-nums">{sorted.length}</span>
                  <button
                    type="button"
                    aria-label={isCollapsed ? "Expand column" : "Collapse column"}
                    className="text-slate-500 hover:text-slate-700 text-xs px-1"
                    onClick={(e) => { e.stopPropagation(); toggleCollapsed(col.key); }}
                  >
                    {isCollapsed ? '▸' : '▾'}
                  </button>
                </div>
              </div>
              {!isCollapsed && (
                <div className="p-2 overflow-y-auto min-h-[4rem]">
                  {sorted.length === 0 ? (
                    <div className="text-xs text-slate-400 px-2 py-4 text-center">{emptyText || "No items"}</div>
                  ) : (
                    <div className="space-y-2">
                      {sorted.map((item) => (
                        <div
                          key={getId(item)}
                          className="relative bg-white rounded border border-slate-200 shadow-sm p-2 cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => onDragStart(e, item, col.key)}
                        >
                          {onToggleItem && (
                            <input
                              type="checkbox"
                              className="absolute top-1 left-1 h-4 w-4"
                              checked={!!selectedIds && selectedIds.has(getId(item))}
                              onChange={(e) => onToggleItem(getId(item), e.currentTarget.checked)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
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
