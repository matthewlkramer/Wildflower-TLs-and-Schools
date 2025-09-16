import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
// Use loose typing; API/DB provide snake_case fields
import { Edit, Eye, CheckCircle, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStatusColor } from "@/lib/utils";
import { createTextFilter } from "@/utils/ag-grid-utils";

interface ActionStepsTableProps {
  charterId: string;
}

export function ActionStepsTable({ charterId }: ActionStepsTableProps) {
  const [selectedActionStep, setSelectedActionStep] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: actionSteps = [], isLoading } = useQuery<any[]>({
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
  const sortedActionSteps = (actionSteps as any[]).slice().sort((a, b) => {
    const aComplete = !!(a.complete ?? false);
    const bComplete = !!(b.complete ?? false);
    if (aComplete !== bComplete) return aComplete ? 1 : -1;
    const ad = a.dueDate ?? a.due_date;
    const bd = b.dueDate ?? b.due_date;
    if (ad && bd) return new Date(ad).getTime() - new Date(bd).getTime();
    return 0;
  });

  const handleOpen = (actionStep: any) => {
    setSelectedActionStep(actionStep);
    setIsModalOpen(true);
  };

  const handleEdit = (actionStep: any) => {
    console.log("Edit action step:", actionStep);
  };

  const handleToggleComplete = (actionStep: any) => {
    console.log("Toggle complete:", actionStep);
  };

  const handleDelete = (actionStep: any) => {
    console.log("Delete action step:", actionStep);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Description",
      field: "item",
      width: 300,
      ...createTextFilter(),
      cellRenderer: (params: any) => {
        const description = params.value || params.data?.item || "No description";
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
      ...createTextFilter(),
    },
    {
      headerName: "Due Date",
      field: "due_date",
      width: 100,
      ...createTextFilter(),
      valueGetter: (p: any) => p.data?.dueDate ?? p.data?.due_date ?? '',
    },
    {
      headerName: "Status",
      field: "item_status",
      width: 100,
      ...createTextFilter(),
      valueGetter: (p: any) => p.data?.status ?? p.data?.item_status ?? '',
      cellRenderer: (params: any) => {
        const status = params.value ?? params.data?.item_status;
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
      field: "item_status",
      width: 90,
      ...createTextFilter(),
      valueGetter: (p: any) => p.data?.complete ?? (p.data?.item_status === 'Complete'),
      cellRenderer: (params: any) => {
        const complete = (params.value ?? params.data?.item_status) === 'Complete';
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
        const actionStep = params.data as any;
        return (
          <select
            aria-label="Actions"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              e.currentTarget.selectedIndex = 0;
              switch (v) {
                case 'open': handleOpen(actionStep); break;
                case 'edit': handleEdit(actionStep); break;
                case 'toggle': handleToggleComplete(actionStep); break;
                case 'delete': handleDelete(actionStep); break;
              }
            }}
            className="h-7 text-xs border rounded-md px-1 bg-white"
          >
            <option value="" disabled>Actions</option>
            <option value="open">Open</option>
            <option value="edit">Edit</option>
            <option value="toggle">{((actionStep as any).item_status === 'Complete') ? 'Mark incomplete' : 'Mark complete'}</option>
            <option value="delete">Delete</option>
          </select>
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
        <GridBase
          rowData={sortedActionSteps}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
          gridProps={{
            rowSelection: { enableClickSelection: false } as any,
            domLayout: 'normal',
            context: { componentName: 'charter-action-steps-table' },
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
