import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ActionStep } from '@shared/schema';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ToDoTab({ schoolId }: { schoolId: string }) {
  const { data: steps = [], isLoading } = useQuery<ActionStep[]>({
    queryKey: [`/api/action-steps/school/${schoolId}`],
    queryFn: async () => {
      const res = await fetch(`/api/action-steps/school/${schoolId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch action steps');
      return res.json();
    },
    enabled: !!schoolId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  type Row = {
    id: string;
    description?: string;
    assignee?: string;
    status?: string;
    complete?: boolean;
    dueDate?: string;
  };

  const rows: Row[] = (steps || [])
    .slice()
    .sort((a, b) => (a.complete === b.complete ? 0 : a.complete ? 1 : -1))
    .map((s) => ({
      id: s.id,
      description: s.description || '-',
      assignee: s.assignee || '-',
      status: s.status || (s.complete ? 'Complete' : 'Pending'),
      complete: !!s.complete,
      dueDate: s.dueDate || '',
    }));

  const [viewRow, setViewRow] = React.useState<Row | null>(null);
  const [editRow, setEditRow] = React.useState<Row | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const cols: ColDef<Row>[] = [
    { headerName: 'Item', field: 'description', flex: 2, filter: 'agTextColumnFilter' },
    { headerName: 'Assignee', field: 'assignee', width: 160, filter: 'agTextColumnFilter' },
    { headerName: 'Status', field: 'status', width: 120, filter: 'agTextColumnFilter',
      cellRenderer: (p: ICellRendererParams<Row>) => (
        <span className={p.value === 'Complete' ? 'text-green-700' : 'text-slate-700'}>{p.value || '-'}</span>
      )
    },
    { headerName: 'Due', field: 'dueDate', width: 140, filter: 'agTextColumnFilter' },
    { headerName: 'Actions', field: 'id', width: 240, sortable: false, filter: false, cellRenderer: (p: ICellRendererParams<Row>) => {
      const r = p.data as Row;
      const toggle = async () => {
        const next = (r.status === 'Complete') ? 'Pending' : 'Complete';
        await fetch(`/api/action-steps/${r.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
        p.api?.refreshInfiniteCache?.();
        p.api?.redrawRows?.();
      };
      const del = async () => {
        if (!confirm('Delete this action step?')) return;
        await fetch(`/api/action-steps/${r.id}`, { method: 'DELETE', credentials: 'include' });
        p.api?.refreshInfiniteCache?.();
        p.api?.redrawRows?.();
      };
      return (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-7 px-2" onClick={()=>setViewRow(r)}>View</Button>
          <Button size="sm" variant="outline" className="h-7 px-2" onClick={()=>setEditRow(r)}>Edit</Button>
          <Button size="sm" variant="outline" className="h-7 px-2" onClick={toggle}>{r.status === 'Complete' ? 'Mark Incomplete' : 'Mark Complete'}</Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-red-600" onClick={del}>Delete</Button>
        </div>
      );
    }},
  ];

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-900">ToDo</h3>
        <Button size="sm" onClick={()=>setCreateOpen(true)}>Create ToDo</Button>
      </div>
      <GridBase
        rowData={rows}
        columnDefs={cols}
        defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
        gridProps={{
          ...DEFAULT_GRID_PROPS,
          domLayout: 'autoHeight',
          overlayLoadingTemplate: isLoading ? '<span class="ag-overlay-loading-center">Loading.</span>' : undefined,
        }}
      />

      {/* View Modal */}
      {viewRow && (
        <Dialog open={!!viewRow} onOpenChange={()=>setViewRow(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Action Step</DialogTitle></DialogHeader>
            <pre className="text-xs bg-slate-50 p-2 rounded max-h-[60vh] overflow-auto">{JSON.stringify(viewRow, null, 2)}</pre>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {editRow && (
        <EditActionStepModal row={editRow} onClose={()=>setEditRow(null)} />
      )}

      {/* Create Modal */}
      {createOpen && (
        <CreateActionStepModal schoolId={schoolId} onClose={()=>setCreateOpen(false)} />
      )}
    </div>
  );
}

function CreateActionStepModal({ schoolId, onClose }: { schoolId: string; onClose: ()=>void }) {
  const [item, setItem] = React.useState('');
  const [assignee, setAssignee] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [status, setStatus] = React.useState('Pending');
  const save = async () => {
    await fetch('/api/action-steps', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schoolId, item, assignee, dueDate, status }) });
    onClose();
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Create ToDo</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Item" value={item} onChange={e=>setItem(e.target.value)} />
          <Input placeholder="Assignee" value={assignee} onChange={e=>setAssignee(e.target.value)} />
          <Input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <Input placeholder="Status" value={status} onChange={e=>setStatus(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditActionStepModal({ row, onClose }: { row: any; onClose: ()=>void }) {
  const [item, setItem] = React.useState(row.description || '');
  const [assignee, setAssignee] = React.useState(row.assignee || '');
  const [dueDate, setDueDate] = React.useState(row.dueDate || '');
  const [status, setStatus] = React.useState(row.status || '');
  const save = async () => {
    await fetch(`/api/action-steps/${row.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item, assignee, dueDate, status }) });
    onClose();
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit ToDo</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Item" value={item} onChange={e=>setItem(e.target.value)} />
          <Input placeholder="Assignee" value={assignee} onChange={e=>setAssignee(e.target.value)} />
          <Input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <Input placeholder="Status" value={status} onChange={e=>setStatus(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
