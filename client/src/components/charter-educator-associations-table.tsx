import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { EducatorSchoolAssociation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, UserMinus, Trash2 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface CharterEducatorAssociationsTableProps {
  charterId: string;
}

export function CharterEducatorAssociationsTable({ charterId }: CharterEducatorAssociationsTableProps) {
  const { data: associations = [], isLoading } = useQuery<EducatorSchoolAssociation[]>({
    queryKey: ["/api/educator-school-associations/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-school-associations/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter educator associations");
      return response.json();
    },
  });

  const handleOpen = (association: EducatorSchoolAssociation) => {
    console.log("Open association:", association);
  };

  const handleEdit = (association: EducatorSchoolAssociation) => {
    console.log("Edit association:", association);
  };

  const handleEndStint = (association: EducatorSchoolAssociation) => {
    console.log("End stint:", association);
  };

  const handleDelete = (association: EducatorSchoolAssociation) => {
    console.log("Delete association:", association);
  };

  const columnDefs: ColDef<EducatorSchoolAssociation>[] = [
    {
      headerName: "Educator",
      field: "educatorName",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "School",
      field: "schoolName",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Role",
      field: "role",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Start Date",
      field: "startDate",
      width: 100,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "End Date",
      field: "endDate",
      width: 100,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Active",
      field: "active",
      width: 80,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const active = params.value;
        return (
          <Badge 
            className={`${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs`}
            variant="secondary"
          >
            {active ? "Active" : "Inactive"}
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
            title="Open association details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit association"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEndStint(params.data)}
            className="h-6 w-6 p-0"
            title="End stint"
          >
            <UserMinus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete association"
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
        rowData={associations}
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