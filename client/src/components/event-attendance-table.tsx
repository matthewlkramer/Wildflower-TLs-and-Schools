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
      flex: 3,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Event Date",
      field: "eventDate",
      flex: 2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Attended",
      field: "attendanceStatus",
      flex: 1,
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        const attended = params.value?.toLowerCase() === 'attended';
        return (
          <div className="flex justify-center">
            <input 
              type="checkbox" 
              checked={attended} 
              readOnly 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        );
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
          rowSelection="none"
          suppressRowClickSelection={true}
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