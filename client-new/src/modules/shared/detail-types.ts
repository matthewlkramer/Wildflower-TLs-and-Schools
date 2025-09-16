export type ColumnVisibility = 'show' | 'hide' | 'suppress';
export type GridValueKind = 'string' | 'boolean' | 'multi' | 'select' | 'date' | 'number';

export type GridColumnConfig = {
  field: string;
  headerName: string;
  visibility: ColumnVisibility;
  order?: number;
  valueType?: GridValueKind;
  selectOptions?: string[];
  lookupField?: string;
  enumName?: string;
  sortKey?: boolean;
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

export type DetailCardBlock = {
  kind: 'card';
  title: string;
  fields: string[];
  editable: boolean;
  editSource?: CardEditSource;
};

export type DetailTableBlock = {
  kind: 'table';
  title: string;
  source: {
    schema?: string;
    table: string;
    fkColumn: string;
  };
  columns: string[];
  rowActions?: string[];
  tableActions?: string[];
};

export type DetailMapBlock = {
  kind: 'map';
  title: string;
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
