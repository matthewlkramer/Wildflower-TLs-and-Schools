import { useQuery } from "@tanstack/react-query";
import { TableCard } from "@/components/shared/TableCard";
import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import React from "react";

type QueryKey = ReadonlyArray<string | number>;

interface GridTableCardProps<T> {
  title: string;
  description?: string;
  actionsRight?: React.ReactNode;
  queryKey: QueryKey;
  fetchUrl?: string;
  fetcher?: () => Promise<T[]>;
  columns: ColDef<T>[];
  emptyText?: string;
  gridProps?: Partial<AgGridReactProps<T>>;
}

export function GridTableCard<T = any>({
  title,
  description,
  actionsRight,
  queryKey,
  fetchUrl,
  fetcher,
  columns,
  emptyText = "No records found.",
  gridProps = {},
}: GridTableCardProps<T>) {
  const { data = [], isLoading, refetch } = useQuery<T[]>({
    queryKey,
    queryFn: async () => {
      if (fetcher) return fetcher();
      if (!fetchUrl) return [] as T[];
      const res = await fetch(fetchUrl, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch: ${fetchUrl}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <TableCard title={title} description={description} actionsRight={actionsRight}>
        <div className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </TableCard>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <TableCard title={title} description={description} actionsRight={actionsRight}>
        <div className="p-4 text-sm text-slate-500">{emptyText}</div>
      </TableCard>
    );
  }

  return (
    <TableCard title={title} description={description} actionsRight={actionsRight}>
      <div style={{ width: "100%" }}>
        <AgGridReact<T>
          theme={themeMaterial}
          rowData={data}
          columnDefs={columns}
          animateRows
          rowSelection={{ enableClickSelection: false } as any}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={30}
          context={{ refresh: () => refetch() }}
          defaultColDef={{ sortable: true, resizable: true, filter: true }}
          {...(gridProps as any)}
        />
      </div>
    </TableCard>
  );
}
