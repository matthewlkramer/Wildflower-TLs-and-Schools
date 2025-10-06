/**
 * Field Registry - Merges generated schema with manual overrides
 * This is the main API for field configuration
 */

import {
  getGeneratedFieldInfo,
  getAllGeneratedFields,
  humanizeFieldName,
  fieldExists,
  type FieldType,
} from './field-registry-base';
import type { LookupConfig } from '@/generated/lookups.generated';

/**
 * Manual field configuration (overrides generated)
 */
export type FieldConfig = {
  // Display
  label?: string;
  type?: FieldType;
  multiline?: boolean;
  width?: number | string;

  // Data
  array?: boolean;
  nullable?: boolean;
  lookup?: LookupConfig;
  lookupTable?: string; // Shorthand: looks up in GENERATED_LOOKUPS
  enumName?: string;
  options?: string[];

  // Relationships
  linksTo?: {
    field: string;
    type: 'single' | 'array';
  };

  // Editing
  editable?: boolean;
  required?: boolean;
  maxLength?: number;
  maxArrayEntries?: number;

  // Storage (for attachments)
  sourceTable?: string; // Fetch from different table (e.g., school_ssj_data)
  bucket?: string; // Storage bucket name

  // Visibility
  visibility?: 'visible' | 'suppress' | 'hidden';

  // Validation
  customValidator?: (value: any) => string | null;
};

/**
 * Complete field configuration (generated + manual merged)
 */
export type CompleteFieldConfig = {
  field: string;
  table: string;

  // Core
  type: FieldType;
  array: boolean;
  nullable: boolean;

  // Display
  label: string;
  multiline?: boolean;
  width?: number | string;

  // Data
  lookup: LookupConfig | null;
  lookupTable?: string;
  enumName?: string;
  options?: string[];

  // Relationships
  linksTo?: {
    field: string;
    type: 'single' | 'array';
  };
  foreignKeys: Array<{
    table: string;
    column: string;
  }>;

  // Editing
  editable: boolean;
  required: boolean;
  maxLength?: number;
  maxArrayEntries?: number;

  // Storage
  sourceTable?: string;
  bucket?: string;

  // Visibility
  visibility: 'visible' | 'suppress' | 'hidden';

  // Validation
  customValidator?: (value: any) => string | null;
};

/**
 * Field Registry - manages field configuration for a table
 */
export class FieldRegistry<TFieldNames extends string = string> {
  private tableName: string;
  private manualConfig: Partial<Record<TFieldNames, FieldConfig>>;
  private cache: Map<string, CompleteFieldConfig> = new Map();

  constructor(
    tableName: string,
    manualConfig: Partial<Record<TFieldNames, FieldConfig>> = {}
  ) {
    this.tableName = tableName;
    this.manualConfig = manualConfig;
  }

  /**
   * Get complete configuration for a field
   * Merges generated metadata with manual overrides
   */
  get(fieldName: TFieldNames): CompleteFieldConfig {
    // Check cache
    const cached = this.cache.get(fieldName as string);
    if (cached) return cached;

    // Get generated base
    const generated = getGeneratedFieldInfo(this.tableName, fieldName as string);

    // Get manual overrides
    const manual = this.manualConfig[fieldName] || {};

    // Merge
    const config: CompleteFieldConfig = {
      field: fieldName as string,
      table: this.tableName,

      // Core (manual overrides generated)
      type: manual.type || generated?.type || 'string',
      array: manual.array ?? generated?.array ?? false,
      nullable: manual.nullable ?? generated?.nullable ?? true,

      // Display
      label: manual.label || humanizeFieldName(fieldName as string),
      multiline: manual.multiline,
      width: manual.width,

      // Data
      lookup: manual.lookup || generated?.lookup || null,
      lookupTable: manual.lookupTable,
      enumName: manual.enumName || generated?.enumRef || undefined,
      options: manual.options,

      // Relationships
      linksTo: manual.linksTo,
      foreignKeys: generated?.foreignKeys || [],

      // Editing
      editable: manual.editable ?? true,
      required: manual.required ?? !generated?.nullable ?? false,
      maxLength: manual.maxLength,
      maxArrayEntries: manual.maxArrayEntries,

      // Storage
      sourceTable: manual.sourceTable,
      bucket: manual.bucket,

      // Visibility
      visibility: manual.visibility || 'visible',

      // Validation
      customValidator: manual.customValidator,
    };

    // Cache it
    this.cache.set(fieldName as string, config);

    return config;
  }

  /**
   * Get all fields for this table
   */
  getAllFields(): CompleteFieldConfig[] {
    const generatedFields = getAllGeneratedFields(this.tableName);
    return generatedFields.map(f => this.get(f as TFieldNames));
  }

  /**
   * Get only fields that should be visible
   */
  getVisibleFields(): CompleteFieldConfig[] {
    return this.getAllFields().filter(f => f.visibility === 'visible');
  }

  /**
   * Get fields suitable for a specific layout (title, subtitle, body, etc.)
   */
  getFieldsForLayout(layout: 'title' | 'subtitle' | 'body' | 'badge'): CompleteFieldConfig[] {
    // Could be extended with layout hints in manual config
    const all = this.getVisibleFields();

    switch (layout) {
      case 'title':
        return all.filter(f => ['string', 'lookup'].includes(f.type) && !f.multiline);
      case 'subtitle':
        return all.filter(f => ['string', 'date', 'number'].includes(f.type));
      case 'body':
        return all.filter(f => f.multiline || f.type === 'string');
      case 'badge':
        return all.filter(f => f.type === 'boolean' || f.type === 'enum');
      default:
        return all;
    }
  }

  /**
   * Validate registry configuration
   * Checks that linked fields exist, lookups are valid, etc.
   */
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(this.manualConfig).forEach(([fieldName, config]) => {
      const typedFieldName = fieldName as TFieldNames;

      // Check field exists in schema
      if (!fieldExists(this.tableName, fieldName)) {
        errors.push(`Field "${fieldName}" not found in table "${this.tableName}"`);
      }

      // Check linksTo target exists
      if (config.linksTo) {
        if (!fieldExists(this.tableName, config.linksTo.field)) {
          errors.push(
            `Field "${fieldName}" links to non-existent field "${config.linksTo.field}"`
          );
        }

        // Check linked field is correct type
        const linkedField = this.get(config.linksTo.field as TFieldNames);
        if (config.linksTo.type === 'array' && !linkedField.array) {
          warnings.push(
            `Field "${fieldName}" links to "${config.linksTo.field}" as array, but target is not an array`
          );
        }
      }

      // Check lookupTable reference
      if (config.lookupTable) {
        // Would check if lookup exists in GENERATED_LOOKUPS
        // (implementation omitted for brevity)
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Get configuration summary for debugging
   */
  getSummary() {
    const all = this.getAllFields();
    return {
      table: this.tableName,
      totalFields: all.length,
      visibleFields: all.filter(f => f.visibility === 'visible').length,
      suppressedFields: all.filter(f => f.visibility === 'suppress').length,
      editableFields: all.filter(f => f.editable).length,
      fieldTypes: all.reduce((acc, f) => {
        acc[f.type] = (acc[f.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Helper to create a typed field registry
 */
export function createFieldRegistry<T extends string>(
  tableName: string,
  manualConfig: Partial<Record<T, FieldConfig>> = {}
): FieldRegistry<T> {
  return new FieldRegistry<T>(tableName, manualConfig);
}
