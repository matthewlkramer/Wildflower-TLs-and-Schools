import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { Charter } from "@shared/schema";
import { useSearch, usePageTitle, useAddNew } from "@/App";
import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { getStatusColor } from "@/lib/utils";

export default function Charters() {
  const { searchTerm } = useSearch();
  const { setPageTitle } = usePageTitle();
  const { setAddNewOptions } = useAddNew();
  const [, setLocation] = useLocation();

  useEffect(() => {
    setPageTitle("Charters");
    setAddNewOptions([]);
  }, [setPageTitle, setAddNewOptions]);

  const { data: charters = [], isLoading } = useQuery<Charter[]>({
    queryKey: ["/api/charters"],
    queryFn: async () => {
      const response = await fetch("/api/charters", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch charters");
      return response.json();
    },
  });

  // Filter charters based on search term
  const filteredCharters = useMemo(() => {
    if (!searchTerm) return charters;
    
    const searchLower = searchTerm.toLowerCase();
    return charters.filter(charter => 
      charter.shortName?.toLowerCase().includes(searchLower) ||
      charter.fullName?.toLowerCase().includes(searchLower) ||
      charter.city?.toLowerCase().includes(searchLower) ||
      charter.status?.toLowerCase().includes(searchLower)
    );
  }, [charters, searchTerm]);

  const columnDefs: ColDef<Charter>[] = [
    {
      headerName: "Short Name",
      field: "shortName",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        return (
          <button
            onClick={() => setLocation(`/charter/${params.data.id}`)}
            className="text-left hover:text-blue-600 hover:underline w-full h-full"
          >
            {params.value || ""}
          </button>
        );
      },
    },
    {
      headerName: "Full Name",
      field: "fullName",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Initial Target Community",
      field: "initialTargetCommunity",
      width: 200,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Projected Open",
      field: "projectedOpen",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Initial Target Ages",
      field: "initialTargetAges",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const ages = params.value;
        if (!ages || ages.length === 0) {
          return <span className="text-slate-500">Not specified</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {ages.map((age: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {age}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) {
          return <span className="text-slate-500">Not specified</span>;
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-slate-200">
        <div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
          <AgGridReact
            theme={themeMaterial}
            rowData={filteredCharters}
            columnDefs={columnDefs}
            animateRows={true}
            rowSelection="none"
            suppressRowClickSelection={true}
            domLayout="normal"
            headerHeight={40}
            rowHeight={30}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}