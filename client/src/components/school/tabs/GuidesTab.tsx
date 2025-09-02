/**
 * Guides tab manages assignments of Wildflower guides to the school. Rows in
 * an AG Grid list guide name, type, dates, and active status with inline
 * editing and deletion actions.
 */
import React from 'react';
import type { GuideAssignment } from '@shared/schema';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2 } from 'lucide-react';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { DateInputInline } from '@/components/shared/grid/DateInputInline';
import { Badge } from '@/components/ui/badge';

export function GuidesTab({
  assignments,
  onUpdate,
  onDelete,
}: {
  assignments: GuideAssignment[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}) {
  type GuideRow = {
    id: string;
    guideShortName?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  };

  const rows: GuideRow[] = (assignments || []).map((g) => ({
    id: g.id,
    guideShortName: (g as any).guideShortName || g.guideId,
    type: (g as any).type || '',
    startDate: g.startDate || '',
    endDate: g.endDate || '',
    isActive: !!g.isActive,
  }));

  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, GuideRow>>({});
  const getDraft = (r: GuideRow) => drafts[r.id] || r;

  const columnDefs: ColDef<GuideRow>[] = [
    { headerName: 'Guide', field: 'guideShortName', flex: 2, filter: 'agTextColumnFilter' },
    { headerName: 'Type', field: 'type', width: 160, filter: 'agTextColumnFilter' },
    { headerName: 'Start Date', field: 'startDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.startDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, startDate: v } }))} />
        }
        return d.startDate || '-';
      }
    },
    { headerName: 'End Date', field: 'endDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.endDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, endDate: v } }))} />
        }
        return d.endDate || '-';
      }
    },
    { headerName: 'Active', field: 'isActive', width: 120, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.isActive ? 'Active' : 'Inactive'),
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const d = p.data as GuideRow;
        return <Badge className={d.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{d.isActive ? 'Active' : 'Inactive'}</Badge>;
      }
    },
    { headerName: 'Actions', field: 'id', width: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow;
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            {!isEditing ? (
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); setEditingRowId(row.id); }}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-700" title="Save" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const d = drafts[row.id]; if (d) { onUpdate(row.id, { type: d.type, startDate: d.startDate || '', endDate: d.endDate || '', isActive: !!d.isActive }); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); } }}>
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
          getRowHeight: () => (DEFAULT_GRID_PROPS.rowHeight as number),
        }}
      />
    </div>
  );
}

