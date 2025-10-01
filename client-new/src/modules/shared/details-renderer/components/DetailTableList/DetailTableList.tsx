import React, { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Switch, FormControlLabel } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { TableView } from './TableView';
import { ListView } from './ListView';
import type { DetailTableListProps } from './types';
import type { TableColumnMeta, DetailListLayout } from '../../../detail-types';
import { mergeTableColumnMeta, getColumnMetadata } from '../../../schema-metadata';
import { applyFilterExprToQuery } from '../../utils';
import { TABLE_PRESETS } from '../../../table-presets';

export function DetailTableList({ block, entityId }: DetailTableListProps) {
  const queryClient = useQueryClient();
  const isListVariant = block.kind === 'list';

  // Merge with presets if specified
  const effective = useMemo(() => {
    if (!block.preset) return block;
    const preset = TABLE_PRESETS[block.preset];
    if (!preset) return block;
    return { ...preset, ...block };
  }, [block]);

  const listLayout = isListVariant ?
    ((effective as any).listLayout as DetailListLayout | undefined) :
    undefined;

  // State management
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<any>({});

  // Config-driven toggles
  const toggles: any[] = useMemo(() => (effective as any).toggles ?? [], [effective]);
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const t of toggles) init[t.id] = !!t.defaultOn;
    return init;
  });

  // Column metadata
  const columnOrder = useMemo(() => {
    const cols = (effective as any).columns ?? [];
    return cols.map((c: any) => typeof c === 'string' ? c : c.field);
  }, [effective]);

  const columnMetaMap = useMemo(() => {
    const map = new Map<string, TableColumnMeta>();
    const cols = (effective as any).columns ?? [];

    for (const col of cols) {
      const field = typeof col === 'string' ? col : col.field;
      const manual = typeof col === 'object' ? col : undefined;
      const auto = getColumnMetadata(
        (effective as any).readSource?.schema,
        (effective as any).readSource?.table || (effective as any).source?.table,
        field
      );

      const merged = mergeTableColumnMeta(field, manual, auto);
      if (merged) map.set(field, merged);
    }

    return map;
  }, [effective]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const source = (effective as any).readSource || (effective as any).source;
        if (!source?.table) {
          setRows([]);
          return;
        }

        const client = source.schema && source.schema !== 'public' ?
          (supabase as any).schema(source.schema) :
          supabase;

        let query = client.from(source.table).select(source.select || '*');

        // Apply foreign key filter
        if (source.foreignKey) {
          query = query.eq(source.foreignKey, entityId);
        }

        // Apply additional filters
        if ((effective as any).filter) {
          query = applyFilterExprToQuery(query, (effective as any).filter);
        }

        // Apply config-driven toggle filters
        for (const toggle of toggles) {
          const isOn = toggleState[toggle.id];
          if (toggle.filterWhenOn && isOn) {
            query = applyFilterExprToQuery(query, toggle.filterWhenOn);
          }
          if (toggle.filterWhenOff && !isOn) {
            query = applyFilterExprToQuery(query, toggle.filterWhenOff);
          }
        }

        // Apply ordering
        if ((effective as any).orderBy) {
          for (const order of (effective as any).orderBy) {
            query = query.order(order.column, { ascending: order.ascending ?? true });
          }
        }

        // Apply limit
        if ((effective as any).limit) {
          query = query.limit((effective as any).limit);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching table data:', error);
          setRows([]);
        } else {
          setRows(data || []);
        }
      } catch (err) {
        console.error('Error in DetailTableList:', err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityId, effective, refreshToken, toggleState]);

  // Handle field change during editing
  const handleFieldChange = (field: string, value: any) => {
    setEditingValues(prev => ({ ...prev, [field]: value }));
  };

  // Handle save
  const handleSaveRow = async (index: number) => {
    const row = rows[index];
    const source = (effective as any).editSource || (effective as any).source;

    if (!source?.table) {
      console.error('No edit source configured');
      return;
    }

    try {
      const client = source.schema && source.schema !== 'public' ?
        (supabase as any).schema(source.schema) :
        supabase;

      const updates = { ...row, ...editingValues };
      const pk = source.primaryKey || 'id';

      const { error } = await client
        .from(source.table)
        .update(updates)
        .eq(pk, row[pk]);

      if (error) {
        console.error('Error saving row:', error);
        alert('Failed to save changes: ' + error.message);
      } else {
        // Success - refresh data and clear edit state
        setEditingRow(null);
        setEditingValues({});
        setRefreshToken(prev => prev + 1);

        // Invalidate queries
        queryClient.invalidateQueries();
      }
    } catch (err) {
      console.error('Error in handleSaveRow:', err);
      alert('An error occurred while saving');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingValues({});
  };

  // Handle row actions
  const handleRowAction = async (actionId: string, row: any, index: number) => {
    // This would be expanded with actual action handling
    console.log('Row action:', actionId, row, index);

    // Example: refresh after action
    if (actionId === 'delete') {
      // Implementation would go here
      setRefreshToken(prev => prev + 1);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: '0 4px'
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#1e293b'
        }}>
          {(effective as any).title || 'Records'}
        </h3>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Toggles */}
          {toggles.map((toggle: any) => (
            <FormControlLabel
              key={toggle.id}
              control={
                <Switch
                  checked={toggleState[toggle.id] || false}
                  onChange={(e) => {
                    setToggleState(prev => ({
                      ...prev,
                      [toggle.id]: e.target.checked
                    }));
                  }}
                  size="small"
                />
              }
              label={toggle.label}
              style={{ marginRight: 12 }}
            />
          ))}

          {/* Action buttons */}
          {(effective as any).allowCreate && (
            <Button
              size="sm"
              onClick={() => {
                // Handle create new
                console.log('Create new');
              }}
              style={{ height: 32 }}
            >
              <Plus size={16} style={{ marginRight: 4 }} />
              Add
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefreshToken(prev => prev + 1)}
            style={{ height: 32 }}
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isListVariant ? (
        <ListView
          rows={rows}
          layout={listLayout}
          columns={columnOrder}
          columnMetaMap={columnMetaMap}
          loading={loading}
          onRowAction={handleRowAction}
          rowActions={(effective as any).rowActions || []}
        />
      ) : (
        <TableView
          rows={rows}
          columns={columnOrder}
          columnMetaMap={columnMetaMap}
          loading={loading}
          editingRow={editingRow}
          editingValues={editingValues}
          onEditRow={setEditingRow}
          onSaveRow={handleSaveRow}
          onCancelEdit={handleCancelEdit}
          onFieldChange={handleFieldChange}
          onRowAction={handleRowAction}
          rowActions={(effective as any).rowActions || []}
        />
      )}
    </div>
  );
}