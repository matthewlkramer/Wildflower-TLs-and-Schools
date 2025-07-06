import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { EventAttendance } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface EventAttendanceTableProps {
  educatorId: string;
}

export function EventAttendanceTable({ educatorId }: EventAttendanceTableProps) {
  const { data: events = [], isLoading } = useQuery<EventAttendance[]>({
    queryKey: ["/api/event-attendance/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/event-attendance/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch event attendance");
      return response.json();
    },
  });

  const columnDefs: ColDef<EventAttendance>[] = [
    {
      headerName: "Event Name",
      field: "eventName",
      flex: 2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Event Type",
      field: "eventType",
      flex: 1.2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Event Date",
      field: "eventDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Registration Date",
      field: "registrationDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Attendance Status",
      field: "attendanceStatus",
      flex: 1.2,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        const status = params.value.toLowerCase();
        let variant = 'secondary';
        if (status === 'attended') variant = 'default';
        else if (status === 'registered') variant = 'outline';
        else if (status === 'cancelled' || status === 'no-show') variant = 'destructive';
        
        return <Badge variant={variant as any}>{params.value}</Badge>;
      },
    },
    {
      headerName: "Completion Status",
      field: "completionStatus",
      flex: 1.2,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        const status = params.value.toLowerCase();
        let variant = 'secondary';
        if (status === 'completed') variant = 'default';
        else if (status === 'in-progress') variant = 'outline';
        else if (status === 'not-started') variant = 'secondary';
        
        return <Badge variant={variant as any}>{params.value}</Badge>;
      },
    },
    {
      headerName: "Certificate",
      field: "certificateIssued",
      flex: 1,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return <Badge variant="default">Issued</Badge>;
        } else if (params.value === false) {
          return <Badge variant="secondary">Not Issued</Badge>;
        }
        return '';
      },
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

  if (events.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No event attendance records found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
        <AgGridReact
          rowData={events}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection={{ mode: "singleRow" }}
          suppressRowClickSelection={false}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={35}
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