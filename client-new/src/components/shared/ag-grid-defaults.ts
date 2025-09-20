import type { ColDef, GridOptions } from 'ag-grid-community';

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 120,
  valueFormatter: (p: any) => {
    const v = p.value;
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    return v;
  },
};

export const baseGridOptions: GridOptions = {
  rowHeight: 42,
  headerHeight: 48,
  animateRows: true,
  suppressCellFocus: true,
  rowSelection: { mode: 'singleRow', enableClickSelection: false },
  pagination: true,
  paginationPageSize: 50,
  defaultColDef,
};
