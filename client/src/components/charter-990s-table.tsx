import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { Charter990 } from "@shared/schema";
import { Edit, ExternalLink, Trash2 } from "lucide-react";

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
    enabled: !!charterId,
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

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "990 Year",
      field: "year",
      width: 120,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const tax990 = params.data;
        const year = params.value || "Unknown Year";
        if (tax990.docUrl) {
          return (
            <button
              onClick={() => handleOpen(tax990)}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left flex items-center gap-1"
            >
              {year}
              <ExternalLink className="h-3 w-3" />
            </button>
          );
        }
        return <span>{year}</span>;
      },
    },
    {
      headerName: "Date Entered",
      field: "dateEntered",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const tax990 = params.data;
        return (
          <div className="flex items-center gap-2">
            {tax990.docUrl && (
              <button
                onClick={() => handleOpen(tax990)}
                className="text-blue-600 hover:text-blue-800"
                title="Open 990"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => handleEdit(tax990)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit 990"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(tax990)}
              className="text-red-600 hover:text-red-800"
              title="Delete 990"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  // Sort 990s by year descending (most recent first)
  const sorted990s = [...tax990s].sort((a, b) => {
    const yearA = parseInt(a.year || "0");
    const yearB = parseInt(b.year || "0");
    return yearB - yearA;
  });

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
    <div style={{ height: "400px", width: "100%" }}>
      <AgGridReact
        theme={themeMaterial}
        rowData={sorted990s}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection={{ enableClickSelection: false } as any}
        domLayout="normal"
        headerHeight={40}
        rowHeight={30}
        context={{
          componentName: 'charter-990s-table'
        }}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
        }}
      />
    </div>
  );
}
