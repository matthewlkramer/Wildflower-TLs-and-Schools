import React from 'react';
import type { Location } from '@shared/schema';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2 } from 'lucide-react';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { Input } from '@/components/ui/input';
import { YesNoSelectInline } from '@/components/shared/grid/YesNoSelectInline';
import { DateInputInline } from '@/components/shared/grid/DateInputInline';

export function LocationsTab({
  locations,
  onUpdate,
  onDelete,
}: {
  locations: Location[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}) {
  type LocRow = {
    id: string;
    address?: string;
    currentPhysicalAddress?: boolean;
    currentMailingAddress?: boolean;
    startDate?: string;
    endDate?: string;
  };
  const rows: LocRow[] = (locations || []).map((l) => ({
    id: l.id,
    address: l.address || '',
    currentPhysicalAddress: !!l.currentPhysicalAddress,
    currentMailingAddress: !!l.currentMailingAddress,
    startDate: l.startDate || '',
    endDate: l.endDate || '',
  }));

  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, LocRow>>({});
  const getDraft = (r: LocRow) => drafts[r.id] || r;

  const columnDefs: ColDef<LocRow>[] = [
    { headerName: 'Address', field: 'address', flex: 2, filter: 'agTextColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return (
            <Input className="h-7" value={d.address || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, address: e.target.value } }))} />
          );
        }
        return d.address || '-';
      }
    },
    { headerName: 'Current Physical', field: 'currentPhysicalAddress', width: 150, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.currentPhysicalAddress ? 'Yes' : 'No'),
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <YesNoSelectInline value={!!d.currentPhysicalAddress} onChange={(next) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, currentPhysicalAddress: next } }))} />
        }
        return (
          <span className={d.currentPhysicalAddress ? 'text-green-700' : 'text-slate-600'}>{d.currentPhysicalAddress ? 'Yes' : 'No'}</span>
        );
      }
    },
    { headerName: 'Current Mailing', field: 'currentMailingAddress', width: 150, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.currentMailingAddress ? 'Yes' : 'No'),
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <YesNoSelectInline value={!!d.currentMailingAddress} onChange={(next) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, currentMailingAddress: next } }))} />
        }
        return (
          <span className={d.currentMailingAddress ? 'text-green-700' : 'text-slate-600'}>{d.currentMailingAddress ? 'Yes' : 'No'}</span>
        );
      }
    },
    { headerName: 'Start Date', field: 'startDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.startDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, startDate: v } }))} />
        }
        return d.startDate || '-';
      }
    },
    { headerName: 'End Date', field: 'endDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.endDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, endDate: v } }))} />
        }
        return d.endDate || '-';
      }
    },
    { headerName: 'Actions', field: 'id', width: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow;
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            {!isEditing ? (
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); setEditingRowId(row.id); }}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-700" title="Save" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const d = drafts[row.id]; if (d) { onUpdate(row.id, { address: d.address, currentPhysicalAddress: !!d.currentPhysicalAddress, currentMailingAddress: !!d.currentMailingAddress, startDate: d.startDate || '', endDate: d.endDate || '' }); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); } }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Cancel" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" title="Delete" onClick={() => onDelete(row.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      }
    },
  ];

  return (
    <div className="border rounded-lg p-3">
      <GridBase
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
        gridProps={{
          domLayout: 'autoHeight',
          singleClickEdit: false,
          stopEditingWhenCellsLoseFocus: false,
          getRowHeight: (p: any) => (editingRowId && p.data && p.data.id === editingRowId ? 80 : (DEFAULT_GRID_PROPS.rowHeight as number)),
        }}
      />
    </div>
  );
}

