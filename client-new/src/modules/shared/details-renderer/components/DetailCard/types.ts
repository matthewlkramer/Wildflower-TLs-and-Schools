import type {
  DetailCardBlock,
  DetailTabSpec,
  FieldMetadataMap,
  FieldMetadata,
  WriteTarget
} from '../../../detail-types';

export interface DetailCardProps {
  block: DetailCardBlock;
  tab: DetailTabSpec;
  entityId: string;
  details: any;
  fieldMeta?: FieldMetadataMap;
  defaultWriteTo?: WriteTarget;
  defaultWriteOrder?: string[];
}

export interface CardFieldProps {
  field: string;
  value: any;
  meta?: FieldMetadata;
  editing: boolean;
  onChange?: (value: any) => void;
  selectOptions?: Array<{ value: string; label: string }>;
  displayOverride?: any;
}