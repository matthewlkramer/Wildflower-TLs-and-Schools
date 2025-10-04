import type { FieldMetadataMap } from '../types/detail-types';

export type ViewId = 'schools' | 'educators' | 'charters' | (string & {});

export type BannerSpec = {
  image?: string; // Field name for image
  title: string;  // Field name for title
  fields: string[]; // Additional fields to display as stats
};

export type CardSpec = { kind: 'card'; title?: string; width?: 'half' | 'full'; fields: string[]; editable?: boolean };
export type TableSpec = {
  kind: 'table';
  module: string;
  preset: string;
  width?: 'half' | 'full';
  activeFilter?: boolean; // If true, only show records where is_active = true (default: false)
};
export type ListSpec = {
  kind: 'list';
  module: string;
  preset: string;
  width?: 'half' | 'full';
  activeFilter?: boolean; // If true, only show records where is_active = true (default: false)
};
export type MapSpec = { kind: 'map'; title?: string; width?: 'half' | 'full'; fields: [string, string, string] | string[] };

export type BlockSpec = CardSpec | TableSpec | ListSpec | MapSpec;

export type TabSpec = { id: string; label: string; blocks: BlockSpec[] };

export type ViewSpec = {
  id: ViewId;
  banner?: BannerSpec;
  tabs: TabSpec[];
  fieldMetadata?: FieldMetadataMap; // Optional manual field metadata overrides
};
