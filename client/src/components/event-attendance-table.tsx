import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
import type { EventAttendance } from "@shared/schema";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Eye, Edit3, Check, X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EventAttendanceTableProps {
  educatorId: string;
}

export function EventAttendanceTable({ educatorId }: EventAttendanceTableProps) {
  const { data, isLoading } = useQuery<EventAttendance[]>({
    queryKey: ["/api/event-attendance/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/event-attendance/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch event attendance");
      return response.json();
    },
  });

  // Local state for actions
  const [rows, setRows] = useState<EventAttendance[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<EventAttendance | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventResults, setEventResults] = useState<Array<{ id: string; name: string; date?: string }>>([]);
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; name: string; date?: string } | null>(null);
  const [newRegistered, setNewRegistered] = useState<boolean>(false);
  const [newAttended, setNewAttended] = useState<boolean>(false);
  const [newRegistrationDate, setNewRegistrationDate] = useState<string>("");

  const updateAttendance = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventAttendance> }) => {
      await apiRequest('PUT', `/api/event-attendance/${id}`, data);
    },
    onSuccess: () => {
      // No invalidation; keep local edits
    }
  });

  const deleteAttendance = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/event-attendance/${id}`);
    },
    onSuccess: (_data, id) => {
      setRows(prev => prev.filter(r => r.id !== id));
    }
  });

  const createAttendance = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) throw new Error('Select an event');
      const body = {
        educatorId,
        eventName: selectedEvent.name,
        eventDate: selectedEvent.date,
        registered: newRegistered,
        attended: newAttended,
        registrationDate: newRegistrationDate || undefined,
      };
      const res = await apiRequest('POST', '/api/event-attendance', body);
      return res.json();
    },
    onSuccess: (created: EventAttendance) => {
      setRows(prev => [created, ...prev]);
      setAddOpen(false);
      // reset form
      setSearchTerm("");
      setEventResults([]);
      setSelectedEvent(null);
      setNewRegistered(false);
      setNewAttended(false);
      setNewRegistrationDate("");
    }
  });

  // Simple typeahead for events
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const q = searchTerm.trim();
      if (!q) { setEventResults([]); return; }
      const res = await fetch(`/api/events?search=${encodeURIComponent(q)}`, { credentials: 'include', signal: controller.signal });
      if (!res.ok) return;
      const json = await res.json();
      setEventResults(json);
    };
    run().catch(()=>{});
    return () => controller.abort();
  }, [searchTerm]);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const onToggle = (id: string, key: keyof Pick<EventAttendance, 'attended' | 'registered'>) => {
    setRows(prev => prev.map(r => r.id === id ? ({ ...r, [key]: !r[key] }) : r));
  };

  const onChangeDate = (id: string, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? ({ ...r, registrationDate: value }) : r));
  };

  const columnDefs: ColDef<EventAttendance>[] = [
    {
      headerName: "Name",
      field: "eventName",
      flex: 3,
      ...createTextFilter(),
    },
    {
      headerName: "Date",
      field: "eventDate",
      flex: 2,
      ...createTextFilter(),
    },
    {
      headerName: "Attended",
      field: "attended",
      flex: 1,
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        const attended = !!params.data?.attended;
        const isEditing = editingId === params.data?.id;
        return (
          <div className="flex justify-center">
            <input 
              type="checkbox" 
              checked={attended} 
              readOnly={!isEditing}
              onChange={() => isEditing && onToggle(params.data.id, 'attended')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        );
      },
    },
    {
      headerName: "Registered",
      field: "registered",
      flex: 1,
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        const registered = !!params.data?.registered;
        const isEditing = editingId === params.data?.id;
        return (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={registered}
              readOnly={!isEditing}
              onChange={() => isEditing && onToggle(params.data.id, 'registered')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        );
      },
    },
    {
      headerName: "Registration Date",
      field: "registrationDate",
      flex: 2,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const isEditing = editingId === params.data?.id;
        const value = params.data?.registrationDate || '';
        return isEditing ? (
          <input
            type="date"
            value={value}
            onChange={(e) => onChangeDate(params.data.id, e.target.value)}
            className="border rounded px-2 py-0.5 h-7 text-sm"
          />
        ) : (
          <span>{value}</span>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 2,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const isEditing = editingId === params.data?.id;
        return (
          <div className="flex gap-1 items-center">
            <button
              className="p-1 hover:bg-slate-100 rounded"
              title="Open"
              onClick={() => setOpenRow(params.data)}
            >
              <Eye className="w-4 h-4 text-slate-600" />
            </button>
            {!isEditing ? (
              <button
                className="p-1 hover:bg-slate-100 rounded"
                title="Edit"
                onClick={() => setEditingId(params.data.id)}
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
              </button>
            ) : (
              <>
                <button
                  className="p-1 bg-green-600 hover:bg-green-700 rounded"
                  title="Save"
                  onClick={async () => {
                    const row = rows.find(r => r.id === params.data.id);
                    if (!row) return;
                    await updateAttendance.mutateAsync({ id: row.id, data: { attended: row.attended, registered: row.registered, registrationDate: row.registrationDate } });
                    setEditingId(null);
                  }}
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <button
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Cancel"
                  onClick={() => {
                    // reset local row to server copy
                    const fresh = (data ?? []).find(e => e.id === params.data.id);
                    if (fresh) setRows(prev => prev.map(r => r.id === fresh.id ? fresh : r));
                    setEditingId(null);
                  }}
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </>
            )}
            <button
              className="p-1 hover:bg-red-50 rounded"
              title="Delete"
              onClick={async () => {
                const ok = window.confirm('Delete this attendance entry?');
                if (ok) {
                  await deleteAttendance.mutateAsync(params.data.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!isLoading && rows.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No event attendance records found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <div className="font-medium text-slate-700">Event Attendance</div>
        <Button size="sm" onClick={() => setAddOpen(true)} className="h-8 px-2">
          <Plus className="w-4 h-4 mr-1" /> Add Attendance
        </Button>
      </div>
      <div style={{ height: "400px", width: "100%" }}>
        <GridBase
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
          gridProps={{
            rowSelection: { enableClickSelection: false } as any,
            domLayout: 'autoHeight',
            context: { componentName: 'event-attendance-table' },
          }}
        />
      </div>

      <Dialog open={!!openRow} onOpenChange={(v)=>!v && setOpenRow(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><span className="text-slate-500">Name:</span> <span className="font-medium">{openRow?.eventName || '-'}</span></div>
            <div><span className="text-slate-500">Date:</span> <span className="font-medium">{openRow?.eventDate || '-'}</span></div>
            <div><span className="text-slate-500">Attended:</span> <span className="font-medium">{openRow?.attended ? 'Yes' : 'No'}</span></div>
            <div><span className="text-slate-500">Registered:</span> <span className="font-medium">{openRow?.registered ? 'Yes' : 'No'}</span></div>
            <div><span className="text-slate-500">Registration Date:</span> <span className="font-medium">{openRow?.registrationDate || '-'}</span></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Event Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Search Event</div>
              <Input placeholder="Type event name" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
              {eventResults.length > 0 && (
                <div className="mt-2 border rounded max-h-40 overflow-auto">
                  {eventResults.map(ev => (
                    <button key={ev.id} className={`w-full text-left px-2 py-1 text-sm hover:bg-slate-50 ${selectedEvent?.id===ev.id?'bg-slate-50':''}`} onClick={()=>setSelectedEvent(ev)}>
                      <div className="font-medium">{ev.name || ev.id}</div>
                      <div className="text-xs text-slate-500">{ev.date || '-'}</div>
                    </button>
                  ))}
                </div>
              )}
              {selectedEvent && (
                <div className="mt-2 text-sm">
                  <div><span className="text-slate-500">Selected:</span> <span className="font-medium">{selectedEvent.name}</span> <span className="text-slate-500">({selectedEvent.date || '-'})</span></div>
                </div>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newRegistered} onChange={(e)=>setNewRegistered(e.target.checked)} /> Registered
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newAttended} onChange={(e)=>setNewAttended(e.target.checked)} /> Attended
              </label>
              <div className="text-sm flex items-center gap-2">
                <span className="text-slate-500">Registration Date</span>
                <input type="date" className="border rounded px-2 py-0.5 h-7" value={newRegistrationDate} onChange={(e)=>setNewRegistrationDate(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={()=>setAddOpen(false)}>Cancel</Button>
              <Button size="sm" disabled={!selectedEvent || createAttendance.isPending} onClick={()=>createAttendance.mutate()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
