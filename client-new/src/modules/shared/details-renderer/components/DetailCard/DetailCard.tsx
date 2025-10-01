import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';
import { CardField } from './CardField';
import type { DetailCardProps } from './types';
import type { FieldMetadataMap, FieldMetadata } from '../../../detail-types';
import { getInitialValues } from '../../utils';
import { mergeFieldMetadata, getColumnMetadata } from '../../../schema-metadata';
import { useSelectOptions } from '../../hooks/useSelectOptions';
import { saveCardValues } from '../../../educators/helpers/write-helpers';
import {
  isPhoneE164,
  normalizePhoneToE164,
  isEIN,
  normalizeEIN
} from '../../../validators';

export function DetailCard({
  block,
  tab,
  entityId,
  details,
  fieldMeta,
  defaultWriteTo,
  defaultWriteOrder
}: DetailCardProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(() =>
    getInitialValues(block.fields, details)
  );
  const [displayOverrides, setDisplayOverrides] = useState<Record<string, any>>({});

  // Update values when details change
  useEffect(() => {
    setValues(getInitialValues(block.fields, details));
  }, [block.fields, details]);

  // Resolve field metadata with fallbacks
  const resolvedFieldMeta = useMemo<FieldMetadataMap>(() => {
    if (!fieldMeta) return {};
    const map: FieldMetadataMap = {};
    const fallbackSchema = block.editSource?.schema;
    const fallbackTable = block.editSource?.table;

    for (const field of block.fields) {
      const manual = fieldMeta[field];
      if (!manual) continue;

      map[field] = mergeFieldMetadata({
        field,
        manual,
        schema: fallbackSchema,
        table: fallbackTable,
      }) ?? manual;
    }

    return map;
  }, [block.editSource?.schema, block.editSource?.table, block.fields, fieldMeta]);

  // Get metadata for a specific field
  const getMetaForField = useCallback(
    (field: string): FieldMetadata | undefined => {
      const manual = resolvedFieldMeta[field] ?? fieldMeta?.[field];
      if (manual) {
        // Enrich with inferred type/array from write targets
        if (manual.type == null || manual.array == null) {
          let cm: any | undefined;
          if (defaultWriteOrder && defaultWriteOrder.length) {
            for (const t of defaultWriteOrder) {
              const found = getColumnMetadata(undefined, t, manual.edit?.column ?? field);
              if (found) {
                cm = found;
                break;
              }
            }
          } else if (defaultWriteTo) {
            cm = getColumnMetadata(
              defaultWriteTo.schema,
              defaultWriteTo.table,
              manual.edit?.column ?? field
            );
          }

          if (cm) {
            const isEnum = !!cm?.enumRef;
            const type: any = manual.type ?? (
              isEnum ? 'enum' :
              cm?.baseType === 'boolean' ? 'boolean' :
              cm?.baseType === 'number' ? 'number' : 'string'
            );
            const array = manual.array ?? !!cm.isArray;
            return { ...manual, type, array } as FieldMetadata;
          }
        }
        return manual;
      }

      // Try default write order tables first
      if (defaultWriteOrder && defaultWriteOrder.length) {
        for (const t of defaultWriteOrder) {
          const cm: any = getColumnMetadata(undefined, t, field);
          if (cm) {
            const isEnum = !!cm?.enumRef;
            const type: any = isEnum ? 'enum' :
              cm?.baseType === 'boolean' ? 'boolean' :
              cm?.baseType === 'number' ? 'number' : 'string';
            return { type, array: !!cm.isArray } as FieldMetadata;
          }
        }
      }

      // Fallback: single default write target
      if (defaultWriteTo) {
        const cm: any = getColumnMetadata(defaultWriteTo.schema, defaultWriteTo.table, field);
        if (cm) {
          const isEnum = !!cm?.enumRef;
          const type: any = isEnum ? 'enum' :
            cm?.baseType === 'boolean' ? 'boolean' :
            cm?.baseType === 'number' ? 'number' : 'string';
          return { type, array: !!cm.isArray } as FieldMetadata;
        }
      }

      return undefined;
    },
    [resolvedFieldMeta, fieldMeta, defaultWriteOrder, defaultWriteTo]
  );

  // Handle display overrides for attachment fields
  useEffect(() => {
    const overrides: Record<string, any> = {};
    for (const field of block.fields) {
      const meta = getMetaForField(field);
      if (meta?.type === 'attachment') {
        const fullKey = `${field}_full_url`;
        if (fullKey in details && details[fullKey] != null && details[fullKey] !== '') {
          overrides[field] = details[fullKey];
        }
      }
    }
    setDisplayOverrides(overrides);
  }, [block.fields, details, getMetaForField]);

  // Get select options for all fields
  const selectOptionsMap = new Map<string, Array<{ value: string; label: string }>>();
  for (const field of block.fields) {
    const meta = getMetaForField(field);
    const { options } = useSelectOptions(meta);
    if (options.length > 0) {
      selectOptionsMap.set(field, options);
    }
  }

  // Handle field change
  const handleFieldChange = useCallback((field: string, next: any) => {
    setValues(prev => ({ ...prev, [field]: next }));
  }, []);

  // Validate and normalize fields
  const validateAndNormalize = (values: Record<string, any>): Record<string, any> | null => {
    const sanitized: Record<string, any> = {};

    for (const key of Object.keys(values)) {
      const val = values[key];

      // Sanitize arrays to avoid empty strings in enum[] columns
      sanitized[key] = Array.isArray(val) ?
        val.filter((v: any) => v !== '') :
        val;

      // Skip null/empty values for validation
      if (sanitized[key] == null || sanitized[key] === '') continue;

      const meta = getMetaForField(key);
      const label = String(meta?.label ?? key);
      const lname = label.toLowerCase();
      const kname = String(key).toLowerCase();

      // Validate phone numbers
      const isPhoneField = kname.includes('phone') || lname.includes('phone');
      if (isPhoneField) {
        const str = String(sanitized[key]).trim();
        const normalized = normalizePhoneToE164(str);
        if (!normalized || !isPhoneE164(normalized)) {
          alert(`${label}: please enter a valid phone number`);
          return null;
        }
        sanitized[key] = normalized;
      }

      // Validate EINs
      const isEinField = kname === 'ein' || lname.includes('ein');
      if (isEinField) {
        const str = String(sanitized[key]).trim();
        const normalized = normalizeEIN(str);
        if (!normalized || !isEIN(normalized)) {
          alert(`${label}: please enter a valid EIN`);
          return null;
        }
        sanitized[key] = normalized;
      }
    }

    return sanitized;
  };

  // Handle save
  const handleSave = useCallback(async () => {
    const sanitized = validateAndNormalize(values);
    if (!sanitized) return;

    const explicitTarget = block.editSource;

    if (explicitTarget) {
      // Save to explicit target
      const updater = block.editForeignKey ?
        { [block.editForeignKey]: entityId, ...sanitized } :
        sanitized;

      const { error } = await saveCardValues({
        target: explicitTarget,
        primaryKeyValue: entityId,
        updater,
        exceptions: block.editExceptions || []
      });

      if (error) {
        alert('Failed to save: ' + error);
        return;
      }
    } else if (defaultWriteTo || defaultWriteOrder) {
      // Save to default targets
      const targets = defaultWriteOrder ?
        defaultWriteOrder.map(t => ({ table: t })) :
        [defaultWriteTo!];

      for (const target of targets) {
        const relevantFields: Record<string, any> = {};
        for (const [field, value] of Object.entries(sanitized)) {
          const cm = getColumnMetadata(target.schema, target.table, field);
          if (cm) relevantFields[field] = value;
        }

        if (Object.keys(relevantFields).length > 0) {
          const { error } = await saveCardValues({
            target,
            primaryKeyValue: entityId,
            updater: relevantFields,
            exceptions: []
          });

          if (error) {
            alert(`Failed to save to ${target.table}: ${error}`);
            return;
          }
        }
      }
    }

    // Success - exit edit mode and refresh
    setEditing(false);
    queryClient.invalidateQueries();

    // Reload if configured
    if (block.reloadOnSave) {
      window.location.reload();
    }
  }, [values, block, entityId, defaultWriteTo, defaultWriteOrder, queryClient, getColumnMetadata]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setValues(getInitialValues(block.fields, details));
    setEditing(false);
  }, [block.fields, details]);

  // Determine layout
  const columns = block.columns || (block.fields.length <= 4 ? 1 : 2);
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: 16
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 20,
      marginBottom: 24
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <h3 style={{
          fontSize: 18,
          fontWeight: 600,
          color: '#1e293b'
        }}>
          {block.title || 'Details'}
        </h3>

        {!block.readOnly && (
          <div>
            {editing ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="sm"
                  onClick={handleSave}
                  style={{ height: 32 }}
                >
                  <Save size={14} style={{ marginRight: 4 }} />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  style={{ height: 32 }}
                >
                  <X size={14} style={{ marginRight: 4 }} />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                style={{ height: 32 }}
              >
                <Edit2 size={14} style={{ marginRight: 4 }} />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div style={gridStyle}>
        {block.fields.map(field => {
          const meta = getMetaForField(field);
          const value = values[field];
          const selectOptions = selectOptionsMap.get(field);
          const displayOverride = displayOverrides[field];

          return (
            <CardField
              key={field}
              field={field}
              value={value}
              meta={meta}
              editing={editing}
              onChange={editing ? (v) => handleFieldChange(field, v) : undefined}
              selectOptions={selectOptions}
              displayOverride={displayOverride}
            />
          );
        })}
      </div>
    </div>
  );
}