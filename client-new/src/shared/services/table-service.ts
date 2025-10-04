import { supabase } from '@/core/supabase/client';
import { resolveTableSpec, type ResolvedTableSpec, type ResolvedTableColumn } from './table-spec-resolver';
import type { TablePresetId } from './table-list-presets';
import type { FilterExpr } from './detail-types';
import { ENUM_OPTIONS } from '@/generated/enums.generated';
import { formatCurrencyUSD } from '../utils/ui-utils';
import { fromTable } from '../utils/supabase-utils';

export type SelectOption = { value: string; label: string };

export type CellValue = {
  raw: any;
  display: string;
  editable: boolean;
  options?: SelectOption[];
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment' | 'array';
  multiline?: boolean;
  linkToField?: string;
  attachment?: boolean;
};

export type RenderableRow = {
  id: any;
  originalData: Record<string, any>;
  cells: Record<string, CellValue>;
};

export type RenderableTableData = {
  spec: ResolvedTableSpec;
  rows: RenderableRow[];
  loading: boolean;
  error?: string;
  totalCount?: number;
};

export class TableService {
  private optionsCache = new Map<string, SelectOption[]>();

  /**
   * Load complete table data ready for rendering
   */
  async loadTableData(
    presetId: string,
    entityId?: string,
    module?: string,
    activeFilter?: boolean,
    appliedFilters?: FilterExpr[],
    toggleStates?: Record<string, boolean>
  ): Promise<RenderableTableData> {
    try {
      // Get resolved spec
      const spec = resolveTableSpec(presetId, module);

      // Load lookup options in parallel
      await this.preloadLookupOptions(spec.columns);

      // Load table rows (pass module for FK determination)
      const rows = await this.loadRows(spec, entityId, module, activeFilter, appliedFilters, toggleStates);

      // Transform to renderable format
      const renderableRows = rows.map(row => this.transformRow(row, spec.columns));

      return {
        spec,
        rows: renderableRows,
        loading: false,
        totalCount: rows.length,
      };
    } catch (error) {
      console.error('Failed to load table data:', error);
      return {
        spec: resolveTableSpec(presetId),
        rows: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Preload all lookup options for the table columns
   */
  private async preloadLookupOptions(columns: ResolvedTableColumn[]): Promise<void> {
    const lookupPromises = columns
      .filter(col => col.lookup)
      .map(col => this.loadLookupOptions(col));

    await Promise.all(lookupPromises);
  }

  /**
   * Load lookup options for a specific column
   */
  private async loadLookupOptions(column: ResolvedTableColumn): Promise<void> {
    if (!column.lookup) return;

    const cacheKey = `${column.lookup.table}|${column.lookup.valueColumn}|${column.lookup.labelColumn}`;

    if (this.optionsCache.has(cacheKey)) return;

    try {
      let query = supabase
        .from(column.lookup.table)
        .select(`${column.lookup.valueColumn}, ${column.lookup.labelColumn}`)
        .order(column.lookup.labelColumn, { ascending: true });

      // Special handling for guides table
      if (column.lookup.table === 'guides') {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        const options = data
          .map(row => {
            const value = String(row[column.lookup!.valueColumn] ?? '');
            const label = String(row[column.lookup!.labelColumn] ?? value);
            return value ? { value, label } : null;
          })
          .filter(Boolean) as SelectOption[];

        this.optionsCache.set(cacheKey, options);
      }
    } catch (error) {
      console.error(`Failed to load lookup options for ${column.field}:`, error);
    }
  }

  /**
   * Load enum options for a field
   */
  private getEnumOptions(enumName: string): SelectOption[] {
    const cached = this.optionsCache.get(`enum:${enumName}`);
    if (cached) return cached;

    if (ENUM_OPTIONS[enumName]) {
      const options = ENUM_OPTIONS[enumName].map(value => ({
        value: String(value),
        label: String(value)
      }));
      this.optionsCache.set(`enum:${enumName}`, options);
      return options;
    }

    return [];
  }

  /**
   * Load table rows from database
   */
  private async loadRows(
    spec: ResolvedTableSpec,
    entityId?: string,
    module?: string,
    activeFilter?: boolean,
    appliedFilters?: FilterExpr[],
    toggleStates?: Record<string, boolean>
  ): Promise<any[]> {
    let query = fromTable(spec.readSource).select('*');

    // Apply entity filter if provided
    if (entityId) {
      // Use module to determine FK column
      const fkColumn = this.inferForeignKeyColumn(spec.readSource, module);
      query = query.eq(fkColumn, entityId);
    }

    // Apply active filter if requested
    if (activeFilter) {
      query = query.eq('is_active', true);
    }

    // Apply base filters from spec
    if (spec.readFilter) {
      query = this.applyFilter(query, spec.readFilter);
    }

    // Apply toggle filters
    if (spec.toggles && toggleStates) {
      for (const toggle of spec.toggles) {
        if (toggleStates[toggle.id] !== false) { // default on or explicitly on
          query = this.applyFilter(query, toggle.expr);
        }
      }
    }

    // Apply additional filters
    if (appliedFilters) {
      for (const filter of appliedFilters) {
        query = this.applyFilter(query, filter);
      }
    }

    // Apply ordering
    if (spec.orderBy && spec.orderBy.length > 0) {
      for (const order of spec.orderBy) {
        query = query.order(order.column, { ascending: order.ascending !== false });
      }
    }

    // Apply limit
    if (spec.limit) {
      query = query.limit(spec.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Apply a filter expression to a query
   */
  private applyFilter(query: any, filter: FilterExpr): any {
    if ('eq' in filter) {
      return query.eq(filter.eq.column, filter.eq.value);
    }
    if ('neq' in filter) {
      return query.neq(filter.neq.column, filter.neq.value);
    }
    // TODO: Handle 'or' and 'and' filters
    return query;
  }

  /**
   * Infer foreign key column name from module and table name
   */
  private inferForeignKeyColumn(tableName: string, module?: string): string {
    // Remove schema prefix if present
    const table = tableName.includes('.') ? tableName.split('.')[1] : tableName;

    // Use module to determine FK column
    if (module) {
      switch (module) {
        case 'schools':
          return 'school_id';
        case 'educators':
          return 'people_id';
        case 'charters':
          return 'charter_id';
      }
    }

    // Fallback to table-based inference
    if (table.endsWith('_associations') || table.startsWith('details_')) {
      return 'entity_id';
    }
    if (table.includes('people') || table.includes('educator')) {
      return 'person_id';
    }
    if (table.includes('school')) {
      return 'school_id';
    }
    if (table.includes('charter')) {
      return 'charter_id';
    }

    return 'id'; // fallback
  }

  /**
   * Transform a raw row into a renderable row
   */
  private transformRow(rawRow: Record<string, any>, columns: ResolvedTableColumn[]): RenderableRow {
    const cells: Record<string, CellValue> = {};

    for (const column of columns) {
      const rawValue = rawRow[column.field];
      cells[column.field] = this.transformCellValue(rawValue, column);
    }

    return {
      id: rawRow.id || rawRow[this.getPrimaryKeyField(rawRow)],
      originalData: rawRow,
      cells,
    };
  }

  /**
   * Transform a single cell value for display
   */
  private transformCellValue(rawValue: any, column: ResolvedTableColumn): CellValue {
    let displayValue = '';
    let options: SelectOption[] | undefined;

    // Get options for enum/lookup fields
    if (column.type === 'enum') {
      if (column.lookup) {
        const cacheKey = `${column.lookup.table}|${column.lookup.valueColumn}|${column.lookup.labelColumn}`;
        options = this.optionsCache.get(cacheKey);
      } else if (column.options) {
        options = column.options.map(opt => ({ value: opt, label: opt }));
      }
    }

    // Format display value
    displayValue = this.formatDisplayValue(rawValue, column, options);

    return {
      raw: rawValue,
      display: displayValue,
      editable: column.editable,
      options,
      type: column.type || 'string',
      multiline: column.multiline,
      linkToField: column.linkToField,
      attachment: column.attachment,
    };
  }

  /**
   * Format a value for display
   */
  private formatDisplayValue(
    value: any,
    column: ResolvedTableColumn,
    options?: SelectOption[]
  ): string {
    if (value === null || value === undefined) return '';

    // Handle arrays
    if (column.array && Array.isArray(value)) {
      const maxEntries = column.maxArrayEntries || 5;
      const displayItems = value.slice(0, maxEntries).map(item => String(item)).filter(Boolean);
      const result = displayItems.join(', ');
      return value.length > maxEntries ? `${result}... (+${value.length - maxEntries} more)` : result;
    }

    // Handle lookup values
    if (options && options.length > 0) {
      const option = options.find(opt => opt.value === String(value));
      return option ? option.label : String(value);
    }

    // Handle specific field types
    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';

      case 'date':
        if (value) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
        }
        break;

      case 'number':
        if (column.field.includes('amount') || column.field.includes('cost')) {
          return formatCurrencyUSD(Number(value) || 0);
        }
        break;
    }

    return String(value);
  }

  /**
   * Get primary key field from a row
   */
  private getPrimaryKeyField(row: Record<string, any>): string {
    if ('id' in row) return 'id';
    if ('uuid' in row) return 'uuid';
    return Object.keys(row)[0] || 'id';
  }

  /**
   * Get cached options for a column
   */
  getLookupOptions(column: ResolvedTableColumn): SelectOption[] {
    if (!column.lookup) return [];
    const cacheKey = `${column.lookup.table}|${column.lookup.valueColumn}|${column.lookup.labelColumn}`;
    return this.optionsCache.get(cacheKey) || [];
  }

  /**
   * Clear the options cache
   */
  clearCache(): void {
    this.optionsCache.clear();
  }
}

// Singleton instance
export const tableService = new TableService();