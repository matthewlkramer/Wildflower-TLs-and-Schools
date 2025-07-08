import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterActionStep } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Check, RotateCcw, Trash2 } from "lucide-react";

interface CharterActionStepsTableProps {
  charterId: string;
}

export function CharterActionStepsTable({ charterId }: CharterActionStepsTableProps) {
  const { data: actionSteps = [], isLoading } = useQuery<CharterActionStep[]>({
    queryKey: ["/api/charter-action-steps/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-action-steps/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter action steps");
      return response.json();
    },
  });

  const handleOpen = (actionStep: CharterActionStep) => {
    console.log("Open action step:", actionStep);
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

  const columnDefs: ColDef<CharterActionStep>[] = [
    {
      headerName: "Description",
      field: "description",
      flex: 1,
      minWidth: 200,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <div className="truncate" title={params.value}>
          {params.value}
        </div>
      ),
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
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Status",
      field: "status",
      width: 100,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const complete = params.data.complete;
        return (
          <Badge 
            className={`${complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs`}
            variant="secondary"
          >
            {complete ? "Complete" : "In Progress"}
          </Badge>
        );
      },
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
            title="Open action step details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit action step"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleToggleComplete(params.data)}
            className="h-6 w-6 p-0"
            title={params.data.complete ? "Mark as incomplete" : "Mark as complete"}
          >
            {params.data.complete ? <RotateCcw className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete action step"
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
        rowData={actionSteps}
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