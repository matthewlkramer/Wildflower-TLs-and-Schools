import type {
  DetailTableBlock,
  DetailListBlock,
  DetailListLayout,
  TableColumnMeta,
  FieldMetadata
} from '../../../detail-types';

export interface DetailTableListProps {
  block: DetailTableBlock | DetailListBlock;
  entityId: string;
}

export interface ListCardProps {
  row: any;
  index: number;
  layout?: DetailListLayout;
  columns: string[];
  columnMetaMap: Map<string, TableColumnMeta>;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAction?: (actionId: string, row: any, index: number) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export interface TableViewProps {
  rows: any[];
  columns: string[];
  columnMetaMap: Map<string, TableColumnMeta>;
  loading: boolean;
  editingRow: number | null;
  editingValues: any;
  onEditRow: (index: number) => void;
  onSaveRow: (index: number) => void;
  onCancelEdit: () => void;
  onFieldChange: (field: string, value: any) => void;
  onRowAction?: (actionId: string, row: any, index: number) => void;
  rowActions?: any[];
}

export interface ListViewProps {
  rows: any[];
  layout?: DetailListLayout;
  columns: string[];
  columnMetaMap: Map<string, TableColumnMeta>;
  loading: boolean;
  onRowAction?: (actionId: string, row: any, index: number) => void;
  rowActions?: any[];
}