import { supabase } from '@/core/supabase/client';
import { getColumnMetadata, findColumnMetadata } from '@/generated/schema-metadata';
import { GENERATED_LOOKUPS } from '@/generated/lookups.generated';
import { ENUM_OPTIONS, FIELD_TYPES } from '@/generated/enums.generated';
import type { FieldMetadata, LookupException } from '../types/detail-types';
import type { CardSpec } from '../views/types';
import { fromTable } from '../utils/supabase-utils';
import { getStorageBucket } from '../config/storage-buckets';

export type SelectOption = { value: string; label: string };

export type FieldValue = {
  raw: any;
  display: string;
  editable: boolean;
  required?: boolean;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment';
  options?: SelectOption[];
  multiline?: boolean;
  bucket?: string; // Supabase storage bucket for attachments
  isImage?: boolean; // Whether attachment is an image
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
  linkToAttachmentArray?: string; // Points to another field containing URL array
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

export type RenderableListRow = {
  id: any;
  originalData: Record<string, any>;
  fields: Record<string, CardField>; // field name → CardField
};

export type RenderableListData = {
  preset: string;
  rows: RenderableListRow[];
  loading: boolean;
  error?: string;
  totalCount?: number;
  rowActions?: readonly string[];
  tableActions?: readonly import('../types/detail-types').TableActionSpec[];
};

export class CardService {
  private optionsCache = new Map<string, SelectOption[]>();

  /**
   * Load card data for a specific entity
   */
  async loadCardData(
    block: CardSpec,
    entityId: string,
    sourceTable?: string,
    viewFieldMetadata?: import('../types/detail-types').FieldMetadataMap
  ): Promise<RenderableCard> {
    try {
      const tableName = sourceTable || 'people';

      // Load entity data
      const entityData = await this.loadEntityData(tableName, entityId);

      // Load field metadata and options
      const fields = await this.resolveFields(block.fields, entityData, { table: tableName }, viewFieldMetadata);

      return {
        entityId,
        title: block.title,
        fields,
        editable: block.editable ?? false,
        loading: false,
        saveTarget: block.editable ? { table: tableName, pk: 'id' } : undefined,
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
   * Load list data for multiple entities (e.g., governance docs, educators)
   */
  async loadListData(
    presetId: string,
    parentEntityId?: string,
    module?: string,
    activeFilter?: boolean,
    viewFieldMetadata?: import('../types/detail-types').FieldMetadataMap
  ): Promise<RenderableListData> {
    try {
      const { TABLE_LIST_PRESETS } = await import('../config/table-list-presets');
      const preset = TABLE_LIST_PRESETS[presetId as keyof typeof TABLE_LIST_PRESETS];

      if (!preset) {
        throw new Error(`Unknown preset: ${presetId}`);
      }

      const tableName = preset.readSource || presetId;

      // Build query
      let query = fromTable(tableName).select('*');

      // Apply filters
      if (parentEntityId && module) {
        // Map module names to their corresponding foreign key columns
        // Educators, charter, and other person-based modules use people_id
        const moduleToForeignKey: Record<string, string> = {
          'educators': 'people_id',
          'people': 'people_id',
        };

        const foreignKeyColumn = moduleToForeignKey[module] || `${module}_id`;
        query = query.eq(foreignKeyColumn, parentEntityId);
      }

      if (activeFilter && preset.readFilter) {
        const filter = preset.readFilter as any;
        if (filter.eq) {
          query = query.eq(filter.eq.column, filter.eq.value);
        }
      }

      // Apply ordering
      if (preset.orderBy) {
        const orderConfig = Array.isArray(preset.orderBy) ? preset.orderBy[0] : preset.orderBy;
        query = query.order(orderConfig.column, { ascending: orderConfig.ascending });
      }

      // Apply limit
      const limit = preset.cardLimit || 50;
      query = query.limit(limit);

      const { data: rawRows, error } = await query;

      if (error) {
        throw new Error(`Failed to load list data: ${error.message}`);
      }

      // Get field names from preset columns
      const fieldNames = (preset.columns || []).map((col: any) =>
        typeof col === 'string' ? col : col.field
      );

      // Transform each row into RenderableListRow
      const rows: RenderableListRow[] = [];

      for (const rawRow of rawRows || []) {
        const fields: Record<string, CardField> = {};

        // Resolve all fields for this row
        const resolvedFields = await this.resolveFields(
          fieldNames,
          rawRow,
          { table: tableName },
          viewFieldMetadata
        );

        // Convert array of CardFields to Record<string, CardField>
        // Also add linkToAttachmentArray from preset column metadata
        for (const field of resolvedFields) {
          const columnConfig = (preset.columns || []).find((col: any) =>
            (typeof col === 'string' ? col : col.field) === field.field
          );

          fields[field.field] = {
            ...field,
            linkToAttachmentArray: typeof columnConfig === 'object' ? (columnConfig as any).linkToAttachmentArray : undefined,
          };
        }

        rows.push({
          id: rawRow.id,
          originalData: rawRow,
          fields,
        });
      }

      return {
        preset: presetId,
        rows,
        loading: false,
        totalCount: rawRows?.length || 0,
        rowActions: preset.rowActions,
        tableActions: preset.tableActions,
      };
    } catch (error) {
      console.error('Failed to load list data:', error);
      return {
        preset: presetId,
        rows: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Load entity data from database
   */
  async loadEntityData(table: string, entityId: string): Promise<Record<string, any>> {
    const { data, error } = await fromTable(table)
      .select('*')
      .eq('id', entityId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load entity data: ${error.message}`);
    }

    return data || {};
  }

  /**
   * Resolve field specifications into renderable fields
   */
  async resolveFields(
    fieldNames: string[],
    entityData: Record<string, any>,
    editSource?: any,
    viewFieldMetadata?: import('../types/detail-types').FieldMetadataMap
  ): Promise<CardField[]> {
    const fields: CardField[] = [];

    // Check if any fields need data from other tables (via writeTable property)
    const fieldsNeedingExtraData = fieldNames.filter(fieldName => {
      const metadata = viewFieldMetadata?.[fieldName];
      return (metadata as any)?.writeTable;
    });

    // Load additional table data if needed
    const extraTableData: Record<string, Record<string, any>> = {};
    for (const fieldName of fieldsNeedingExtraData) {
      const metadata = viewFieldMetadata?.[fieldName];
      const writeTable = (metadata as any)?.writeTable;
      if (writeTable && !extraTableData[writeTable]) {
        try {
          // Load data from the write table using the same entity ID
          const entityId = entityData.id;
          const { data } = await fromTable(writeTable)
            .select('*')
            .eq('id', entityId)
            .maybeSingle();
          extraTableData[writeTable] = data || {};
          console.log('[card-service] Loaded extra data from', writeTable, ':', data);
        } catch (error) {
          console.error(`Failed to load data from ${writeTable}:`, error);
          extraTableData[writeTable] = {};
        }
      }
    }

    for (const fieldName of fieldNames) {
      try {
        const manualMetadata = viewFieldMetadata?.[fieldName];
        const writeTable = (manualMetadata as any)?.writeTable;

        // If this field has a writeTable, use data from that table
        const fieldEntityData = writeTable && extraTableData[writeTable]
          ? extraTableData[writeTable]
          : entityData;

        const field = await this.resolveField(fieldName, fieldEntityData, editSource, manualMetadata);
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
    editSource?: any,
    manualMetadata?: import('../types/detail-types').FieldMetadata
  ): Promise<CardField | null> {
    console.log('[card-service] Resolving field:', fieldName, 'manualMetadata:', manualMetadata);
    // Get field metadata from schema
    const sourceTable = editSource?.table || 'people';
    const [schema, table] = sourceTable.includes('.') ? sourceTable.split('.') : ['public', sourceTable];
    let schemaMetadata = getColumnMetadata(schema, table, fieldName);

    // If not found in the source table, search all tables to find it
    let actualTable = table;
    if (!schemaMetadata) {
      const foundMetadata = findColumnMetadata(schema, fieldName);
      if (foundMetadata) {
        schemaMetadata = foundMetadata;
        actualTable = foundMetadata.foundTable;
      }
    }

    // Merge manual metadata with schema metadata using the existing merge function
    const mergedMetadata = manualMetadata
      ? (await import('@/generated/schema-metadata')).mergeFieldMetadata({
          field: fieldName,
          manual: manualMetadata,
          schema,
          table
        })
      : undefined;

    // Use merged metadata if available, otherwise fall back to schema metadata
    const metadata = mergedMetadata || schemaMetadata;

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
    let isArrayField = false;

    // Check if this is an array field from FIELD_TYPES (use actualTable which may differ from source table)
    const fieldTypeKey = `${schema}.${actualTable}.${fieldName}`;
    const fieldTypeInfo = FIELD_TYPES[fieldTypeKey];
    if (fieldTypeInfo?.array) {
      isArrayField = true;
    }

    // Check for explicit lookup table in metadata (from view field metadata) - FIRST priority
    // Check manual metadata first, then merged metadata
    const lookupTable = (manualMetadata as any)?.lookupTable || (metadata as any)?.lookupTable;
    if (lookupTable) {
      if (GENERATED_LOOKUPS[lookupTable]) {
        const lookupConfig = GENERATED_LOOKUPS[lookupTable];
        options = await this.loadLookupOptions(lookupConfig.table, lookupConfig.valueColumn, lookupConfig.labelColumn);
        fieldType = isArrayField ? 'string' : 'enum';
      }
    }
    // Check for enum options from schema metadata
    else if (metadata.enumRef && ENUM_OPTIONS[metadata.enumRef]) {
      options = ENUM_OPTIONS[metadata.enumRef].map(value => ({
        value: String(value),
        label: String(value)
      }));
      fieldType = isArrayField ? 'string' : 'enum';
    }
    // Check FIELD_TYPES mapping for enum fields (text columns with enum-like values)
    else if (!metadata.enumRef && fieldTypeInfo?.baseType === 'enum' && fieldTypeInfo.enumName && ENUM_OPTIONS[fieldTypeInfo.enumName]) {
      options = ENUM_OPTIONS[fieldTypeInfo.enumName].map(value => ({
        value: String(value),
        label: String(value)
      }));
      fieldType = isArrayField ? 'string' : 'enum';
    }
    // Check for foreign key references
    if (!options && metadata.references && metadata.references.length > 0) {
      const firstRef = metadata.references[0];
      const refTable = firstRef.relation;
      // Try to find the best label column - prefer 'name', 'label', or 'title' columns
      const labelColumn = this.guessLabelColumn(refTable);
      options = await this.loadLookupOptions(refTable, 'id', labelColumn);
      fieldType = 'enum';
    }
    // Check for explicit lookup configuration by field name
    if (!options && GENERATED_LOOKUPS[fieldName]) {
      const lookupConfig = GENERATED_LOOKUPS[fieldName];
      options = await this.loadLookupOptions(lookupConfig.table, lookupConfig.valueColumn, lookupConfig.labelColumn);
      fieldType = 'enum';
    }
    // Check if this is an attachment field from manual metadata
    const isAttachment = (manualMetadata as any)?.type === 'attachment';

    // Determine type from manual metadata first, then schema metadata
    if (isAttachment) {
      fieldType = 'attachment';
    } else if (!options && metadata.baseType) {
      fieldType = this.mapSchemaType(metadata.baseType);
    }

    const rawValue = entityData[fieldName];
    let displayValue = this.formatDisplayValue(rawValue, fieldType, options);

    // Get bucket and isImage from manual metadata if available
    let bucket = (manualMetadata as any)?.bucket;
    const isImage = (manualMetadata as any)?.isImage;

    // Handle attachment fields - convert storage path to public URL
    let processedRawValue = rawValue;
    if (isAttachment) {
      console.log('[card-service] Field', fieldName, 'is attachment, rawValue:', rawValue);
    }
    if (isAttachment && rawValue) {
      // Get bucket from manual metadata, or use field-name-based mapping
      if (!bucket) {
        bucket = getStorageBucket(fieldName, actualTable);
      }

      console.log('[card-service] Attachment field:', fieldName, 'table:', actualTable, 'rawValue:', rawValue, 'bucket:', bucket);

      // Query storage.objects to get the actual filename with extension
      // Try storage.objects first (in storage schema), fall back to storage_object_id_path view
      let filePath = rawValue;
      let { data: storageObject, error: storageError } = await supabase
        .schema('storage')
        .from('objects')
        .select('name')
        .eq('id', rawValue)
        .maybeSingle();

      // If storage.objects fails (permissions), try the public view
      if (storageError || !storageObject) {
        console.log('[card-service] Trying storage_object_id_path view as fallback');
        const fallback = await supabase
          .from('storage_object_id_path')
          .select('name')
          .eq('id', rawValue)
          .maybeSingle();
        storageObject = fallback.data;
        storageError = fallback.error;
      }

      if (storageObject && storageObject.name) {
        filePath = storageObject.name;
        console.log('[card-service] Found filename:', filePath);
      } else {
        console.warn('[card-service] Could not find file for UUID:', rawValue, 'Error:', storageError);
      }

      // Convert storage path to public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      processedRawValue = data.publicUrl;
      displayValue = data.publicUrl;

      console.log('[card-service] Generated public URL:', data.publicUrl);
    }

    return {
      field: fieldName,
      label: metadata.label || this.fieldToLabel(fieldName),
      value: {
        raw: processedRawValue,
        display: displayValue,
        editable: true, // TODO: Determine editability from metadata/permissions
        type: fieldType,
        options,
        multiline: fieldName.includes('text') || fieldName.includes('description') || fieldName.includes('notes'),
        bucket,
        isImage,
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

    // Handle array values
    if (Array.isArray(value)) {
      if (options && options.length > 0) {
        // Map array values to their labels
        const labels = value
          .map(v => {
            const option = options.find(opt => opt.value === String(v));
            return option ? option.label : String(v);
          })
          .filter(Boolean);
        return labels.join(', ');
      }
      return value.join(', ');
    }

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
   * Guess the best label column for a lookup table
   */
  private guessLabelColumn(table: string): string {
    // Common label column patterns
    const commonPatterns = [
      'name', 'full_name', 'short_name', 'long_name', 'school_name',
      'label', 'title', 'value', 'email', 'email_or_name'
    ];

    // Special cases for known tables
    const tableSpecificColumns: Record<string, string> = {
      'people': 'full_name',
      'schools': 'school_name',
      'details_schools': 'school_name',
      'charters': 'short_name',
      'guides': 'email_or_name',
      'zref_stage_statuses': 'value',
      'zref_membership_statuses': 'value',
      'zref_race_and_ethnicity': 'label',
    };

    return tableSpecificColumns[table] || commonPatterns[0];
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