import React from "react";

function pretty(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatValue(v: any): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function DetailsPanel({ data }: { data: Record<string, any> | null }) {
  if (!data) return <div className="text-sm text-slate-500">No details.</div>;
  const entries = Object.entries(data).filter(([k]) => k !== 'id');
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-3 text-sm">
          <div className="w-48 shrink-0 text-slate-500">{pretty(k)}</div>
          <div className="flex-1 break-words whitespace-pre-wrap">{formatValue(v)}</div>
        </div>
      ))}
    </div>
  );
}

