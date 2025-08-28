import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { EducatorSchoolAssociation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, UserMinus, Trash2 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface EducatorSchoolAssociationsTableProps {
  educatorId: string;
}

export function EducatorSchoolAssociationsTable({ educatorId }: EducatorSchoolAssociationsTableProps) {
  const { data: associations = [], isLoading } = useQuery<EducatorSchoolAssociation[]>({
    queryKey: ["/api/educator-school-associations/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-school-associations/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch educator school associations");
      return response.json();
    },
  });

  const handleOpen = (association: EducatorSchoolAssociation) => {
    console.log("Open association:", association);
    window.location.href = `/school/${association.schoolId}`;
  };

  const handleEdit = (association: EducatorSchoolAssociation) => {
    console.log("Edit association:", association);
    // TODO: Implement inline edit functionality
  };

  const handleEndStint = (association: EducatorSchoolAssociation) => {
    console.log("End stint:", association);
    // TODO: Implement end stint functionality
  };

  const handleDelete = (association: EducatorSchoolAssociation) => {
    console.log("Delete association:", association);
    // TODO: Implement delete functionality
  };

  const RolesCellRenderer = (params: ICellRendererParams<EducatorSchoolAssociation>) => {
    const roles = params.value;
    if (!roles) return '-';
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return (
      <div className="flex flex-wrap gap-1">
        {roleArray.map((role, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {role}
          </Badge>
        ))}
      </div>
    );
  };

  const ActiveCellRenderer = (params: ICellRendererParams<EducatorSchoolAssociation>) => {
    const isActive = params.value;
    return (
      <Badge 
        className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const StageStatusCellRenderer = (params: ICellRendererParams<EducatorSchoolAssociation>) => {
    const stageStatus = params.value;
    if (!stageStatus) return '-';
    
    return (
      <Badge className={getStatusColor(stageStatus)}>
        {stageStatus}
      </Badge>
    );
  };

  const ActionsCellRenderer = (params: ICellRendererParams<EducatorSchoolAssociation>) => {
    const association = params.data;
    if (!association) return null;

    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-blue-50"
          onClick={() => handleOpen(association)}
          title="Open school detail"
        >
          <ExternalLink className="h-3 w-3 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-green-50"
          onClick={() => handleEdit(association)}
          title="Edit association"
        >
          <Edit3 className="h-3 w-3 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-yellow-50"
          onClick={() => handleEndStint(association)}
          title="End stint"
        >
          <UserMinus className="h-3 w-3 text-yellow-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-50"
          onClick={() => handleDelete(association)}
          title="Delete association"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    );
  };

  const SchoolCellRenderer = (params: ICellRendererParams<EducatorSchoolAssociation>) => {
    const association = params.data;
    const schoolName = params.value;
    if (!association || !schoolName) return '-';

    return (
      <button
        className="text-blue-600 hover:text-blue-800 hover:underline text-left"
        onClick={() => window.location.href = `/school/${association.schoolId}`}
        title="Open school detail page"
      >
        {schoolName}
      </button>
    );
  };

  const columnDefs: ColDef<EducatorSchoolAssociation>[] = [
    {
      headerName: "School",
      field: "schoolShortName",
      flex: 2,
      filter: "agTextColumnFilter",
      cellRenderer: SchoolCellRenderer,
    },
    {
      headerName: "Role(s)",
      field: "role",
      flex: 2,
      filter: "agTextColumnFilter",
      cellRenderer: RolesCellRenderer,
    },
    {
      headerName: "Start Date",
      field: "startDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "End Date",
      field: "endDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Active",
      field: "isActive",
      flex: 1,
      cellRenderer: ActiveCellRenderer,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Stage/Status",
      field: "stageStatus",
      flex: 1,
      cellRenderer: StageStatusCellRenderer,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 160,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
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

  if (associations.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No school associations found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div style={{ height: "400px", width: "100%" }}>
        <AgGridReact
          theme={themeMaterial}
          rowData={associations}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="none"
          suppressRowClickSelection={true}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={30}
          context={{
            componentName: 'educator-school-associations-table'
          }}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}