import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { baseGridOptions } from './ag-grid-defaults';

import 'ag-grid-community/styles/ag-theme-material.css';

type GridBaseProps<T> = {
  columnDefs: ColDef<T>[];
  rowData: T[];
  gridOptions?: GridOptions<T>;
  className?: string;
};

export function GridBase<T>({ columnDefs, rowData, gridOptions, className }: GridBaseProps<T>) {
  return (
    <div className={"ag-theme-material " + (className ?? '')} style={{ height: '70vh', width: '100%' }}>
      <AgGridReact<T>
        columnDefs={columnDefs}
        rowData={rowData}
        {...baseGridOptions}
        {...gridOptions}
      />
    </div>
  );
}
