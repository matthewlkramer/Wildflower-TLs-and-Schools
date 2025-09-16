import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
// Use loose typing; API/DB provide snake_case fields
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import { createTextFilter } from "@/utils/ag-grid-utils";

interface GovernanceDocumentsTableProps {
  charterId: string;
}

export function GovernanceDocumentsTable({ charterId }: GovernanceDocumentsTableProps) {
  const { data: documents = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/charter-governance-documents/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-governance-documents/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter governance documents");
      return response.json();
    },
    enabled: !!charterId,
  });

  const handleOpen = (document: any) => {
    const url = document.pdf ?? document.link ?? document.doc_url ?? document.attachment_url;
    if (url) window.open(url, '_blank');
  };

  const handleEdit = (document: any) => {
    console.log("Edit document:", document);
  };

  const handleDelete = (document: any) => {
    console.log("Delete document:", document);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Document Type",
      field: "doc_type",
      width: 200,
      ...createTextFilter(),
      cellRenderer: (params: any) => {
        const document = params.data;
        const docType = params.value || document.doc_type || "Document";
        const hasUrl = !!(document.pdf ?? document.link ?? document.doc_url ?? document.attachment_url);
        if (hasUrl) {
          return (
            <button
              onClick={() => handleOpen(document)}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left flex items-center gap-1"
            >
              {docType}
              <ExternalLink className="h-3 w-3" />
            </button>
          );
        }
        return <span>{docType}</span>;
      },
    },
    {
      headerName: "Date",
      field: "date_entered",
      width: 120,
      ...createTextFilter(),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const document = params.data;
        return (
          <div className="flex items-center gap-2">
            {(document.pdf ?? document.link ?? document.doc_url ?? document.attachment_url) && (
              <button
                onClick={() => handleOpen(document)}
                className="text-blue-600 hover:text-blue-800"
                title="Open document"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => handleEdit(document)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit document"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(document)}
              className="text-red-600 hover:text-red-800"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  // Sort documents alphabetically by type
  const sortedDocuments = [...documents].sort((a, b) => {
    return ((a as any).doc_type || "").localeCompare((b as any).doc_type || "");
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
      <GridBase
        rowData={sortedDocuments}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
        gridProps={{
          rowSelection: { enableClickSelection: false } as any,
          domLayout: 'normal',
          context: { componentName: 'charter-governance-documents-table' },
        }}
      />
    </div>
  );
}
