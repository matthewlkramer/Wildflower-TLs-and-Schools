export function YesNoSelectInline({
  value,
  onChange,
  className,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}) {
  return (
    <select
      className={className || "w-full h-7 text-xs border rounded px-1"}
      value={value ? 'Yes' : 'No'}
      onChange={(e) => onChange(e.target.value === 'Yes')}
    >
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  );
}

