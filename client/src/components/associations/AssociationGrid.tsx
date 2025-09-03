import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, UserMinus, Trash2, Check, X } from "lucide-react";
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
};

type Props = {
  mode: 'byEducator' | 'bySchool';
  rows: AssociationRow[];
  loading?: boolean;
  editable?: boolean;
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

export function AssociationGrid({ mode, rows, loading, editable = false, onOpen, onEdit, onEndStint, onDelete, onChangeRow }: Props) {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Record<string, Partial<AssociationRow>>>({});
  const isEditingRow = (rowId?: string) => Boolean(editable || (rowId && editingRowId === rowId));

  const beginEdit = (row: AssociationRow) => {
    setEditingRowId(row.id);
    setDraft((prev) => ({
      ...prev,
      [row.id]: {
        roles: Array.isArray(row.roles)
          ? row.roles
          : (row.roles ? String(row.roles).split(',').map(s=>s.trim()).filter(Boolean) : []),
        startDate: row.startDate || null,
        endDate: row.endDate || null,
        isActive: !!row.isActive,
      },
    }));
  };

  const cancelEdit = (rowId: string) => {
    setEditingRowId((id) => (id === rowId ? null : id));
    setDraft((prev) => {
      const n = { ...prev };
      delete n[rowId];
      return n;
    });
  };

  const saveEdit = (rowId: string) => {
    const d = draft[rowId] || {};
    onChangeRow?.(rowId, {
      roles: (d.roles as string[]) || undefined,
      startDate: (d.startDate as string | null) ?? undefined,
      endDate: (d.endDate as string | null) ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
    });
    cancelEdit(rowId);
  };
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
        { headerName: 'Roles', field: 'roles', flex: 2, valueFormatter: (p) => {
          const v = (p as any).value;
          const arr = Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
          return arr.join(', ');
        }, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) {
            const v = (p as any).value;
            const arr = Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
            return <span>{arr.join(', ') || '-'}</span> as any;
          }
          const row = p.data!;
          const d = draft[row.id] || {};
          const values = Array.isArray(d.roles) ? (d.roles as string[]) : (Array.isArray(row.roles) ? row.roles : (row.roles ? String(row.roles).split(',').map(s=>s.trim()).filter(Boolean) : []));
          return (
            <RoleMultiSelectInline
              options={TL_ROLE_OPTIONS}
              value={values}
              onChange={(next) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), roles: next } }))}
            />
          );
        }},
        { headerName: 'Start Date', field: 'startDate', width: 140, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value || '-'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          return (
            <DateInputInline value={(d.startDate as string) || (row.startDate || '')} onChange={(v) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), startDate: v || null } }))} />
          );
        } },
        { headerName: 'End Date', field: 'endDate', width: 140, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value || '-'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          return (
            <DateInputInline value={(d.endDate as string) || (row.endDate || '')} onChange={(v) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), endDate: v || null } }))} />
          );
        } },
        { headerName: 'Active', field: 'isActive', width: 110, valueFormatter: (p) => (p.value ? 'Yes' : 'No'), cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value ? 'Yes' : 'No'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          const val = typeof d.isActive === 'boolean' ? d.isActive : !!row.isActive;
          return (
            <YesNoSelectInline value={val} onChange={(next) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), isActive: next } }))} />
          );
        } },
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
        { headerName: 'Roles', field: 'roles', flex: 2, valueFormatter: (p) => {
          const v = (p as any).value;
          const arr = Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
          return arr.join(', ');
        }, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) {
            const v = (p as any).value;
            const arr = Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
            return <span>{arr.join(', ') || '-'}</span> as any;
          }
          const row = p.data!;
          const d = draft[row.id] || {};
          const values = Array.isArray(d.roles) ? (d.roles as string[]) : (Array.isArray(row.roles) ? row.roles : (row.roles ? String(row.roles).split(',').map(s=>s.trim()).filter(Boolean) : []));
          return (
            <RoleMultiSelectInline
              options={TL_ROLE_OPTIONS}
              value={values}
              onChange={(next) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), roles: next } }))}
            />
          );
        }},
        { headerName: 'School email', field: 'emailAtSchool', flex: 2 },
        { headerName: 'Start Date', field: 'startDate', width: 140, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value || '-'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          return (
            <DateInputInline value={(d.startDate as string) || (row.startDate || '')} onChange={(v) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), startDate: v || null } }))} />
          );
        } },
        { headerName: 'End Date', field: 'endDate', width: 140, cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value || '-'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          return (
            <DateInputInline value={(d.endDate as string) || (row.endDate || '')} onChange={(v) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), endDate: v || null } }))} />
          );
        } },
        { headerName: 'Active', field: 'isActive', width: 110, valueFormatter: (p) => (p.value ? 'Yes' : 'No'), cellRenderer: (p) => {
          if (!isEditingRow(p.data?.id)) return <span>{p.value ? 'Yes' : 'No'}</span> as any;
          const row = p.data!;
          const d = draft[row.id] || {};
          const val = typeof d.isActive === 'boolean' ? d.isActive : !!row.isActive;
          return (
            <YesNoSelectInline value={val} onChange={(next) => setDraft((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] || {}), isActive: next } }))} />
          );
        } },
      );
    }

    if (onOpen || onEdit || onEndStint || onDelete) {
      base.push({
        headerName: 'Actions', field: 'actions', width: 180, sortable: false, filter: false, resizable: false,
        cellRenderer: (p: ICellRendererParams<AssociationRow>) => {
          const row = p.data!;
          const rowIsEditing = isEditingRow(row.id);
          return (
            <div className="flex items-center gap-1">
              {onOpen && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-50" title="Open" onClick={() => onOpen(row)}>
                  <ExternalLink className="h-3 w-3 text-blue-600" />
                </Button>
              )}
              {rowIsEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-green-50"
                    title="Save"
                    onClick={() => saveEdit(row.id)}
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-50"
                    title="Cancel"
                    onClick={() => cancelEdit(row.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-green-50"
                  title="Edit"
                  onClick={() => { beginEdit(row); onEdit?.(row); }}
                >
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
    <GridBase
      rowData={rows}
      columnDefs={columns}
      defaultColDefOverride={DEFAULT_COL_DEF}
      gridProps={{
        ...DEFAULT_GRID_PROPS,
        domLayout: 'autoHeight',
        loadingOverlayComponentParams: { loadingMessage: 'Loading...' },
        overlayLoadingTemplate: loading ? '<span class="ag-overlay-loading-center">Loading.</span>' : undefined,
      }}
    />
  );
}
