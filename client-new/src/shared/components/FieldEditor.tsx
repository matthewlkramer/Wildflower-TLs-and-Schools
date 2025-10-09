import React from 'react';
import { createPortal } from 'react-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { supabase } from '@/core/supabase/client';
import type { SelectOption } from '../services/card-service';

// Generic field metadata type that works with both FieldValue and CellValue
export type FieldMetadata = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment' | 'url' | 'array';
  options?: SelectOption[];
  multiline?: boolean;
  bucket?: string; // Supabase storage bucket name
  isImage?: boolean; // Whether this attachment is an image
};

export type FieldEditorProps = {
  value: any;
  fieldValue: FieldMetadata;
  onChange: (value: any) => void;
  className?: string;
};

/**
 * Shared field editor component that renders the appropriate input control
 * based on the field type (select, checkbox, date, textarea, text, number)
 */
export const FieldEditor: React.FC<FieldEditorProps> = ({
  value,
  fieldValue,
  onChange,
  className = '',
}) => {
  const { type, options, multiline } = fieldValue;

  // Check if we have options to render (select/multi-select)
  const hasOptions = options && options.length > 0;

  // Array/Multi-select dropdown - check if value is array OR type suggests array
  if (hasOptions && (Array.isArray(value) || type === 'array')) {
    const arrayValue = Array.isArray(value) ? value : (value ? [value] : []);
    return (
      <MultiSelectDropdown
        value={arrayValue}
        options={options}
        onChange={onChange}
        className={className}
      />
    );
  }

  // Single-select dropdown for enum/lookup fields
  if (hasOptions) {
    return (
      <Select
        value={String(value || '__null__')}
        onValueChange={(v) => onChange(v === '__null__' ? null : v)}
      >
        <SelectTrigger className={`h-8 text-xs ${className}`} style={{ fontWeight: 'normal', fontSize: 12 }}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__null__">--</SelectItem>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Boolean checkbox
  if (type === 'boolean') {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300"
          style={{ width: 14, height: 14 }}
        />
      </div>
    );
  }

  // Date input
  if (type === 'date') {
    const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
    return (
      <Input
        type="date"
        value={dateValue}
        onChange={(e) => onChange(e.target.value)}
        className={`h-8 text-xs ${className}`}
        style={{ fontSize: 12, fontWeight: 'normal' }}
      />
    );
  }

  // Attachment field (file upload)
  if (type === 'attachment') {
    return (
      <AttachmentField
        value={value}
        bucket={fieldValue.bucket || 'self-reflections'}
        isImage={fieldValue.isImage}
        onChange={onChange}
        className={className}
      />
    );
  }

  // Multiline textarea
  if (multiline) {
    return (
      <textarea
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[60px] p-2 border border-gray-300 rounded-md resize-y text-xs ${className}`}
        style={{ fontSize: 12, fontWeight: 'normal' }}
        rows={3}
      />
    );
  }

  // Number input
  if (type === 'number') {
    return (
      <Input
        type="number"
        value={String(value || '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-8 text-xs ${className}`}
        style={{ fontSize: 12, fontWeight: 'normal' }}
      />
    );
  }

  // Regular text input
  return (
    <Input
      type="text"
      value={String(value || '')}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 text-xs ${className}`}
      style={{ fontSize: 12, fontWeight: 'normal' }}
    />
  );
};

/**
 * Multi-select dropdown component for array fields
 */
type MultiSelectDropdownProps = {
  value: string[];
  options: SelectOption[];
  onChange: (value: string[]) => void;
  className?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  value,
  options,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && ref.current.contains(e.target)) return;
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  React.useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        fontSize: 11,
      });
    }
  }, [open]);

  const selectedSet = React.useMemo(() => new Set(value.filter(Boolean)), [value]);

  const summary = React.useMemo(() => {
    if (selectedSet.size === 0) return '--';
    const labels: string[] = [];
    const matchedValues = new Set<string>();

    // First pass: match by value
    for (const opt of options) {
      if (selectedSet.has(opt.value)) {
        labels.push(opt.label);
        matchedValues.add(opt.value);
      }
    }

    // Second pass: for unmatched items, try to match by label or show raw value
    for (const selectedValue of selectedSet) {
      if (!matchedValues.has(selectedValue)) {
        const matchedOpt = options.find(opt => opt.label === selectedValue);
        if (matchedOpt) {
          labels.push(matchedOpt.label);
        } else {
          // Show raw value if no match found
          labels.push(selectedValue);
        }
      }
    }

    const text = labels.join(', ');
    return text.length > 60 ? text.slice(0, 57) + '...' : text;
  }, [options, selectedSet]);

  const toggleOption = (optValue: string) => {
    const newSet = new Set(selectedSet);
    if (newSet.has(optValue)) {
      newSet.delete(optValue);
    } else {
      newSet.add(optValue);
    }
    onChange(Array.from(newSet));
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-full items-center justify-between rounded-md border border-slate-200 px-3 text-left text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 ${className}`}
        style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'normal', fontSize: 12 }}
      >
        <span className="truncate" style={{ color: '#000', fontWeight: 'normal', fontSize: 12 }}>{summary}</span>
        <span className="ml-2 opacity-60">▼</span>
      </button>
      {open && (
        <div
          className="z-[1000] max-h-56 overflow-auto rounded-md shadow-lg border border-slate-200"
          style={{ ...dropdownStyle, backgroundColor: '#fff' }}
        >
          {options.map((opt) => {
            const checked = selectedSet.has(opt.value);
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center hover:bg-slate-100"
                style={{ gap: 4, paddingTop: 0, paddingBottom: 0, paddingLeft: 4, paddingRight: 4, lineHeight: '15px' }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt.value)}
                  style={{ width: 11, height: 11, margin: 0, flexShrink: 0 }}
                />
                <span style={{ fontSize: 11, lineHeight: '15px', fontWeight: 'normal' }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Attachment field component for file uploads (documents and images)
 */
type AttachmentFieldProps = {
  value: string | null; // object_id from storage
  bucket: string;
  isImage?: boolean;
  onChange: (objectId: string | null) => void;
  className?: string;
};

const AttachmentField: React.FC<AttachmentFieldProps> = ({
  value,
  bucket,
  isImage,
  onChange,
  className = '',
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get the public URL for the file
  React.useEffect(() => {
    if (value) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(value);
      setFileUrl(data.publicUrl);
    } else {
      setFileUrl(null);
    }
  }, [value, bucket]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase storage bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Return the object_id (path within the bucket)
      onChange(data.path);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    if (!confirm('Are you sure you want to remove this file?')) return;

    try {
      // Delete from storage
      const { error } = await supabase.storage.from(bucket).remove([value]);
      if (error) throw error;

      onChange(null);
    } catch (error) {
      console.error('Remove failed:', error);
      alert('Failed to remove file. Please try again.');
    }
  };

  const handleAction = (actionId: string) => {
    if (actionId === 'replace') {
      fileInputRef.current?.click();
    } else if (actionId === 'remove') {
      handleRemove();
    } else if (actionId === 'upload') {
      fileInputRef.current?.click();
    }
  };

  if (value && fileUrl) {
    return (
      <>
        <div className={`flex items-center gap-2 ${className}`}>
          {isImage ? (
            <img
              src={fileUrl}
              alt="Attachment"
              className="object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
              onClick={() => {
                console.log('Logo clicked! URL:', fileUrl);
                setImagePreview(fileUrl);
              }}
            />
          ) : (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              📎 View Document
            </a>
          )}
          <Select value="" onValueChange={handleAction}>
            <SelectTrigger className="h-7 w-24 text-xs" style={{ fontWeight: 'normal', fontSize: 11 }}>
              <SelectValue placeholder="Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="replace" className="text-xs">
                Replace
              </SelectItem>
              <SelectItem value="remove" className="text-xs">
                Remove
              </SelectItem>
            </SelectContent>
          </Select>
          <input
            ref={fileInputRef}
            type="file"
            accept={isImage ? 'image/*' : '.pdf,.doc,.docx'}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Image Preview Modal */}
        {imagePreview && createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            style={{ zIndex: 9999 }}
            onClick={() => setImagePreview(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] bg-white p-4 rounded-lg">
              <img
                src={imagePreview}
                alt="Full size preview"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                style={{ width: 32, height: 32 }}
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div className={className}>
      <Select value="" onValueChange={handleAction}>
        <SelectTrigger className="h-7 w-32 text-xs" style={{ fontWeight: 'normal', fontSize: 11 }}>
          <SelectValue placeholder={uploading ? 'Uploading...' : 'Actions'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upload" className="text-xs" disabled={uploading}>
            {`Upload ${isImage ? 'Image' : 'Document'}`}
          </SelectItem>
        </SelectContent>
      </Select>
      <input
        ref={fileInputRef}
        type="file"
        accept={isImage ? 'image/*' : '.pdf,.doc,.docx'}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
