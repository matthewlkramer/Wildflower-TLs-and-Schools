import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { ReportSubmission } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface CharterReportsTableProps {
  charterId: string;
}

export function CharterReportsTable({ charterId }: CharterReportsTableProps) {
  const { data: reports = [], isLoading } = useQuery<ReportSubmission[]>({
    queryKey: ["/api/report-submissions/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/report-submissions/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter reports");
      return response.json();
    },
  });

  const handleOpen = (report: ReportSubmission) => {
    console.log("Open report:", report);
  };

  const handleEdit = (report: ReportSubmission) => {
    console.log("Edit report:", report);
  };

  const handleDelete = (report: ReportSubmission) => {
    console.log("Delete report:", report);
  };

  const columnDefs: ColDef<ReportSubmission>[] = [
    {
      headerName: "Report Type",
      field: "reportType",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Submission Date",
      field: "submissionDate",
      width: 130,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) return "";
        const color = getStatusColor(status);
        return (
          <Badge 
            className={`${color} text-xs`}
            variant="secondary"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpen(params.data)}
            className="h-6 w-6 p-0"
            title="Open report details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit report"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete report"
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
        rowData={reports}
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