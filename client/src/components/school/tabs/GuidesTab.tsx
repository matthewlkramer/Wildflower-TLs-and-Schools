/**
 * School “Guides” tab. It accepts an array of guide assignment records and
 * renders them in an AG‑Grid table. Each row shows the guide’s short name,
 * assignment type, start/end dates, and whether the assignment is currently
 * active. Every cell is filterable and sortable. Actions in the last column
 * allow inline editing of a single row at a time: clicking “Edit” switches the
 * row into draft mode where dates are edited via `DateInputInline` components
 * and type/active fields are editable through the `drafts` state. “Save” passes
 * the draft to `onUpdate` and clears editing state; “Cancel” reverts the draft;
 * “Delete” invokes `onDelete`. Row height is fixed by `DEFAULT_GRID_PROPS` and
 * grid behavior (auto height, no single‑click edit, etc.) is specified in
 * `gridProps` so a new engineer can recreate the grid exactly.
 */
import React from 'react';
import type { GuideAssignment } from '@shared/schema.generated';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2, Eye, Plus, UserMinus } from 'lucide-react';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { DateInputInline } from '@/components/shared/grid/DateInputInline';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function GuidesTab({ schoolId }: { schoolId: string }) {
  type GuideRow = {
    id: string;
    guideId?: string;
    guideShortName?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  };

  const { data: assignments = [] } = useQuery<GuideAssignment[]>({
    queryKey: [`/api/guide-assignments/school/${schoolId}`],
    queryFn: async () => {
      const res = await fetch(`/api/guide-assignments/school/${schoolId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch guide assignments');
      return res.json();
    },
    enabled: !!schoolId,
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => apiRequest('PUT', `/api/guide-assignments/${id}`, data),
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/guide-assignments/${id}`),
  });

  const rows: GuideRow[] = (assignments || []).map((g) => ({
    id: g.id,
    guideId: g.guideId,
    guideShortName: (g as any).guideShortName || g.guideId,
    type: (g as any).type || '',
    startDate: g.startDate || '',
    endDate: g.endDate || '',
    isActive: !!g.isActive,
  }));

  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, GuideRow>>({});
  const getDraft = (r: GuideRow) => drafts[r.id] || r;
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewRow, setViewRow] = React.useState<GuideAssignment | null>(null);

  const columnDefs: ColDef<GuideRow>[] = [
    { headerName: 'Guide', field: 'guideShortName', flex: 2, filter: 'agTextColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow;
        const name = row.guideShortName || '-';
        if (row.guideId) {
          return <a href={`/teacher/${row.guideId}`} className="text-blue-600 hover:underline">{name}</a> as any;
        }
        return <span>{name}</span> as any;
      }
    },
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
    { headerName: 'Actions', field: 'id', width: 160, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow;
        const isEditing = editingRowId === row.id;
        return (
          <RowActionsSelect
            options={
              isEditing
                ? [
                    {
                      value: 'save',
                      label: 'Save',
                      run: () => {
                        const d = drafts[row.id];
                        if (d) {
                          updateAssignment.mutate({ id: row.id, data: { type: d.type, startDate: d.startDate || '', endDate: d.endDate || '', isActive: !!d.isActive } });
                        }
                        setEditingRowId(null);
                        setDrafts((prev) => { const cp = { ...prev } as any; delete (cp as any)[row.id]; return cp; });
                      },
                    },
                    {
                      value: 'cancel',
                      label: 'Cancel',
                      run: () => {
                        setEditingRowId(null);
                        setDrafts((prev) => { const cp = { ...prev } as any; delete (cp as any)[row.id]; return cp; });
                      },
                    },
                  ]
                : [
                    {
                      value: 'view',
                      label: 'View',
                      run: () => {
                        const full = (assignments || []).find((a) => a.id === row.id) || null;
                        setViewRow(full);
                      },
                    },
                    {
                      value: 'edit',
                      label: 'Edit',
                      run: () => {
                        setDrafts((prev) => ({ ...prev, [row.id]: { ...row } }));
                        setEditingRowId(row.id);
                      },
                    },
                    {
                      value: 'end',
                      label: 'End stint',
                      run: () => {
                        const today = new Date().toISOString().slice(0, 10);
                        updateAssignment.mutate({ id: row.id, data: { endDate: today, isActive: false } });
                      },
                    },
                    {
                      value: 'delete',
                      label: 'Delete',
                      run: () => {
                        setPendingDeleteId(row.id);
                        setConfirmOpen(true);
                      },
                    },
                  ]
            }
          />
        );
      }
    },
  ];

  return (
    <>
      <div className="border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Guide Assignments</h3>
          <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Guide Assignment</Button>
        </div>
        <GridBase
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
          gridProps={{
            singleClickEdit: false,
            stopEditingWhenCellsLoseFocus: false,
            getRowHeight: () => (DEFAULT_GRID_PROPS.rowHeight as number),
          }}
        />
      </div>

      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => { if (pendingDeleteId) deleteAssignment.mutate(pendingDeleteId); }}
        title="Delete Guide Assignment"
        description="Are you sure you want to delete this guide assignment? This action cannot be undone."
        isLoading={false}
      />

      {createOpen && (
        <CreateGuideAssignmentModal open={createOpen} onOpenChange={setCreateOpen} schoolId={schoolId} onCreated={() => { /* could refetch via query key invalidation */ }} />
      )}

      {viewRow && (
        <ViewGuideAssignmentModal open={!!viewRow} onOpenChange={() => setViewRow(null)} assignment={viewRow} />
      )}
    </>
  );
}

function CreateGuideAssignmentModal({ open, onOpenChange, schoolId, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; schoolId: string; onCreated: () => void }) {
  const [guideId, setGuideId] = React.useState('');
  const [guideShortName, setGuideShortName] = React.useState('');
  const [type, setType] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const create = useMutation({
    mutationFn: async () => apiRequest('POST', '/api/guide-assignments', { schoolId, guideId, guideShortName, type, startDate, isActive: true }),
    onSuccess: () => { onOpenChange(false); onCreated(); }
  });
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h3 className="text-sm font-semibold mb-3">Add Guide Assignment</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600">Guide ID</label>
            <input className="w-full border rounded h-8 px-2" value={guideId} onChange={e=>setGuideId(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-600">Guide Short Name</label>
            <input className="w-full border rounded h-8 px-2" value={guideShortName} onChange={e=>setGuideShortName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Type</label>
              <input className="w-full border rounded h-8 px-2" value={type} onChange={e=>setType(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-600">Start Date</label>
              <input type="date" className="w-full border rounded h-8 px-2" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={()=>create.mutate()}>Create</Button>
        </div>
      </div>
    </div>
  );
}

function ViewGuideAssignmentModal({ open, onOpenChange, assignment }: { open: boolean; onOpenChange: (o: boolean) => void; assignment: GuideAssignment }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg">
        <h3 className="text-sm font-semibold mb-3">Guide Assignment Details</h3>
        <pre className="text-xs bg-slate-50 p-2 rounded max-h-[60vh] overflow-auto">{JSON.stringify(assignment, null, 2)}</pre>
        <div className="flex justify-end mt-3">
          <Button size="sm" variant="outline" onClick={()=>onOpenChange(false)}>Close</Button>
        </div>
      </div>
    </div>
  );
}

