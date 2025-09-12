import React from 'react';
import { Toggle } from "@/components/ui/toggle";

type ViewMode = 'table' | 'kanban' | 'split';

export function ViewModeToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const items: { key: ViewMode; label: string }[] = [
    { key: 'table', label: 'Table' },
    { key: 'kanban', label: 'Kanban' },
    { key: 'split', label: 'Split' },
  ];
  return (
    <div className="inline-flex items-stretch rounded-md border border-slate-200 bg-white shadow-sm">
      {items.map((it, idx) => (
        <Toggle
          key={it.key}
          pressed={value === it.key}
          onPressedChange={(on) => on && onChange(it.key)}
          size="sm"
          variant="outline"
          className={[
            'text-xs h-8 px-3 rounded-none',
            idx === 0 ? 'rounded-l-md' : '',
            idx === items.length - 1 ? 'rounded-r-md' : '',
            value === it.key ? 'bg-slate-50 border-slate-300' : 'bg-white',
          ].filter(Boolean).join(' ')}
        >
          {it.label}
        </Toggle>
      ))}
    </div>
  );
}

