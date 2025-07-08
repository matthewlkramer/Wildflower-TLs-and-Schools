import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { Charter990 } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";

interface Charter990sTableProps {
  charterId: string;
}

export function Charter990sTable({ charterId }: Charter990sTableProps) {
  const { data: tax990s = [], isLoading } = useQuery<Charter990[]>({
    queryKey: ["/api/charter-990s/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-990s/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter 990s");
      return response.json();
    },
  });

  const handleOpen = (tax990: Charter990) => {
    if (tax990.docUrl) {
      window.open(tax990.docUrl, '_blank');
    }
  };

  const handleEdit = (tax990: Charter990) => {
    console.log("Edit 990:", tax990);
  };

  const handleDelete = (tax990: Charter990) => {
    console.log("Delete 990:", tax990);
  };

  const columnDefs: ColDef<Charter990>[] = [
    {
      headerName: "990 year",
      field: "year",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleOpen(params.data)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left w-full"
          disabled={!params.data.docUrl}
        >
          {params.value}
        </button>
      ),
    },
    {
      headerName: "Date",
      field: "dateEntered",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 80,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpen(params.data)}
            className="h-6 w-6 p-0"
            title="Open 990 document"
            disabled={!params.data.docUrl}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit 990"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete 990"
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
        rowData={tax990s}
        columnDefs={columnDefs}
        theme={themeMaterial}
        loading={isLoading}
        rowHeight={30}
        suppressRowClickSelection={true}
        pagination={false}
        domLayout="normal"
        suppressHorizontalScroll={false}
        className="ag-theme-material"
      />
    </div>
  );
}