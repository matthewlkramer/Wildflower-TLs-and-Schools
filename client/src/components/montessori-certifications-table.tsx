import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { MontessoriCertification } from "@shared/schema";

interface MontessoriCertificationsTableProps {
  educatorId: string;
}

export function MontessoriCertificationsTable({ educatorId }: MontessoriCertificationsTableProps) {
  const { data: certifications = [], isLoading } = useQuery<MontessoriCertification[]>({
    queryKey: ["/api/montessori-certifications/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/montessori-certifications/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch Montessori certifications");
      return response.json();
    },
  });

  const columnDefs: ColDef<MontessoriCertification>[] = [
    {
      headerName: "Year Certified",
      field: "dateReceived",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Abbreviation",
      field: "certifier",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Level",
      field: "certificationLevel",
      flex: 1,
      filter: "agTextColumnFilter",
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

  if (certifications.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No Montessori certifications found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div style={{ height: "400px", width: "100%" }}>
        <AgGridReact
          theme={themeMaterial}
          rowData={certifications}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="none"
          suppressRowClickSelection={true}
          domLayout="autoHeight"
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
  );
}