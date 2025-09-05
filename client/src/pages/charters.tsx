/**
 * Lists charter organizations in an AG‑Grid table. Records are fetched from
 * `/api/charters` and kept in React Query cache. Client‑side filters apply the
 * global search term and optional “My records” user filter. Clicking a short
 * name navigates to the charter detail page. The page sets its title to
 * "Charters". The header Add menu is fixed; this page also includes a local
 * Add Charter button in the search row.
 */
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Charter } from "@shared/schema";
import { useSearch } from "@/contexts/search-context";
import { usePageTitle } from "@/App";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { getStatusColor } from "@/lib/utils";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { useGridHeight } from "@/components/shared/use-grid-height";

export default function Charters() {
  const gridHeight = useGridHeight();
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const { setPageTitle } = usePageTitle();
  const [, setLocation] = useLocation();

  useEffect(() => {
    setPageTitle("Charters");
  }, [setPageTitle]);

  const { data: charters = [], isLoading } = useQuery<Charter[]>({
    queryKey: ["/api/charters"],
    queryFn: async () => {
      const response = await fetch("/api/charters", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch charters");
      return response.json();
    },
  });

  // Filter charters based on search term and user filter
  const filteredCharters = useMemo(() => {
    let filtered = charters;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(charter => 
        charter.shortName?.toLowerCase().includes(searchLower) ||
        charter.fullName?.toLowerCase().includes(searchLower) ||
        charter.city?.toLowerCase().includes(searchLower) ||
        charter.status?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      filtered = filtered.filter(charter => {
        // For demo purposes, we'll check if the charter has demo user relationships
        // In a real app, this would be based on proper user authentication and roles
        const isMyRecord = charter.assignedPartner?.toLowerCase().includes('demo') ||
                          false; // Add more conditions as needed
        
        return isMyRecord;
      });
    }
    
    return filtered;
  }, [charters, searchTerm, showOnlyMyRecords, currentUser]);

  // Debug info similar to Teachers page
  const searchDebug = `Search: "${searchTerm}" | Total: ${charters?.length} | Filtered (user-filter): ${filteredCharters?.length}`;
  logger.log('Charters - filtered result:', searchDebug);
  try { console.log('[Charters] debug:', searchDebug); } catch {}

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
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full bg-white rounded-lg border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full bg-white rounded-lg border border-slate-200">
        <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3">
          {false ? (
            <></>
          ) : (
            <>
              <span>Search:</span>
              <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
              <span>Showing {filteredCharters?.length ?? 0} of {charters?.length ?? 0}</span>
              <div className="ml-auto flex items-center gap-2">
                <Button size="xs" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => { try { console.log('Create Charter - to be implemented'); } catch {} }}>
                  Add Charter
                </Button>
                <Button size="xs" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/charters'] })}>
                  Refresh
                </Button>
              </div>
            </>
          )}
        </div>
        <div style={{ height: gridHeight, width: "100%" }}>
          <AgGridReact
            { ...DEFAULT_GRID_PROPS }
            rowData={filteredCharters}
            columnDefs={columnDefs}
            domLayout="normal"
            headerHeight={40}
            onSelectionChanged={(ev: any) => {
              // Selection bar UI can be added later when email recipients strategy is defined for charters
            }}
            context={{
              componentName: 'charters-grid'
            }}
            defaultColDef={DEFAULT_COL_DEF}
          />
        </div>
      </div>
    </main>
  );
}
