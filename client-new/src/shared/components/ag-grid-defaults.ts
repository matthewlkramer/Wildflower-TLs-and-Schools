import type { ColDef, GridOptions, GetMainMenuItemsParams, MenuItemDef } from 'ag-grid-community';

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 120,
  // Disable automatic type detection to prevent AG Grid warning #48 about object types
  cellDataType: false,
  // Enable text wrapping with 2-line limit
  wrapText: true,
  cellStyle: {
    lineHeight: '1.3',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  } as any,
  valueFormatter: (p: any) => {
    const v = p.value;
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    // Date-like strings -> format as M/D/YYYY
    if (typeof v === 'string') {
      // Extract date part from ISO or plain YYYY-MM-DD
      const m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
      if (m) {
        const year = Number(m[1]);
        const month = Number(m[2]);
        const day = Number(m[3]);
        if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
          return `${month}/${day}/${year}`;
        }
      }
    }
    return v;
  },
};

export const baseGridOptions: GridOptions = {
  headerHeight: 64,
  animateRows: true,
  suppressCellFocus: true,
  // Enable multi-select; disable row-click selection (use checkboxes or keyboard)
  rowSelection: {
    mode: 'multiRow',
    enableClickSelection: false,
    // Use AG Grid's automatic selection column by default
    checkboxes: true,
    headerCheckbox: true,
    selectAll: 'filtered',
    checkboxLocation: 'selectionColumn',
  } as any,
  pagination: true,
  paginationPageSize: 50,
  getMainMenuItems: (params: GetMainMenuItemsParams) => {
    const items: (string | MenuItemDef)[] = [];
    // Keep useful defaults
    const defaults = (params.defaultItems || []) as (string | MenuItemDef)[];
    items.push(...defaults);
    // Add a divider then our Filters entry
    items.push('separator');
    items.push({
      name: 'Filters',
      action: () => {
        try {
          params.api.setSideBarVisible(true);
          params.api.openToolPanel('filters');
        } catch {}
      },
      // Use AG icon class for consistency
      icon: '<span class="ag-icon ag-icon-filter"></span>' as any,
    } as MenuItemDef);
    return items as any;
  },
  defaultColDef,
};
