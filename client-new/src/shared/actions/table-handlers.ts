import type { TableColumnMeta } from '../types/detail-types';
import { formatFieldLabel } from '../utils/ui-utils';

type Ctx = {
  actionId: string;
  effective: any;
  columnMetaMap: Map<string, TableColumnMeta>;
  ensureOptionsForMeta: (meta?: TableColumnMeta) => Promise<void> | void;
  setShowAddEmail: (v: boolean) => void;
  setCreateValues: (vals: Record<string, any>) => void;
  setCreateError: (msg: string) => void;
  setCreateTitle: (title: string) => void;
  setShowCreate: (v: boolean) => void;
};

export async function handleTableAction(ctx: Ctx): Promise<boolean> {
  const { actionId, effective, columnMetaMap, ensureOptionsForMeta, setShowAddEmail, setCreateValues, setCreateError, setCreateTitle, setShowCreate } = ctx;

  const rs: any = (effective as any).readSource ?? (effective as any).source;
  const table = rs?.table as string | undefined;
  if (!table) return false;

  if (actionId === 'addEmail' && table === 'email_addresses') {
    setShowAddEmail(true);
    return true;
  }

  if (actionId.startsWith('add')) {
    const init: Record<string, any> = {};
    for (const c of (((effective as any).columns) ?? [])) {
      const col = typeof c === 'string' ? c : (c as any).field;
      const meta = columnMetaMap.get(col);
      // Defaults
      if (col === 'item_status') init[col] = 'Incomplete';
      else if (col === 'assigned_date') init[col] = new Date().toISOString().slice(0,10);
      else if (col === 'created_date') init[col] = new Date().toISOString().slice(0,10);
      else init[col] = (meta as any)?.array ? [] : undefined;
      await ensureOptionsForMeta(meta as any);
    }
    setCreateValues(init);
    setCreateError('');
    setCreateTitle(formatFieldLabel(actionId));
    setShowCreate(true);
    return true;
  }

  return false;
}

