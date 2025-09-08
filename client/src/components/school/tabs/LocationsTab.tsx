/**
 * School “Locations” tab. Receives an array of location records and displays
 * them in an AG‑Grid table. Each row represents a physical or mailing address
 * with flags for whether it is currently active as the physical or mailing
 * address. The grid allows full inline editing: clicking the edit action turns
 * the row into an editable form where address text, yes/no flags, and start/end
 * dates can be changed. Saves call `onUpdate` with the row id and updated
 * fields; deletes call `onDelete`. Filters and sorting are enabled for every
 * column so history can be searched, and row height/behavior mirrors
 * `DEFAULT_GRID_PROPS` to match other grids.
 */
import React from 'react';
import type { Location } from '@shared/schema';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2, Eye, Plus, CalendarX2 } from 'lucide-react';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { Input } from '@/components/ui/input';
import { YesNoSelectInline } from '@/components/shared/grid/YesNoSelectInline';
import { DateInputInline } from '@/components/shared/grid/DateInputInline';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { createTextFilter } from '@/utils/ag-grid-utils';

export function LocationsTab({ schoolId }: { schoolId: string }) {
  type LocRow = {
    id: string;
    address?: string;
    currentPhysicalAddress?: boolean;
    currentMailingAddress?: boolean;
    startDate?: string;
    endDate?: string;
  };
  const { data: locations = [], refetch } = useQuery<Location[]>({
    queryKey: [`/api/locations/school/${schoolId}`],
    queryFn: async () => {
      const res = await fetch(`/api/locations/school/${schoolId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch locations');
      return res.json();
    },
    enabled: !!schoolId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateLocation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => apiRequest('PUT', `/api/locations/${id}`, data),
    onSuccess: () => refetch(),
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/locations/${id}`),
    onSuccess: () => refetch(),
  });

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
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewRow, setViewRow] = React.useState<Location | null>(null);

  const columnDefs: ColDef<LocRow>[] = [
    { headerName: 'Address', field: 'address', flex: 2, ...createTextFilter(),
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
    { headerName: 'Actions', field: 'id', width: 200, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow;
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="View" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const full = (locations || []).find(l => l.id === row.id) || null; setViewRow(full); }}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {!isEditing ? (
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); setEditingRowId(row.id); }}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-700" title="Save" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const d = drafts[row.id]; if (d) { updateLocation.mutate({ id: row.id, data: { address: d.address, currentPhysicalAddress: !!d.currentPhysicalAddress, currentMailingAddress: !!d.currentMailingAddress, startDate: d.startDate || '', endDate: d.endDate || '' } }); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); } }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Cancel" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="End time at this location" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const today = new Date().toISOString().slice(0,10); updateLocation.mutate({ id: row.id, data: { endDate: today } }); }}>
              <CalendarX2 className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" title="Delete" onClick={() => { setPendingDeleteId(row.id); setConfirmOpen(true); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <div className="border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-900">Locations</h3>
          <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Location</Button>
        </div>
        <GridBase
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
          gridProps={{
            singleClickEdit: false,
            stopEditingWhenCellsLoseFocus: false,
            getRowHeight: (p: any) => (editingRowId && p.data && p.data.id === editingRowId ? 80 : (DEFAULT_GRID_PROPS.rowHeight as number)),
          }}
        />
      </div>

      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => { if (pendingDeleteId) deleteLocation.mutate(pendingDeleteId); }}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        isLoading={false}
      />

      {/* Create Location Modal */}
      {createOpen && (
        <CreateLocationModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          schoolId={schoolId}
          onCreated={() => refetch()}
        />
      )}

      {/* View modal */}
      {viewRow && (
        <ViewLocationModal open={!!viewRow} onOpenChange={() => setViewRow(null)} location={viewRow} />
      )}
    </>
  );
}

function CreateLocationModal({ open, onOpenChange, schoolId, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; schoolId: string; onCreated: () => void }) {
  const [address, setAddress] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [currentPhysical, setCurrentPhysical] = React.useState(false);
  const [currentMailing, setCurrentMailing] = React.useState(false);
  const createLoc = useMutation({
    mutationFn: async () => apiRequest('POST', '/api/locations', { schoolId, address, startDate, currentPhysicalAddress: currentPhysical, currentMailingAddress: currentMailing }),
    onSuccess: () => { onOpenChange(false); onCreated(); }
  });
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h3 className="text-sm font-semibold mb-3">Add Location</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600">Address</label>
            <input className="w-full border rounded h-8 px-2" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Start Date</label>
              <input type="date" className="w-full border rounded h-8 px-2" value={startDate} onChange={e=>setStartDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input id="phys" type="checkbox" checked={currentPhysical} onChange={e=>setCurrentPhysical(e.target.checked)} />
              <label htmlFor="phys" className="text-xs">Current Physical</label>
              <input id="mail" type="checkbox" checked={currentMailing} onChange={e=>setCurrentMailing(e.target.checked)} className="ml-3" />
              <label htmlFor="mail" className="text-xs">Current Mailing</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={()=>createLoc.mutate()}>Create</Button>
        </div>
      </div>
    </div>
  );
}

function ViewLocationModal({ open, onOpenChange, location }: { open: boolean; onOpenChange: (o: boolean) => void; location: Location }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg">
        <h3 className="text-sm font-semibold mb-3">Location Details</h3>
        <pre className="text-xs bg-slate-50 p-2 rounded max-h-[60vh] overflow-auto">{JSON.stringify(location, null, 2)}</pre>
        <div className="flex justify-end mt-3">
          <Button size="sm" variant="outline" onClick={()=>onOpenChange(false)}>Close</Button>
        </div>
      </div>
    </div>
  );
}

