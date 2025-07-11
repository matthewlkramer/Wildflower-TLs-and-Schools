import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { EducatorSchoolAssociation } from "@shared/schema";
import { Edit, Trash2, UserMinus } from "lucide-react";
import { useLocation } from "wouter";

interface CharterEducatorAssociationsTableProps {
  charterId: string;
}

export function CharterEducatorAssociationsTable({ charterId }: CharterEducatorAssociationsTableProps) {
  const [, setLocation] = useLocation();

  const { data: associations = [], isLoading } = useQuery<EducatorSchoolAssociation[]>({
    queryKey: ["/api/educator-school-associations/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-school-associations/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter educator associations");
      return response.json();
    },
    enabled: !!charterId,
  });

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
      width: 180,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const association = params.data;
        return (
          <button
            onClick={() => setLocation(`/educators/${association.educatorId}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
          >
            {params.value}
          </button>
        );
      },
    },
    {
      headerName: "School",
      field: "schoolName",
      width: 180,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const association = params.data;
        return (
          <button
            onClick={() => setLocation(`/schools/${association.schoolId}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
          >
            {params.value}
          </button>
        );
      },
    },
    {
      headerName: "Role",
      field: "role",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Start Date",
      field: "startDate",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "End Date",
      field: "endDate",
      width: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Active",
      field: "active",
      width: 100,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const active = params.value;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {active ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const association = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(association)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit association"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEndStint(association)}
              className="text-yellow-600 hover:text-yellow-800"
              title="End stint"
            >
              <UserMinus className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(association)}
              className="text-red-600 hover:text-red-800"
              title="Delete association"
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
      <AgGridReact
        theme={themeMaterial}
        rowData={associations}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection="none"
        suppressRowClickSelection={true}
        domLayout="normal"
        headerHeight={40}
        rowHeight={30}
        context={{
          componentName: 'charter-educator-associations-table'
        }}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
        }}
      />
    </div>
  );
}