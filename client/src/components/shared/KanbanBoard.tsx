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
}

// Drag-and-drop, dependency-free Kanban using HTML5 DnD.
export function KanbanBoard<T>(props: KanbanBoardProps<T>) {
  const { items, columns, groupBy, getId, renderCard, onItemMove, emptyText } = props;

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
      <div className="min-w-max grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(260px, 1fr))` }}>
        {columns.map((col) => {
          const cards = groups.get(col.key) || [];
          const sorted = col.sortBy ? [...cards].sort(col.sortBy) : cards;
          return (
            <div
              key={col.key}
              className={`bg-slate-50 rounded-md border border-slate-200 flex flex-col max-h-[75vh] ${dragging ? "data-[dragging=true]:opacity-100" : ""}`}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.key)}
            >
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                <span className="text-xs text-slate-500">{sorted.length}</span>
              </div>
              <div className="p-2 overflow-y-auto min-h-[4rem]">
                {sorted.length === 0 ? (
                  <div className="text-xs text-slate-400 px-2 py-4 text-center">{emptyText || "No items"}</div>
                ) : (
                  <div className="space-y-2">
                    {sorted.map((item) => (
                      <div
                        key={getId(item)}
                        className="bg-white rounded border border-slate-200 shadow-sm p-2 cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => onDragStart(e, item, col.key)}
                      >
                        {renderCard(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanBoard;
