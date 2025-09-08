import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import type { AssessmentData } from "@shared/schema";
import { Edit, Trash2 } from "lucide-react";
import { createTextFilter } from "@/utils/ag-grid-utils";

interface CharterAssessmentsTableProps {
  charterId: string;
}

export function CharterAssessmentsTable({ charterId }: CharterAssessmentsTableProps) {
  const { data: assessments = [], isLoading } = useQuery<AssessmentData[]>({
    queryKey: ["/api/assessment-data/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/assessment-data/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter assessments");
      return response.json();
    },
    enabled: !!charterId,
  });

  const handleEdit = (assessment: AssessmentData) => {
    console.log("Edit assessment:", assessment);
  };

  const handleDelete = (assessment: AssessmentData) => {
    console.log("Delete assessment:", assessment);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Assessment Type",
      field: "assessmentType",
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: "Test Date",
      field: "testDate",
      width: 120,
      ...createTextFilter(),
    },
    {
      headerName: "Grade",
      field: "grade",
      width: 100,
      ...createTextFilter(),
    },
    {
      headerName: "Results",
      field: "results",
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const assessment = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(assessment)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit assessment"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(assessment)}
              className="text-red-600 hover:text-red-800"
              title="Delete assessment"
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
        rowData={assessments}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
        gridProps={{
          rowSelection: { enableClickSelection: false } as any,
          domLayout: 'normal',
          context: { componentName: 'charter-assessments-table' },
        }}
      />
    </div>
  );
}
