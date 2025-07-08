import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterGovernanceDocument } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";

interface CharterGovernanceDocumentsTableProps {
  charterId: string;
}

export function CharterGovernanceDocumentsTable({ charterId }: CharterGovernanceDocumentsTableProps) {
  const { data: documents = [], isLoading } = useQuery<CharterGovernanceDocument[]>({
    queryKey: ["/api/charter-governance-documents/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-governance-documents/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter governance documents");
      return response.json();
    },
  });

  const handleOpen = (document: CharterGovernanceDocument) => {
    if (document.docUrl) {
      window.open(document.docUrl, '_blank');
    }
  };

  const handleEdit = (document: CharterGovernanceDocument) => {
    console.log("Edit document:", document);
  };

  const handleDelete = (document: CharterGovernanceDocument) => {
    console.log("Delete document:", document);
  };

  const columnDefs: ColDef<CharterGovernanceDocument>[] = [
    {
      headerName: "Governance documents",
      field: "docType",
      flex: 1,
      minWidth: 200,
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
            title="Open document"
            disabled={!params.data.docUrl}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit document"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete document"
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
        rowData={documents}
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