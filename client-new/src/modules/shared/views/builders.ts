import type { BlockSpec, CardSpec, ListSpec, MapSpec, TabSpec, TableSpec, ViewId, ViewSpec } from './types';

export function view(id: ViewId, ...tabs: TabSpec[]): ViewSpec {
  return { id, tabs };
}

export function tab(id: string, label: string, ...blocks: BlockSpec[]): TabSpec {
  return { id, label, blocks };
}

export function card(fields: string[], opts?: { title?: string; width?: 'half' | 'full'; editable?: boolean }): CardSpec {
  return { kind: 'card', fields, title: opts?.title, width: opts?.width, editable: opts?.editable };
}

export function table(
  preset: TableSpec['preset'],
  opts?: { title?: string; width?: 'half' | 'full'; columns?: string[]; toggles?: TableSpec['toggles']; orderBy?: TableSpec['orderBy']; limit?: number },
): TableSpec {
  return {
    kind: 'table',
    preset,
    title: opts?.title,
    width: opts?.width,
    columns: opts?.columns,
    toggles: opts?.toggles,
    orderBy: opts?.orderBy,
    limit: opts?.limit,
  } as TableSpec;
}

export function list(
  preset: ListSpec['preset'],
  opts?: {
    title?: string;
    width?: 'half' | 'full';
    columns?: string[];
    toggles?: ListSpec['toggles'];
    orderBy?: ListSpec['orderBy'];
    limit?: number;
    layout?: ListSpec['layout'];
  },
): ListSpec {
  return {
    kind: 'list',
    preset,
    title: opts?.title,
    width: opts?.width,
    columns: opts?.columns,
    toggles: opts?.toggles,
    orderBy: opts?.orderBy,
    limit: opts?.limit,
    layout: opts?.layout,
  } as ListSpec;
}

export function map(fields: [string, string, string] | string[], opts?: { title?: string; width?: 'half' | 'full' }): MapSpec {
  return { kind: 'map', fields: fields as any, title: opts?.title, width: opts?.width };
}
