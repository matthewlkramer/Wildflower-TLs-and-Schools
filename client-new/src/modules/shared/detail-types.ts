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

export type FieldMetadata = {
  label: string;
  type?: DetailFieldType;
  array?: boolean;
  multiline?: boolean;
  options?: string[];
  edit?: FieldEditConfig;
  reference?: FieldReference;
};

export type FieldMetadataMap = Record<string, FieldMetadata>;

export type TableColumnMeta = {
  field: string;
  label?: string;
  type?: DetailFieldType;
  array?: boolean;
  multiline?: boolean;
  reference?: FieldReference;
};

export type DetailCardBlock = {
  kind: 'card';
  title?: string;
  width?: 'half' | 'full';
  fields: string[];
  editable: boolean;
  editSource?: CardEditSource;
};

export type DetailTableBlock = {
  kind: 'table';
  title?: string;
  width?: 'half' | 'full';
  source: {
    schema?: string;
    table: string;
    fkColumn: string;
  };
  columns: string[];
  columnMeta?: readonly TableColumnMeta[];
  rowActions?: string[];
  tableActions?: string[];
};

export type DetailMapBlock = {
  kind: 'map';
  title?: string;
  width?: 'half' | 'full';
  fields: string[];
};

export type DetailBlock = DetailCardBlock | DetailTableBlock | DetailMapBlock;

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
