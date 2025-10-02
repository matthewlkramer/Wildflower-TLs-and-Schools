export type ViewId = 'schools' | 'educators' | 'charters' | (string & {});

export type CardSpec = { kind: 'card'; title?: string; width?: 'half' | 'full'; fields: string[]; editable?: boolean };
export type TableSpec = {
  kind: 'table';
  module: string;
  preset: string;
  width?: 'half' | 'full';
};
export type ListSpec = {
  kind: 'list';
  module: string;
  preset: string;
  width?: 'half' | 'full';
};
export type MapSpec = { kind: 'map'; title?: string; width?: 'half' | 'full'; fields: [string, string, string] | string[] };

export type BlockSpec = CardSpec | TableSpec | ListSpec | MapSpec;

export type TabSpec = { id: string; label: string; blocks: BlockSpec[] };

export type ViewSpec = { id: ViewId; tabs: TabSpec[] };
