import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, UserMinus, Trash2 } from "lucide-react";
import { RoleMultiSelectInline } from "@/components/shared/grid/RoleMultiSelectInline";
import { YesNoSelectInline } from "@/components/shared/grid/YesNoSelectInline";
import { DateInputInline } from "@/components/shared/grid/DateInputInline";
import { TL_ROLE_OPTIONS } from "@/constants/roles";
import React from "react";

export type AssociationRow = {
  id: string;
  educatorId?: string;
  educatorName?: string;
  schoolId?: string;
  schoolShortName?: string;
  roles?: string[] | string | null;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  stageStatus?: string | null;
  emailAtSchool?: string | null;
  phone?: string | null;
};

type Props = {
  mode: 'byEducator' | 'bySchool';
  rows: AssociationRow[];
  loading?: boolean;
  onOpen?: (row: AssociationRow) => void;
  onEdit?: (row: AssociationRow) => void;
  onEndStint?: (row: AssociationRow) => void;
  onDelete?: (row: AssociationRow) => void;
  onChangeRow?: (rowId: string, patch: Partial<AssociationRow>) => void;
};

const RolesCell = ({ value }: ICellRendererParams<AssociationRow, any>) => {
  const rolesVal = value;
  if (!rolesVal) return '-';
  const arr = Array.isArray(rolesVal) ? rolesVal : String(rolesVal).split(',').map(s => s.trim()).filter(Boolean);
  if (!arr.length) return '-';
  return (
    <div className="flex flex-wrap gap-1">
      {arr.map((r, i) => (
        <Badge key={i} variant="secondary" className="text-[10px] py-0.5 px-1.5">{r}</Badge>
      ))}
    </div>
  );
};

export function AssociationGrid({ mode, rows, loading, onOpen, onEdit, onEndStint, onDelete, onChangeRow }: Props) {
  const columns: ColDef<AssociationRow>[] = React.useMemo(() => {
    const base: ColDef<AssociationRow>[] = [];
    if (mode === 'byEducator') {
      base.push(
        {
          headerName: 'School', field: 'schoolShortName', flex: 2,
          cellRenderer: (p: ICellRendererParams<AssociationRow>) => {
            const row = p.data!;
            if (!row.schoolId || !row.schoolShortName) return '-';
            return (
              <button className="text-blue-600 hover:underline" onClick={() => onOpen?.(row)}>{row.schoolShortName}</button>
            );
          }
        },
        { headerName: 'Roles', field: 'roles', flex: 2, cellRenderer: (p) => {
          const row = p.data!;
          const values = Array.isArray(row.roles) ? row.roles : (row.roles ? String(row.roles).split(',').map(s=>s.trim()).filter(Boolean) : []);
          return (
            <RoleMultiSelectInline
              options={TL_ROLE_OPTIONS}
              value={values}
              onChange={(next) => onChangeRow?.(row.id, { roles: next })}
            />
          );
        }},
        { headerName: 'Start Date', field: 'startDate', width: 140, cellRenderer: (p) => (
          <DateInputInline value={p.value || ''} onChange={(v) => onChangeRow?.(p.data!.id, { startDate: v || null })} />
        )},
        { headerName: 'End Date', field: 'endDate', width: 140, cellRenderer: (p) => (
          <DateInputInline value={p.value || ''} onChange={(v) => onChangeRow?.(p.data!.id, { endDate: v || null })} />
        )},
        { headerName: 'Active', field: 'isActive', width: 110, cellRenderer: (p) => (
          <YesNoSelectInline value={!!p.value} onChange={(next) => onChangeRow?.(p.data!.id, { isActive: next })} />
        )},
        { headerName: 'Stage/Status', field: 'stageStatus', flex: 1, cellRenderer: (p) => (
          <Badge variant="secondary">{p.value || '-'}</Badge>
        )},
      );
    } else {
      base.push(
        {
          headerName: 'Name', field: 'educatorName', flex: 2,
          cellRenderer: (p: ICellRendererParams<AssociationRow>) => {
            const row = p.data!;
            if (!row.educatorId || !row.educatorName) return '-';
            return (
              <button className="text-blue-600 hover:underline" onClick={() => onOpen?.(row)}>{row.educatorName}</button>
            );
          }
        },
        { headerName: 'Roles', field: 'roles', flex: 2, cellRenderer: (p) => {
          const row = p.data!;
          const values = Array.isArray(row.roles) ? row.roles : (row.roles ? String(row.roles).split(',').map(s=>s.trim()).filter(Boolean) : []);
          return (
            <RoleMultiSelectInline
              options={TL_ROLE_OPTIONS}
              value={values}
              onChange={(next) => onChangeRow?.(row.id, { roles: next })}
            />
          );
        }},
        { headerName: 'School email', field: 'emailAtSchool', flex: 2 },
        { headerName: 'Phone', field: 'phone', width: 160 },
        { headerName: 'Start Date', field: 'startDate', width: 140, cellRenderer: (p) => (
          <DateInputInline value={p.value || ''} onChange={(v) => onChangeRow?.(p.data!.id, { startDate: v || null })} />
        )},
        { headerName: 'End Date', field: 'endDate', width: 140, cellRenderer: (p) => (
          <DateInputInline value={p.value || ''} onChange={(v) => onChangeRow?.(p.data!.id, { endDate: v || null })} />
        )},
        { headerName: 'Active', field: 'isActive', width: 110, cellRenderer: (p) => (
          <YesNoSelectInline value={!!p.value} onChange={(next) => onChangeRow?.(p.data!.id, { isActive: next })} />
        )},
      );
    }

    if (onOpen || onEdit || onEndStint || onDelete) {
      base.push({
        headerName: 'Actions', field: 'actions', width: 180, sortable: false, filter: false, resizable: false,
        cellRenderer: (p: ICellRendererParams<AssociationRow>) => {
          const row = p.data!;
          return (
            <div className="flex items-center gap-1">
              {onOpen && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-50" title="Open" onClick={() => onOpen(row)}>
                  <ExternalLink className="h-3 w-3 text-blue-600" />
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-50" title="Edit" onClick={() => onEdit(row)}>
                  <Edit3 className="h-3 w-3 text-green-600" />
                </Button>
              )}
              {onEndStint && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-yellow-50" title="End stint" onClick={() => onEndStint(row)}>
                  <UserMinus className="h-3 w-3 text-yellow-600" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-50" title="Delete" onClick={() => onDelete(row)}>
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              )}
            </div>
          );
        }
      });
    }

    return base;
  }, [mode, onOpen, onEdit, onEndStint, onDelete]);

  return (
    <GridBase theme={themeMaterial} defaultColDef={DEFAULT_COL_DEF} gridProps={{ ...DEFAULT_GRID_PROPS, domLayout: 'autoHeight' }}>
      <AgGridReact rowData={rows} columnDefs={columns} loadingOverlayComponentParams={{ loadingMessage: 'Loading...' }} overlayLoadingTemplate={loading ? '<span class="ag-overlay-loading-center">Loading…</span>' : undefined} />
    </GridBase>
  );
}
