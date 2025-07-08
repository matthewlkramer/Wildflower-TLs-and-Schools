import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { AssessmentData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";

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
  });

  const handleOpen = (assessment: AssessmentData) => {
    console.log("Open assessment:", assessment);
  };

  const handleEdit = (assessment: AssessmentData) => {
    console.log("Edit assessment:", assessment);
  };

  const handleDelete = (assessment: AssessmentData) => {
    console.log("Delete assessment:", assessment);
  };

  const columnDefs: ColDef<AssessmentData>[] = [
    {
      headerName: "Assessment Type",
      field: "assessmentType",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Test Date",
      field: "testDate",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Grade",
      field: "grade",
      width: 100,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Results",
      field: "results",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
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
            title="Open assessment details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit assessment"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete assessment"
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
        rowData={assessments}
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