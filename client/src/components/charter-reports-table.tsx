import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import type { ReportSubmission } from "@/types/schema.generated";
import { Edit, Trash2 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import { createTextFilter } from "@/utils/ag-grid-utils";

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
    enabled: !!charterId,
  });

  const handleEdit = (report: ReportSubmission) => {
    console.log("Edit report:", report);
  };

  const handleDelete = (report: ReportSubmission) => {
    console.log("Delete report:", report);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Report Type",
      field: "reportType",
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      width: 120,
      ...createTextFilter(),
    },
    {
      headerName: "Submission Date",
      field: "submissionDate",
      width: 140,
      ...createTextFilter(),
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      ...createTextFilter(),
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
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const report = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(report)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit report"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(report)}
              className="text-red-600 hover:text-red-800"
              title="Delete report"
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
    <div style={{ height: "400px", width: "100%" }}>
      <GridBase
        rowData={reports}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
        gridProps={{
          rowSelection: { enableClickSelection: false } as any,
          domLayout: 'normal',
          context: { componentName: 'charter-reports-table' },
        }}
      />
    </div>
  );
}
