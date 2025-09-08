import React from 'react';

type ActionOption = {
  value: string;
  label: string;
  run: () => void;
  hidden?: boolean;
  disabled?: boolean;
};

type Size = 'sm' | 'md';

export function RowActionsSelect({
  options,
  size = 'sm',
  placeholder = 'Actions',
  className,
}: {
  options: ActionOption[];
  size?: Size;
  placeholder?: string;
  className?: string;
}) {
  const cls =
    size === 'sm'
      ? 'h-7 text-xs border rounded-md px-1 bg-white'
      : 'h-8 text-sm border rounded-md px-2 bg-white';
  return (
    <select
      aria-label={placeholder}
      defaultValue=""
      onChange={(e) => {
        const v = e.target.value;
        e.currentTarget.selectedIndex = 0;
        const opt = options.find((o) => o.value === v && !o.hidden && !o.disabled);
        if (opt) opt.run();
      }}
      className={[cls, className].filter(Boolean).join(' ')}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options
        .filter((o) => !o.hidden)
        .map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
    </select>
  );
}

export const selectSmClass = 'h-7 text-xs border rounded-md px-1 bg-white';

