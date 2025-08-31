import * as ToggleGroup from "@radix-ui/react-toggle-group";

export function RoleMultiSelectInline({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <ToggleGroup.Root
      type="multiple"
      className="flex flex-wrap gap-1 p-1"
      value={value}
      onValueChange={(next) => onChange(next as string[])}
    >
      {options.map((opt) => (
        <ToggleGroup.Item
          key={opt}
          value={opt}
          className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 data-[state=on]:border-blue-300 bg-white text-slate-700 border border-slate-300 rounded px-2 py-1 text-xs"
        >
          {opt}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

