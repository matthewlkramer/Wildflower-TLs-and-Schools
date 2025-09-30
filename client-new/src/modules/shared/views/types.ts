import type { DetailTabSpec, DetailCardBlock, DetailTableBlock, DetailMapBlock, TableToggleSpec } from '../detail-types';
import type { TablePresetId } from '../table-presets';

export type ViewId = 'schools' | 'educators' | 'charters' | (string & {});

export type CardSpec = { kind: 'card'; title?: string; width?: 'half' | 'full'; fields: string[]; editable?: boolean };
export type TableSpec = { kind: 'table'; title?: string; width?: 'half' | 'full'; preset: TablePresetId; columns?: string[]; toggles?: readonly TableToggleSpec[] };
export type MapSpec = { kind: 'map'; title?: string; width?: 'half' | 'full'; fields: [string, string, string] | string[] };

export type BlockSpec = CardSpec | TableSpec | MapSpec;

export type TabSpec = { id: string; label: string; blocks: BlockSpec[] };

export type ViewSpec = { id: ViewId; tabs: TabSpec[] };

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
        const out: DetailTableBlock = { kind: 'table', title: tb.title, width: tb.width, preset: tb.preset } as any;
        if (tb.toggles) (out as any).toggles = tb.toggles;
        if (tb.columns) (out as any).columns = tb.columns;
        return out;
      }
      const m = b as MapSpec;
      return { kind: 'map', title: m.title, width: m.width, fields: m.fields as string[] } as DetailMapBlock;
    }),
  }));
}

