export function DateInputInline({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      type="date"
      className="h-7 w-full px-2 border rounded text-sm"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

