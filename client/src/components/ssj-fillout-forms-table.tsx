import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
import type { SSJFilloutForm } from "@shared/schema.generated";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SSJFilloutFormsTableProps {
  educatorId: string;
}

export function SSJFilloutFormsTable({ educatorId }: SSJFilloutFormsTableProps) {
  const [selectedForm, setSelectedForm] = useState<SSJFilloutForm | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: forms = [], isLoading } = useQuery<SSJFilloutForm[]>({
    queryKey: ["/api/ssj-fillout-forms/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/ssj-fillout-forms/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch SSJ fillout forms");
      return response.json();
    },
  });

  const handleOpenForm = (form: SSJFilloutForm) => {
    setSelectedForm(form);
    setIsViewModalOpen(true);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Form Name",
      field: "formName",
      flex: 1,
      ...createTextFilter(),
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Form Type",
      field: "formType",
      flex: 1,
      ...createTextFilter(),
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Date Submitted",
      field: "dateSubmitted",
      flex: 1,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return '';
        try {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        } catch {
          return params.value;
        }
      },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      ...createTextFilter(),
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      cellRenderer: (params: any) => {
        const form = params.data;
        return (
          <div className="flex items-center justify-center h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenForm(form)}
              className="h-6 w-6 p-0"
              title="Open form details"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        );
      },
      sortable: false,
      filter: false,
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

  if (forms.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No SSJ fillout forms found for this educator.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200">
        <div style={{ height: "400px", width: "100%" }}>
          <GridBase
            rowData={forms}
            columnDefs={columnDefs}
            defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
            gridProps={{
              rowSelection: { enableClickSelection: false } as any,
              domLayout: 'autoHeight',
              context: { componentName: 'ssj-fillout-forms-table' },
            }}
          />
        </div>
      </div>

      {/* View Form Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SSJ Fillout Form Details</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Form Type</label>
                  <p className="text-sm mt-1">{selectedForm.formType || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Form Name</label>
                  <p className="text-sm mt-1">{(selectedForm as any).formName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date Submitted</label>
                  <p className="text-sm mt-1">
                    {selectedForm.dateSubmitted ? new Date(selectedForm.dateSubmitted).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <p className="text-sm mt-1">{selectedForm.status || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Submission ID</label>
                  <p className="text-sm mt-1">{selectedForm.submissionId || '-'}</p>
                </div>
              </div>
              
              {selectedForm.responseData && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Response Data</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedForm.responseData}</p>
                </div>
              )}
              
              {selectedForm.notes && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Notes</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedForm.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-sm font-medium text-slate-600">Created</label>
                  <p className="text-sm mt-1 text-slate-500">
                    {selectedForm.created ? new Date(selectedForm.created).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Last Modified</label>
                  <p className="text-sm mt-1 text-slate-500">
                    {selectedForm.lastModified ? new Date(selectedForm.lastModified).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-600">Record ID</label>
                <p className="text-xs mt-1 text-slate-400 font-mono">{selectedForm.id}</p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-600">All Fields</label>
                <pre className="text-xs mt-1 text-slate-600 bg-slate-50 p-2 rounded overflow-x-auto">{JSON.stringify(selectedForm, null, 2)}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
