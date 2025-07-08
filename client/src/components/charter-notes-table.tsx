import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterNote } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Eye, EyeOff, Trash2 } from "lucide-react";

interface CharterNotesTableProps {
  charterId: string;
}

export function CharterNotesTable({ charterId }: CharterNotesTableProps) {
  const { data: notes = [], isLoading } = useQuery<CharterNote[]>({
    queryKey: ["/api/charter-notes/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-notes/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter notes");
      return response.json();
    },
  });

  const handleOpen = (note: CharterNote) => {
    console.log("Open note:", note);
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

  const columnDefs: ColDef<CharterNote>[] = [
    {
      headerName: "Headline",
      field: "headline",
      flex: 1,
      minWidth: 200,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleOpen(params.data)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left w-full truncate"
          title={params.value}
        >
          {params.value}
        </button>
      ),
    },
    {
      headerName: "Created By",
      field: "createdBy",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Date",
      field: "dateEntered",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Private",
      field: "private",
      width: 80,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <Badge 
          className={`${params.value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-xs`}
          variant="secondary"
        >
          {params.value ? "Private" : "Public"}
        </Badge>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpen(params.data)}
            className="h-6 w-6 p-0"
            title="Open note details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit note"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleTogglePrivate(params.data)}
            className="h-6 w-6 p-0"
            title={params.data.private ? "Make public" : "Make private"}
          >
            {params.data.private ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete note"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-96 w-full">
      <AgGridReact
        rowData={notes}
        columnDefs={columnDefs}
        theme={themeMaterial}
        loading={isLoading}
        rowHeight={40}
        suppressRowClickSelection={true}
        pagination={false}
        domLayout="normal"
        suppressHorizontalScroll={false}
        className="ag-theme-material"
      />
    </div>
  );
}