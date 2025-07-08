import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { School } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import { useLocation } from "wouter";

interface CharterSchoolsTableProps {
  charterId: string;
}

export function CharterSchoolsTable({ charterId }: CharterSchoolsTableProps) {
  const [, setLocation] = useLocation();
  
  const { data: schools = [], isLoading } = useQuery<School[]>({
    queryKey: ["/api/schools/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/schools/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter schools");
      return response.json();
    },
  });

  const handleOpen = (school: School) => {
    setLocation(`/school/${school.id}`);
  };

  const columnDefs: ColDef<School>[] = [
    {
      headerName: "School Name",
      field: "name",
      flex: 1,
      minWidth: 200,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleOpen(params.data)}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left w-full"
        >
          {params.value}
        </button>
      ),
    },
    {
      headerName: "Stage/Status",
      field: "stageStatus",
      width: 150,
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
      headerName: "Location",
      field: "activePhysicalAddress",
      flex: 1,
      minWidth: 200,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 80,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpen(params.data)}
            className="h-6 w-6 p-0"
            title="Open school details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-96 w-full">
      <AgGridReact
        rowData={schools}
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