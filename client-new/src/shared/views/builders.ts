import type { BlockSpec, CardSpec, ListSpec, MapSpec, TabSpec, TableSpec, ViewId, ViewSpec } from './types';
import type { FieldMetadataMap } from '../types/detail-types';

export function view(id: ViewId, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, fieldMetadata: FieldMetadataMap, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, ...args: any[]): ViewSpec {
  // Check if first arg is field metadata
  const firstArg = args[0];
  const isFieldMetadata = firstArg && typeof firstArg === 'object' && !firstArg.id && !firstArg.label && !firstArg.kind;

  if (isFieldMetadata) {
    const [fieldMetadata, ...tabs] = args;
    return { id, tabs, fieldMetadata };
  }

  return { id, tabs: args };
}

export function tab(id: string, label: string, ...blocks: BlockSpec[]): TabSpec {
  return { id, label, blocks };
}

export function card(fields: string[], opts?: { title?: string; width?: 'half' | 'full'; editable?: boolean }): CardSpec {
  return { kind: 'card', fields, title: opts?.title, width: opts?.width, editable: opts?.editable };
}

export function table(
  module: string,
  preset: string,
  width?: 'half'
): TableSpec {
  return {
    kind: 'table',
    preset,
    module,
    width: width || 'full',
  } as TableSpec;
}

export function list(
  module: string,
  preset: string,
  width?: 'half'
): ListSpec {
  return {
    kind: 'list',
    preset,
    module,
    width: width || 'full',
  } as ListSpec;
}

export function map(fields: [string, string, string] | string[], opts?: { title?: string; width?: 'half' | 'full' }): MapSpec {
  return { kind: 'map', fields: fields as any, title: opts?.title, width: opts?.width };
}
