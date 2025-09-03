import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";

type GridBaseProps = {
  rowData: any[];
  columnDefs: ColDef<any>[];
  className?: string;
  style?: React.CSSProperties;
  defaultColDefOverride?: ColDef<any>;
  gridProps?: Record<string, any>;
};

export function GridBase({
  rowData,
  columnDefs,
  className,
  style,
  defaultColDefOverride,
  gridProps = {},
  children,
}: GridBaseProps & { children?: React.ReactNode }) {
  return (
    <div className={`ag-theme-material w-full ${className || ''}`.trim()} style={style}>
      {children ? (
        children
      ) : (
        <AgGridReact
          {...DEFAULT_GRID_PROPS}
          {...gridProps}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ ...DEFAULT_COL_DEF, ...(defaultColDefOverride || {}) }}
        />
      )}
    </div>
  );
}
