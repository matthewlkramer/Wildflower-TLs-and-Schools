import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, X, Check, Trash2, Plus } from 'lucide-react';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { createTextFilter } from '@/utils/ag-grid-utils';
import { supabase } from '@/integrations/supabase/client';
import { createNote as createNoteFn, updateNote as updateNoteFn, deleteNote as deleteNoteFn } from '@/integrations/supabase/wftls';

export function NotesTab({ schoolId, onSelectNote }: { schoolId: string; onSelectNote: (note: any) => void }) {
  const qc = useQueryClient();
  const { data: notes = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/notes/school", schoolId],
    enabled: !!schoolId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('school_id', schoolId)
        .order('date_created', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  type Row = { id: string; dateCreated?: string; createdBy?: string; content?: string };
  const rows: Row[] = (notes || []).map((n: any) => ({ id: n.id, dateCreated: n.date_created || n.dateCreated || '', createdBy: n.created_by || n.createdBy || '', content: n.headline || n.notes || '' }));

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Row>>({});
  const [creating, setCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateNote = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => updateNoteFn(id, data),
    onSuccess: () => { setEditingRowId(null); setDrafts({}); qc.invalidateQueries({ queryKey: ["supabase/notes/school", schoolId] }); },
  });

  const createNote = useMutation({
    mutationFn: async (data: any) => createNoteFn({ school_id: schoolId, ...data }),
    onSuccess: () => { setCreating(false); setDrafts({}); qc.invalidateQueries({ queryKey: ["supabase/notes/school", schoolId] }); },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => deleteNoteFn(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["supabase/notes/school", schoolId] }),
  });

  const getDraft = (r: Row) => drafts[r.id] || r;

  const cols: ColDef<Row>[] = [
    { headerName: 'Date', field: 'dateCreated', width: 140,
      cellRenderer: (p: ICellRendererParams<Row>) => {
        const row = p.data as Row; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <Input type="date" className="h-7" value={d.dateCreated || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, dateCreated: e.target.value } }))} />
        }
        return d.dateCreated || '-';
      }
    },
    { headerName: 'Created By', field: 'createdBy', width: 180, ...createTextFilter(),
      cellRenderer: (p: ICellRendererParams<Row>) => {
        const row = p.data as Row; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <Input className="h-7" value={d.createdBy || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, createdBy: e.target.value } }))} />
        }
        return d.createdBy || '-';
      }
    },
    { headerName: 'Note', field: 'content', flex: 2, ...createTextFilter(),
      cellRenderer: (p: ICellRendererParams<Row>) => {
        const row = p.data as Row; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <Input className="h-7" value={d.content || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, content: e.target.value } }))} />
        }
        return (
          <button className="text-left w-full truncate hover:text-blue-600 hover:underline" title={d.content || ''} onClick={() => onSelectNote(notes.find(n => n.id === row.id)!)}>
            {d.content || '-'}
          </button>
        );
      }
    },
    { headerName: 'Actions', field: 'id', width: 200, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<Row>) => {
        const row = p.data as Row; const d = getDraft(row);
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => onSelectNote(notes.find(n => n.id === row.id)!)}>View</Button>
            {!isEditing ? (
              <>
                <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => { setEditingRowId(row.id); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); }}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="h-7 px-2 text-red-600" onClick={() => { setPendingDeleteId(row.id); setConfirmOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 px-2 text-green-700" onClick={() => updateNote.mutate({ id: row.id, data: { date_created: d.dateCreated, created_by: d.createdBy, notes: d.content } })}><Check className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => { setEditingRowId(null); setDrafts(prev => { const cp = { ...prev }; delete cp[row.id]; return cp; }); }}><X className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        );
      }
    },
  ];

  return (
    <>
      <div className="border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
          {!creating ? (
            <Button size="sm" onClick={() => { setCreating(true); const id = `new-${Date.now()}`; setDrafts(prev => ({ ...prev, [id]: { id, dateCreated: new Date().toISOString().slice(0,10), createdBy: '', content: '' } })); setEditingRowId(id); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Note
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { const id = editingRowId!; const d = drafts[id]; if (d) createNote.mutate({ date_created: d.dateCreated, created_by: d.createdBy, notes: d.content }); }}>
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setCreating(false); setEditingRowId(null); setDrafts({}); }}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>
        <GridBase
          rowData={rows}
          columnDefs={cols}
          defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
          gridProps={{
            overlayLoadingTemplate: isLoading ? '<span class="ag-overlay-loading-center">Loading.</span>' : undefined,
          }}
        />
      </div>

      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => { if (pendingDeleteId) deleteNote.mutate(pendingDeleteId); }}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        isLoading={false}
      />
    </>
  );
}
