import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'toggle' | 'select' | 'multiselect' | 'readonly';

export interface EntityField {
  key: string;
  label: string;
  type?: FieldType;
  value?: any;
  editable?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>; // for select
  render?: (value: any) => React.ReactNode; // custom read render
}

interface EntityCardProps {
  title: string;
  description?: string;
  fields: EntityField[];
  columns?: 1 | 2 | 3; // grid columns for fields
  onSave?: (values: Record<string, any>) => Promise<void> | void;
  actionsRight?: React.ReactNode; // extra header actions
  showDivider?: boolean; // show header bottom border
  children?: React.ReactNode; // optional extra content below fields
  editable?: boolean; // globally toggle editing off
  className?: string; // allow grid-span styling from pages
  fullWidth?: boolean; // span both columns in DetailGrid
}

export function EntityCard({ title, description, fields, columns = 2, onSave, actionsRight, showDivider = true, children, editable = true, className = "", fullWidth = false }: EntityCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const initialValues = useMemo(() => Object.fromEntries(fields.map(f => [f.key, f.value])), [fields]);
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  const colClass = columns === 3 ? 'md:grid-cols-3' : columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  const handleCancel = () => {
    setValues(initialValues);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!onSave) {
      setEditing(false);
      return;
    }
    try {
      setSaving(true);
      await onSave(values);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key: string, val: any) => setValues(prev => ({ ...prev, [key]: val }));

  const renderRead = (f: EntityField) => {
    if (f.render) return f.render(f.value);
    const v = f.value;
    if (v === null || v === undefined || v === '') return <span className="text-slate-400">-</span>;
    if (Array.isArray(v)) {
      if (v.length === 0) return <span className="text-slate-400">-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {v.map((item: any, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">{String(item)}</Badge>
          ))}
        </div>
      );
    }
    return <span>{String(v)}</span>;
  };

  const renderEdit = (f: EntityField) => {
    const v = values[f.key];
    const common = { disabled: saving } as any;
    switch (f.type) {
      case 'textarea':
        return <Textarea {...common} placeholder={f.placeholder} value={v ?? ''} onChange={(e) => setValue(f.key, e.target.value)} />;
      case 'number':
        return <Input {...common} type="number" placeholder={f.placeholder} value={v ?? ''} onChange={(e) => setValue(f.key, e.target.value)} />;
      case 'date':
        return <Input {...common} type="date" value={v ?? ''} onChange={(e) => setValue(f.key, e.target.value)} />;
      case 'toggle':
        return <Switch checked={Boolean(v)} onCheckedChange={(checked) => setValue(f.key, checked)} />;
      case 'select':
        return (
          <Select value={v ?? ''} onValueChange={(val) => setValue(f.key, val)}>
            <SelectTrigger><SelectValue placeholder={f.placeholder || 'Select'} /></SelectTrigger>
            <SelectContent>
              {f.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'multiselect':
        if (f.options && f.options.length > 0) {
          const current: string[] = Array.isArray(v) ? v : (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []);
          const toggle = (val: string, checked: boolean) => {
            const next = checked ? Array.from(new Set([...(current || []), val])) : (current || []).filter(x => x !== val);
            setValue(f.key, next);
          };
          return (
            <div className="flex flex-col gap-1">
              {f.options.map(opt => {
                const checked = current.includes(opt.value);
                return (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checked} onCheckedChange={(c: any) => toggle(opt.value, Boolean(c))} />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          );
        }
        // Fallback to comma-separated input if no options defined
        return <Input {...common} placeholder={f.placeholder} value={Array.isArray(v) ? v.join(', ') : (v ?? '')} onChange={(e) => setValue(f.key, e.target.value)} />;
      case 'readonly':
        return renderRead(f);
      case 'text':
      default:
        return <Input {...common} placeholder={f.placeholder} value={v ?? ''} onChange={(e) => setValue(f.key, e.target.value)} />;
    }
  };

  return (
    <Card className={`${fullWidth ? 'lg:col-span-2' : ''} ${className}`.trim()}>
      <div className={`flex items-center justify-between px-4 py-3 ${showDivider ? 'border-b border-slate-200' : ''}`}>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actionsRight}
          {editable ? (editing ? (
            <>
              <Button
                size="sm"
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-wildflower-blue hover:bg-blue-700 text-white"
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setEditing(true)} className="bg-wildflower-blue hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )) : null}
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        {fields && fields.length > 0 && (
          <div className={`grid grid-cols-1 ${colClass} gap-4`}>
            {fields.map((f) => (
              <div key={f.key} className="space-y-1">
                <div className="text-xs text-slate-600">{f.label}</div>
                <div className="text-sm">
                  {editable && editing && f.editable !== false ? renderEdit(f) : renderRead(f)}
                </div>
              </div>
            ))}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
