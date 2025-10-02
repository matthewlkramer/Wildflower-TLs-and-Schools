import type { DetailTabSpec, DetailCardBlock, DetailTableBlock, DetailListBlock, DetailMapBlock, DetailListLayout, TableToggleSpec, TableOrderBy } from '../detail-types';
import { TABLE_LIST_PRESETS } from '../config/table-list-presets';

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

// Helper function to generate list layout from preset column listLayout values
function generateListLayoutFromPreset(preset: any): DetailListLayout | undefined {
  if (!preset?.columns) return undefined;

  const layout: DetailListLayout = {
    titleField: undefined,
    subtitleFields: [],
    bodyFields: [],
    badgeFields: [],
    footerFields: [],
  };

  for (const column of preset.columns) {
    if (typeof column === 'object' && column.listLayout) {
      switch (column.listLayout) {
        case 'title':
          layout.titleField = column.field;
          break;
        case 'subtitle':
          if (layout.subtitleFields) layout.subtitleFields.push(column.field);
          break;
        case 'body':
          if (layout.bodyFields) layout.bodyFields.push(column.field);
          break;
        case 'badge':
          if (layout.badgeFields) layout.badgeFields.push(column.field);
          break;
        case 'footer':
          if (layout.footerFields) layout.footerFields.push(column.field);
          break;
      }
    }
  }

  return layout;
}

// Adapter: convert a ViewSpec into legacy DetailTabSpec[] for the DetailsRenderer
export function asTabs(view: ViewSpec): DetailTabSpec[] {
  return view.tabs.map((t): DetailTabSpec => ({
    id: t.id,
    label: t.label,
    blocks: t.blocks.map((b) => {
      if (b.kind === 'card') {
        const c = b as CardSpec;
        return { kind: 'card', title: c.title, width: c.width, fields: c.fields, editable: !!c.editable } as DetailCardBlock;
      }
      if (b.kind === 'table') {
        const tb = b as TableSpec;
        const preset = TABLE_LIST_PRESETS[tb.preset as keyof typeof TABLE_LIST_PRESETS];
        const out: DetailTableBlock = {
          kind: 'table',
          title: preset?.title,
          width: tb.width,
          preset: tb.preset,
          module: tb.module
        } as any;
        // orderBy and limit are now handled by the preset, not individual specs
        return out;
      }
      if (b.kind === 'list') {
        const lb = b as ListSpec;
        const preset = TABLE_LIST_PRESETS[lb.preset as keyof typeof TABLE_LIST_PRESETS];
        const out: DetailListBlock = {
          kind: 'list',
          title: preset?.title,
          width: lb.width,
          preset: lb.preset,
          module: lb.module,
          listLayout: generateListLayoutFromPreset(preset)
        } as any;
        return out;
      }
      const m = b as MapSpec;
      return { kind: 'map', title: m.title, width: m.width, fields: m.fields as string[] } as DetailMapBlock;
    }),
  }));
}
