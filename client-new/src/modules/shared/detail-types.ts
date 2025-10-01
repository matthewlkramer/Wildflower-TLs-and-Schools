export type ColumnVisibility = 'show' | 'hide' | 'suppress';

export type GridValueKind = 'string' | 'boolean' | 'multi' | 'select' | 'date' | 'number';

export type GridColumnConfig = {
  field: string;
  headerName: string;
  visibility?: ColumnVisibility;
  valueType?: GridValueKind;
  selectOptions?: string[];
  lookupField?: string;
  enumName?: string;
  sortKey?: boolean;
  kanbanKey?: boolean;
};

export type LookupException = {
  field: string;
  mapsToField?: string;
  viaLookup?: {
    schema?: string;
    table: string;
    labelColumn: string;
    keyColumn: string;
  };
};

export type CardEditSource = {
  schema?: string;
  table: string;
  pk?: string;
  exceptions?: LookupException[];
};

export type DetailFieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'attachment';

export type FieldEditConfig = {
  schema?: string;
  table: string;
  pk?: string;
  column?: string;
  enumName?: string;
  exceptions?: LookupException[];
};

export type FieldReference = {
  schema?: string;
  table: string;
  valueColumn: string;
  labelColumn: string;
};

export type FieldLookup = {
  schema?: string;
  table: string;
  valueColumn: string;
  labelColumn: string;
};

export type FieldMetadata = {
  label?: string;
  type?: DetailFieldType;
  array?: boolean;
  maxArrayEntries?: number;
  multiline?: boolean;
  width?: number | string;
  options?: string[];
  lookup?: FieldLookup;
  edit?: FieldEditConfig;
  reference?: FieldReference;
  // New: explicitly mark a field as not editable even if it has an inferred/default write target
  editable?: boolean;
  // New: shorthand to indicate a typical write target table; pk inferred by table name (e.g., schools_ssj_data -> school_id)
  writeTable?: string;
  // Optional: field-level visibility
  visibleIf?: VisibleIf;
};

export type FieldMetadataMap = Record<string, FieldMetadata>;

export type TableColumnMeta = {
  field: string;
  label?: string;
  type?: DetailFieldType;
  array?: boolean;
  multiline?: boolean;
  options?: string[];
  enumName?: string;
  lookup?: FieldLookup;
  // Optional: apply a boolean or equality filter when loading lookup options
  lookupFilter?: { column: string; value: any };
  reference?: FieldReference;
// If present, disables inline editing for this column
  edit?: boolean;
  // New: Controls update/create behavior. Defaults to 'yes' when omitted.
  update?: 'no' | 'yes' | 'newOnly';
  // Optional write target override for view-backed fields
  writeTo?: { schema?: string; table: string; pk?: string; column?: string };
  // Optional: render this string column as a link to a URL/attachment
  // contained in another field on the same row (e.g., show doc_type but link to pdf)
  linkToField?: string;
  [key: string]: unknown;
};

// Simple filter expression DSL used by table toggles
export type FilterExpr =
  | { eq: { column: string; value: any } }
  | { neq: { column: string; value: any } }
  | { or: FilterExpr[] }
  | { and: FilterExpr[] };

export type TableToggleSpec = {
  id: string;
  label: string;
  expr: FilterExpr;
  defaultOn?: boolean;
};

export type DetailCardBlock = {
  kind: 'card';
  title?: string;
  width?: 'half' | 'full';
  fields: string[];
  editable: boolean;
  editSource?: CardEditSource;
  visibleIf?: VisibleIf;
};

export type TableOrderBy = {
  column: string;
  ascending?: boolean;
};

export type DetailTableBlock = {
  kind: 'table';
  title?: string;
  width?: 'half' | 'full';
  // Simplified reference to a shared table preset
  preset?: string;
  // New structure: read/write config colocated with columns meta
  readSource?: {
    schema?: string;
    table: string;
    fkColumn: string;
  };
  // Default write target (omitted for direct tables)
  writeDefaults?: { schema?: string; table: string; pk?: string; pkColumn?: string };
  // Columns can be specified as names or as rich meta
  columns?: string[] | readonly TableColumnMeta[];
  rowActions?: readonly (RowAction | string)[];
  tableActions?: readonly string[];
  tableActionLabels?: readonly string[];
  // Optional on/off filters controlled by header switches
  toggles?: readonly TableToggleSpec[];
  // Always-applied filter expression when fetching rows
  baseFilter?: FilterExpr;
  // Optional limit override (defaults to 200 rows)
  limit?: number;
  // Optional ordering directives applied before limiting
  orderBy?: readonly TableOrderBy[];
  visibleIf?: VisibleIf;
};

export type DetailMapBlock = {
  kind: 'map';
  title?: string;
  width?: 'half' | 'full';
  fields: string[];
  visibleIf?: VisibleIf;
};

export type DetailListLayout = {
  titleField?: string;
  subtitleFields?: readonly string[];
  bodyFields?: readonly string[];
  badgeFields?: readonly string[];
  footerFields?: readonly string[];
  showFieldLabels?: boolean;
};

export type DetailListBlock = Omit<DetailTableBlock, 'kind'> & {
  kind: 'list';
  listLayout?: DetailListLayout;
};

export type DetailBlock = DetailCardBlock | DetailTableBlock | DetailListBlock | DetailMapBlock;

// Visibility DSL for blocks
export type VisibleIfClause = { field: string; eq?: any; in?: any[]; notEmpty?: boolean };
export type VisibleIf = VisibleIfClause | { anyOf: VisibleIfClause[] } | { allOf: VisibleIfClause[] };

export type DetailTabSpec = {
  id: string;
  label: string;
  writeTo?: {
    schema?: string;
    table: string;
    pk?: string;
  };
  writeToExceptions?: LookupException[];
  blocks: DetailBlock[];
};

export type RowActionId =
  | 'inline_edit'
  | 'view_in_modal'
  | 'jump_to_modal'
  | 'toggle_complete'
  | 'toggle_private_public'
  | 'toggle_valid'
  | 'make_primary'
  | 'archive'
  | 'end_stint'
  | 'add_note'
  | 'add_task'
  | 'email';

export type RowAction = {
  id: RowActionId;
  label: string;
};

// Lightweight create action configs used by grid row action menus
export type CreateNoteConfig = {
  createType: 'note';
  table: string;
  schema?: string;
  textField: string;
  fkField: string;
  fkSourceField?: string;
  useEntityId?: boolean;
  defaults?: Record<string, any>;
  createdByField?: string;
  createdAtField?: string;
  privateField?: string;
};

export type CreateTaskConfig = {
  createType: 'task';
  table: string;
  schema?: string;
  textField: string;
  fkField: string;
  fkSourceField?: string;
  useEntityId?: boolean;
  assignedToField: string;
  dueDateField: string;
  assignedByField?: string;
  createdAtField?: string;
  statusField?: string;
  completeValue?: any;
  incompleteValue?: any;
  defaults?: Record<string, any>;
};

