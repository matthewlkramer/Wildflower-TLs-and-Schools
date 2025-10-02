import { supabase } from '@/core/supabase/client';
import { getColumnMetadata } from '@/generated/schema-metadata';
import { GENERATED_LOOKUPS } from '@/generated/lookups.generated';
import { ENUM_OPTIONS } from '@/generated/enums.generated';
import type { FieldMetadata, LookupException } from './detail-types';
import type { CardSpec } from '../views/types';

export type SelectOption = { value: string; label: string };

export type FieldValue = {
  raw: any;
  display: string;
  editable: boolean;
  required?: boolean;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment';
  options?: SelectOption[];
  multiline?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidator?: (value: any) => string | null;
  };
};

export type CardField = {
  field: string;
  label: string;
  value: FieldValue;
  metadata: FieldMetadata;
};

export type RenderableCard = {
  entityId: any;
  title?: string;
  fields: CardField[];
  editable: boolean;
  loading: boolean;
  error?: string;
  saveTarget?: {
    schema?: string;
    table: string;
    pk?: string;
  };
};

export class CardService {
  private optionsCache = new Map<string, SelectOption[]>();

  /**
   * Load card data for a specific entity
   */
  async loadCardData(
    block: CardSpec,
    entityId: string,
    sourceTable?: string
  ): Promise<RenderableCard> {
    try {
      // Load entity data
      const entityData = await this.loadEntityData(sourceTable || 'people', entityId);

      // Load field metadata and options
      const fields = await this.resolveFields(block.fields, entityData, undefined);

      return {
        entityId,
        title: block.title,
        fields,
        editable: block.editable ?? false,
        loading: false,
        saveTarget: undefined, // CardSpec doesn't have editSource
      };
    } catch (error) {
      console.error('Failed to load card data:', error);
      return {
        entityId,
        title: block.title,
        fields: [],
        editable: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Load entity data from database
   */
  private async loadEntityData(table: string, entityId: string): Promise<Record<string, any>> {
    const [schema, tableName] = table.includes('.') ? table.split('.') : ['public', table];

    let query = supabase.from(tableName).select('*').eq('id', entityId);

    if (schema !== 'public') {
      query = supabase.schema(schema).from(tableName).select('*').eq('id', entityId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Failed to load entity data: ${error.message}`);
    }

    return data || {};
  }

  /**
   * Resolve field specifications into renderable fields
   */
  private async resolveFields(
    fieldNames: string[],
    entityData: Record<string, any>,
    editSource?: any
  ): Promise<CardField[]> {
    const fields: CardField[] = [];

    for (const fieldName of fieldNames) {
      try {
        const field = await this.resolveField(fieldName, entityData, editSource);
        if (field) {
          fields.push(field);
        }
      } catch (error) {
        console.error(`Failed to resolve field ${fieldName}:`, error);
      }
    }

    return fields;
  }

  /**
   * Resolve a single field into a renderable field
   */
  private async resolveField(
    fieldName: string,
    entityData: Record<string, any>,
    editSource?: any
  ): Promise<CardField | null> {
    // Get field metadata from schema
    const sourceTable = editSource?.table || 'people';
    const [schema, table] = sourceTable.includes('.') ? sourceTable.split('.') : ['public', sourceTable];
    const metadata = getColumnMetadata(schema, table, fieldName);

    if (!metadata) {
      // Create basic metadata for unknown fields
      return {
        field: fieldName,
        label: this.fieldToLabel(fieldName),
        value: {
          raw: entityData[fieldName],
          display: String(entityData[fieldName] || ''),
          editable: false,
          type: 'string',
        },
        metadata: { label: this.fieldToLabel(fieldName) },
      };
    }

    // Resolve lookup/enum options
    let options: SelectOption[] | undefined;
    let fieldType: FieldValue['type'] = 'string';

    // Check for lookup configuration
    if (GENERATED_LOOKUPS[fieldName]) {
      const lookupConfig = GENERATED_LOOKUPS[fieldName];
      options = await this.loadLookupOptions(lookupConfig.table, lookupConfig.valueColumn, lookupConfig.labelColumn);
      fieldType = 'enum';
    }
    // Check for enum options
    else if (metadata.enumName && ENUM_OPTIONS[metadata.enumName]) {
      options = ENUM_OPTIONS[metadata.enumName].map(value => ({
        value: String(value),
        label: String(value)
      }));
      fieldType = 'enum';
    }
    // Determine type from schema metadata
    else if (metadata.baseType) {
      fieldType = this.mapSchemaType(metadata.baseType);
    }

    const rawValue = entityData[fieldName];
    const displayValue = this.formatDisplayValue(rawValue, fieldType, options);

    return {
      field: fieldName,
      label: metadata.label || this.fieldToLabel(fieldName),
      value: {
        raw: rawValue,
        display: displayValue,
        editable: true, // TODO: Determine editability from metadata/permissions
        type: fieldType,
        options,
        multiline: fieldName.includes('text') || fieldName.includes('description') || fieldName.includes('notes'),
        validation: this.getFieldValidation(metadata),
      },
      metadata: metadata as FieldMetadata,
    };
  }

  /**
   * Load lookup options for a table
   */
  private async loadLookupOptions(
    table: string,
    valueColumn: string,
    labelColumn: string
  ): Promise<SelectOption[]> {
    const cacheKey = `${table}|${valueColumn}|${labelColumn}`;

    if (this.optionsCache.has(cacheKey)) {
      return this.optionsCache.get(cacheKey)!;
    }

    try {
      let query = supabase
        .from(table)
        .select(`${valueColumn}, ${labelColumn}`)
        .order(labelColumn, { ascending: true });

      // Special handling for guides table
      if (table === 'guides') {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        const options = data
          .map(row => {
            const value = String(row[valueColumn] ?? '');
            const label = String(row[labelColumn] ?? value);
            return value ? { value, label } : null;
          })
          .filter(Boolean) as SelectOption[];

        this.optionsCache.set(cacheKey, options);
        return options;
      }
    } catch (error) {
      console.error(`Failed to load lookup options for ${table}:`, error);
    }

    return [];
  }

  /**
   * Save field values to database
   */
  async saveCardData(
    card: RenderableCard,
    changedValues: Record<string, any>
  ): Promise<void> {
    if (!card.saveTarget) {
      throw new Error('No save target specified for card');
    }

    const { schema = 'public', table, pk = 'id' } = card.saveTarget;

    try {
      let query = supabase.from(table).update(changedValues).eq(pk, card.entityId);

      if (schema !== 'public') {
        query = supabase.schema(schema).from(table).update(changedValues).eq(pk, card.entityId);
      }

      const { error } = await query;

      if (error) {
        throw new Error(`Failed to save data: ${error.message}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  }

  /**
   * Validate field value
   */
  validateField(field: CardField, value: any): string | null {
    const { validation } = field.value;
    if (!validation) return null;

    const stringValue = String(value || '');

    // Required validation
    if (field.value.required && !value) {
      return `${field.label} is required`;
    }

    // Length validation
    if (validation.minLength && stringValue.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && stringValue.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    // Pattern validation
    if (validation.pattern && !new RegExp(validation.pattern).test(stringValue)) {
      return `${field.label} format is invalid`;
    }

    // Custom validation
    if (validation.customValidator) {
      return validation.customValidator(value);
    }

    return null;
  }

  /**
   * Helper methods
   */
  private fieldToLabel(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/Id$/, 'ID')
      .replace(/Url$/, 'URL')
      .replace(/Api$/, 'API');
  }

  private mapSchemaType(baseType: string): FieldValue['type'] {
    switch (baseType) {
      case 'boolean': return 'boolean';
      case 'number': return 'number';
      case 'date': return 'date';
      case 'enum': return 'enum';
      default: return 'string';
    }
  }

  private formatDisplayValue(
    value: any,
    type: FieldValue['type'],
    options?: SelectOption[]
  ): string {
    if (value === null || value === undefined) return '';

    // Handle lookup values
    if (options && options.length > 0) {
      const option = options.find(opt => opt.value === String(value));
      return option ? option.label : String(value);
    }

    // Handle specific types
    switch (type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        if (value) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
        }
        break;
    }

    return String(value);
  }

  private getFieldValidation(metadata: any): FieldValue['validation'] | undefined {
    // TODO: Extract validation rules from metadata
    return undefined;
  }

  /**
   * Clear the options cache
   */
  clearCache(): void {
    this.optionsCache.clear();
  }
}

// Singleton instance
export const cardService = new CardService();