// Common AG Grid utilities and configurations

import type { ColDef, GridOptions } from "ag-grid-community";
import { formatDate, formatPhoneNumber } from "@shared/utils";

/**
 * Default grid options for all AG Grid tables
 */
export const defaultGridOptions: GridOptions = {
  // Row appearance
  rowHeight: 42,
  suppressRowHoverHighlight: false,
  
  // Selection
  rowSelection: {
    mode: 'multiRow',
    // disable selecting rows by clicking anywhere; rely on checkbox/explicit UI
    // For AG Grid v34, click selection control lives under rowSelection options
    ...( { enableClickSelection: false } as any ),
  } as any,
  
  // Headers
  headerHeight: 45,
  
  // Scrolling and layout
  suppressHorizontalScroll: false,
  suppressMovableColumns: false,
  
  // Default column properties
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    wrapText: false,
  },
  
  // Performance
  animateRows: true,
  cacheQuickFilter: true,
  
  // Styling
  theme: "legacy",
};

/**
 * Common column definitions
 */
export const commonColumnDefs = {
  id: (field = 'id', headerName = 'ID'): ColDef => ({
    field,
    headerName,
    hide: true,
  }),
  
  name: (field = 'name', headerName = 'Name'): ColDef => ({
    field,
    headerName,
    minWidth: 200,
    flex: 1,
  }),
  
  email: (field = 'email', headerName = 'Email'): ColDef => ({
    field,
    headerName,
    minWidth: 200,
    cellRenderer: (params: any) => {
      if (!params.value) return '';
      return `<a href="mailto:${params.value}" class="text-blue-600 hover:underline">${params.value}</a>`;
    },
  }),
  
  phone: (field = 'phone', headerName = 'Phone'): ColDef => ({
    field,
    headerName,
    minWidth: 150,
    valueFormatter: (params: any) => formatPhoneNumber(params.value),
  }),
  
  date: (field: string, headerName: string): ColDef => ({
    field,
    headerName,
    minWidth: 120,
    valueFormatter: (params: any) => formatDate(params.value),
  }),
  
  boolean: (field: string, headerName: string): ColDef => ({
    field,
    headerName,
    minWidth: 100,
    cellRenderer: (params: any) => {
      if (params.value === true) {
        return '<span class="text-green-600">✓</span>';
      }
      if (params.value === false) {
        return '<span class="text-red-600">✗</span>';
      }
      return '';
    },
  }),
  
  array: (field: string, headerName: string): ColDef => ({
    field,
    headerName,
    minWidth: 200,
    valueFormatter: (params: any) => {
      if (!params.value) return '';
      if (Array.isArray(params.value)) {
        return params.value.join(', ');
      }
      return String(params.value);
    },
  }),
  
  actions: (actions: Array<{
    label: string;
    onClick: (params: any) => void;
    className?: string;
    condition?: (params: any) => boolean;
  }>): ColDef => ({
    headerName: 'Actions',
    field: 'actions',
    sortable: false,
    filter: false,
    resizable: false,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const container = document.createElement('div');
      container.className = 'flex gap-2';
      
      actions.forEach(action => {
        if (action.condition && !action.condition(params)) {
          return;
        }
        
        const button = document.createElement('button');
        button.textContent = action.label;
        button.className = action.className || 'text-blue-600 hover:underline text-sm';
        button.onclick = (e) => {
          e.stopPropagation();
          action.onClick(params);
        };
        container.appendChild(button);
      });
      
      return container;
    },
  }),
};

/**
 * Create a text filter configuration
 */
export function createTextFilter() {
  return {
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
      defaultOption: 'contains',
    },
  };
}

/**
 * Create a date filter configuration
 */
export function createDateFilter() {
  return {
    filter: 'agDateColumnFilter',
    filterParams: {
      comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
        if (!cellValue) return -1;
        const cellDate = new Date(cellValue);
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
        return 0;
      },
    },
  };
}

/**
 * Create a number filter configuration
 */
export function createNumberFilter() {
  return {
    filter: 'agNumberColumnFilter',
    filterParams: {
      filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
      defaultOption: 'equals',
    },
  };
}

/**
 * Handle grid errors uniformly
 */
export function handleGridError(error: unknown, context: string) {
  console.error(`AG Grid error in ${context}:`, error);
  // You can add toast notifications here if needed
}
