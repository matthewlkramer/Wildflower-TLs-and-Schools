import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterActionStep } from "@shared/schema";
import { Edit, Eye, CheckCircle, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStatusColor } from "@/lib/utils";

interface CharterActionStepsTableProps {
  charterId: string;
}

export function CharterActionStepsTable({ charterId }: CharterActionStepsTableProps) {
  const [selectedActionStep, setSelectedActionStep] = useState<CharterActionStep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: actionSteps = [], isLoading } = useQuery<CharterActionStep[]>({
    queryKey: ["/api/charter-action-steps/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-action-steps/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter action steps");
      return response.json();
    },
    enabled: !!charterId,
  });

  // Sort action steps: incomplete first, then by due date
  const sortedActionSteps = [...actionSteps].sort((a, b) => {
    if (a.complete !== b.complete) {
      return a.complete ? 1 : -1; // incomplete first
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const handleOpen = (actionStep: CharterActionStep) => {
    setSelectedActionStep(actionStep);
    setIsModalOpen(true);
  };

  const handleEdit = (actionStep: CharterActionStep) => {
    console.log("Edit action step:", actionStep);
  };

  const handleToggleComplete = (actionStep: CharterActionStep) => {
    console.log("Toggle complete:", actionStep);
  };

  const handleDelete = (actionStep: CharterActionStep) => {
    console.log("Delete action step:", actionStep);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Description",
      field: "description",
      width: 300,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const description = params.value || "No description";
        const truncated = description.length > 80 ? description.substring(0, 80) + "..." : description;
        return (
          <div className="truncate" title={description}>
            {truncated}
          </div>
        );
      },
    },
    {
      headerName: "Assignee",
      field: "assignee",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      width: 100,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Status",
      field: "status",
      width: 100,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) return <span className="text-slate-500">Not specified</span>;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      headerName: "Complete",
      field: "complete",
      width: 90,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const complete = params.value;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {complete ? 'Complete' : 'Pending'}
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
        const actionStep = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpen(actionStep)}
              className="text-blue-600 hover:text-blue-800"
              title="Open action step"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(actionStep)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit action step"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleToggleComplete(actionStep)}
              className="text-green-600 hover:text-green-800"
              title={actionStep.complete ? "Mark as incomplete" : "Mark as complete"}
            >
              {actionStep.complete ? <RotateCcw className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleDelete(actionStep)}
              className="text-red-600 hover:text-red-800"
              title="Delete action step"
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
          rowData={sortedActionSteps}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection={{ enableClickSelection: false } as any}
          domLayout="normal"
          headerHeight={40}
          rowHeight={35}
          context={{
            componentName: 'charter-action-steps-table'
          }}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
        />
      </div>

      {/* Action Step Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Action Step Details</DialogTitle>
          </DialogHeader>
          {selectedActionStep && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
                <div className="text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                  {selectedActionStep.description || "No description"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Assignee</h3>
                  <p className="text-sm text-slate-900">{selectedActionStep.assignee || "Not assigned"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Due Date</h3>
                  <p className="text-sm text-slate-900">{selectedActionStep.dueDate || "No due date"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                  {selectedActionStep.status ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedActionStep.status)}`}>
                      {selectedActionStep.status}
                    </span>
                  ) : (
                    <p className="text-sm text-slate-900">Not specified</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Complete</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedActionStep.complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedActionStep.complete ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Record ID</h3>
                  <p className="text-sm text-slate-900 font-mono">{selectedActionStep.id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
