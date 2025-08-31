import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterNote } from "@shared/schema";
import { Edit, ExternalLink, Eye, Lock, Unlock, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CharterNotesTableProps {
  charterId: string;
}

export function CharterNotesTable({ charterId }: CharterNotesTableProps) {
  const [selectedNote, setSelectedNote] = useState<CharterNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: notes = [], isLoading } = useQuery<CharterNote[]>({
    queryKey: ["/api/charter-notes/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-notes/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter notes");
      return response.json();
    },
    enabled: !!charterId,
  });

  const handleOpen = (note: CharterNote) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleEdit = (note: CharterNote) => {
    console.log("Edit note:", note);
  };

  const handleTogglePrivate = (note: CharterNote) => {
    console.log("Toggle private:", note);
  };

  const handleDelete = (note: CharterNote) => {
    console.log("Delete note:", note);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Headline",
      field: "headline",
      width: 300,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const note = params.data;
        const headline = params.value || "Untitled Note";
        return (
          <button
            onClick={() => handleOpen(note)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left truncate w-full"
            title={headline}
          >
            {headline}
          </button>
        );
      },
    },
    {
      headerName: "Created By",
      field: "createdBy",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Date Entered",
      field: "dateEntered",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Private",
      field: "private",
      width: 80,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const isPrivate = params.value;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isPrivate ? 'Private' : 'Public'}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const note = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpen(note)}
              className="text-blue-600 hover:text-blue-800"
              title="Open note"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(note)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit note"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleTogglePrivate(note)}
              className="text-yellow-600 hover:text-yellow-800"
              title={note.private ? "Make public" : "Make private"}
            >
              {note.private ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleDelete(note)}
              className="text-red-600 hover:text-red-800"
              title="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <>
      <div style={{ height: "400px", width: "100%" }}>
        <AgGridReact
          theme={themeMaterial}
          rowData={notes}
          columnDefs={columnDefs}
          animateRows={true}
          suppressRowClickSelection={true}
          domLayout="normal"
          headerHeight={40}
          rowHeight={35}
          context={{
            componentName: 'charter-notes-table'
          }}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
        />
      </div>

      {/* Note Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Charter Note Details</DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Headline</h3>
                <p className="text-sm text-slate-900">{selectedNote.headline || "Untitled Note"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Full Notes</h3>
                <div className="text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                  {selectedNote.notes || "No content"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Created By</h3>
                  <p className="text-sm text-slate-900">{selectedNote.createdBy || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Date Entered</h3>
                  <p className="text-sm text-slate-900">{selectedNote.dateEntered || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Private</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedNote.private ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedNote.private ? 'Private' : 'Public'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Record ID</h3>
                  <p className="text-sm text-slate-900 font-mono">{selectedNote.id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
