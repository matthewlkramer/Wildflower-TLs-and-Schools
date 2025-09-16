import type { ICellRendererParams, IFilterParams, ValueGetterParams, ValueFormatterParams } from "ag-grid-community";
import type { School, Educator } from "@/types/ui-schema";

export interface SchoolCellRendererParams extends ICellRendererParams {
  data: School;
  value: any;
}

export interface EducatorCellRendererParams extends ICellRendererParams {
  data: Educator;
  value: any;
}

export interface SchoolValueGetterParams extends ValueGetterParams {
  data: School;
}

export interface EducatorValueGetterParams extends ValueGetterParams {
  data: Educator;
}

export interface CustomFilterParams extends IFilterParams {
  values?: string[];
  textFormatter?: (value: any) => string;
  defaultOption?: string;
}

export interface GridSelectionEvent {
  api: {
    getSelectedRows: () => School[] | Educator[];
  };
}
