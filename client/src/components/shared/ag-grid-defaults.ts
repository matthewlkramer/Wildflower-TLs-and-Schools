import { ColDef, themeMaterial } from "ag-grid-community";

export const DEFAULT_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

export const DEFAULT_GRID_PROPS = {
  theme: themeMaterial,
  animateRows: true,
  pagination: false,
  rowHeight: 30,
  headerHeight: 40 as number,
  domLayout: 'autoHeight' as const,
  enableBrowserTooltips: true,
  getRowId: (params: any) => params?.data?.id ?? params?.data?.ID ?? params?.data?.Id,
  // Start with sideBar available but closed by default
  sideBar: {
    hiddenByDefault: false,
    toolPanels: [
      { id: 'columns', labelDefault: 'Columns', iconKey: 'columns', toolPanel: 'agColumnsToolPanel' },
      { id: 'filters', labelDefault: 'Filters', iconKey: 'filter', toolPanel: 'agFiltersToolPanel' },
    ],
  } as any,
  rowSelection: {
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
    selectAll: 'filtered',
    // Disable click selection; use checkboxes instead
    enableClickSelection: false,
  } as any,
} as const;
