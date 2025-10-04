import type { BlockSpec, CardSpec, ListSpec, MapSpec, TabSpec, TableSpec, BannerSpec, ViewId, ViewSpec } from './types';
import type { FieldMetadataMap } from '../types/detail-types';

export function view(id: ViewId, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, fieldMetadata: FieldMetadataMap, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, banner: BannerSpec, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, fieldMetadata: FieldMetadataMap, banner: BannerSpec, ...tabs: TabSpec[]): ViewSpec;
export function view(id: ViewId, ...args: any[]): ViewSpec {
  let fieldMetadata: FieldMetadataMap | undefined;
  let banner: BannerSpec | undefined;
  let tabs: TabSpec[] = [];

  // Parse arguments - they can be in various orders
  for (const arg of args) {
    if (!arg) continue;

    // Check if it's a tab (has id, label, blocks)
    if (arg.id && arg.label && arg.blocks) {
      tabs.push(arg);
    }
    // Check if it's a banner (has title and fields)
    else if (arg.title && arg.fields && !arg.id && !arg.kind) {
      banner = arg;
    }
    // Otherwise it's field metadata
    else if (typeof arg === 'object' && !arg.id && !arg.label && !arg.kind) {
      fieldMetadata = arg;
    }
  }

  return { id, banner, tabs, fieldMetadata };
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

export function banner(opts: { image?: string; title: string; fields: string[] }): BannerSpec {
  return {
    image: opts.image,
    title: opts.title,
    fields: opts.fields,
  };
}
