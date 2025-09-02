/**
 * Comprehensive detail page for a school. Loads the school record by id and sets
 * up forms for editing core fields using `react-hook-form` with zod validation.
 * Multiple tabs break out related data: Summary (branding + map), Locations, and
 * Guides, each delegating to the tab components in `components/school/tabs`.
 * The page wires Add New options to modals for assigning existing educators or
 * creating-and-assigning new ones. It also exposes various grids (e.g., TL
 * associations) and uses `useTableRefresh` to keep subtable data fresh after
 * mutations.
 */
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit, Trash2, Plus, X, ExternalLink, UserMinus, Calendar, School2, User, Edit2, Eye, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AgGridReact } from "ag-grid-react";
import type { ICellEditorReactComp } from "ag-grid-react";
import type { ColDef, ICellEditorParams, ICellRendererParams, RowValueChangedEvent } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { isAgGridEnterpriseEnabled } from "@/lib/ag-grid-enterprise";

import { Link } from "wouter";
import React, { useState, useEffect, useMemo } from "react";
import { RoleMultiSelectInline } from "@/components/shared/grid/RoleMultiSelectInline";
import { YesNoSelectInline } from "@/components/shared/grid/YesNoSelectInline";
import { ActiveBadge } from "@/components/shared/grid/ActiveBadge";
import { DateInputInline } from "@/components/shared/grid/DateInputInline";
import { GridBase } from "@/components/shared/GridBase";
import { TL_ROLE_OPTIONS } from "@/constants/roles";
import { useAgGridFeatures } from "@/hooks/use-aggrid-features";
import { insertSchoolSchema, type School, type Teacher, type TeacherSchoolAssociation, type Location, type GuideAssignment, type GovernanceDocument, type SchoolNote, type Grant, type Loan, type MembershipFeeByYear, type MembershipFeeUpdate, type ActionStep, type Tax990 } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { addNewEmitter } from "@/lib/add-new-emitter";

import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import { GoogleMap } from "@/components/google-map";
import { EntityCard } from "@/components/shared/EntityCard";
import { DetailGrid } from "@/components/shared/DetailGrid";
import AssignEducatorModal from "@/components/assign-educator-modal";
import CreateAndAssignEducatorModal from "@/components/create-and-assign-educator-modal";
import { SchoolTLsAssociationGrid } from "@/components/school/SchoolTLsAssociationGrid";
import { TableCard } from "@/components/shared/TableCard";
import { SummaryTab } from "@/components/school/tabs/SummaryTab";
import { LocationsTab } from "@/components/school/tabs/LocationsTab";
import { GuidesTab } from "@/components/school/tabs/GuidesTab";
import { useTableRefresh, refreshSchoolData } from "@/hooks/use-table-refresh";
function LocationsGrid({
  locations,
  onUpdate,
  onDelete,
}: {
  locations: Location[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}) {
  type LocRow = {
    id: string;
    address?: string;
    currentPhysicalAddress?: boolean;
    currentMailingAddress?: boolean;
    startDate?: string;
    endDate?: string;
  };
  const rows: LocRow[] = (locations || []).map(l => ({
    id: l.id,
    address: l.address || '',
    currentPhysicalAddress: !!l.currentPhysicalAddress,
    currentMailingAddress: !!l.currentMailingAddress,
    startDate: l.startDate || '',
    endDate: l.endDate || '',
  }));

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, LocRow>>({});
  const getDraft = (r: LocRow) => drafts[r.id] || r;

  // Use Enterprise Set Filter for booleans

  const columnDefs: ColDef<LocRow>[] = [
    { headerName: 'Address', field: 'address', flex: 2, filter: 'agTextColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return (
            <Input className="h-7" value={d.address || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, address: e.target.value } }))} />
          );
        }
        return d.address || '-';
      }
    },
    { headerName: 'Current Physical', field: 'currentPhysicalAddress', width: 150, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.currentPhysicalAddress ? 'Yes' : 'No'),
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return (
            <YesNoSelectInline value={!!d.currentPhysicalAddress} onChange={(next) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, currentPhysicalAddress: next } }))} />
          );
        }
        return <ActiveBadge active={!!row.currentPhysicalAddress} />;
      }
    },
    { headerName: 'Current Mailing', field: 'currentMailingAddress', width: 150, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.currentMailingAddress ? 'Yes' : 'No'),
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return (
            <YesNoSelectInline value={!!d.currentMailingAddress} onChange={(next) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, currentMailingAddress: next } }))} />
          );
        }
        return <ActiveBadge active={!!row.currentMailingAddress} />;
      }
    },
    { headerName: 'Start Date', field: 'startDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.startDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, startDate: v } }))} />
        }
        return d.startDate || '-';
      }
    },
    { headerName: 'End Date', field: 'endDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.endDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, endDate: v } }))} />
        }
        return d.endDate || '-';
      }
    },
    { headerName: 'Actions', field: 'id', width: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<LocRow>) => {
        const row = p.data as LocRow;
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            {!isEditing ? (
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); setEditingRowId(row.id); }}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-700" title="Save" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const d = drafts[row.id]; if (d) { onUpdate(row.id, { address: d.address, currentPhysicalAddress: !!d.currentPhysicalAddress, currentMailingAddress: !!d.currentMailingAddress, startDate: d.startDate || '', endDate: d.endDate || '' }); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); } }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Cancel" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" title="Delete" onClick={() => onDelete(row.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      }
    },
  ];

  return (
    <div className="border rounded-lg p-3">
      <GridBase
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
        gridProps={{
          domLayout: 'autoHeight',
          singleClickEdit: false,
          stopEditingWhenCellsLoseFocus: false,
          getRowHeight: (p: any) => (editingRowId && p.data && p.data.id === editingRowId ? 80 : (DEFAULT_GRID_PROPS.rowHeight as number)),
        }}
      />
    </div>
  );
}

// AG Grid for Guides tab
function GuidesGrid({
  assignments,
  onUpdate,
  onDelete,
}: {
  assignments: GuideAssignment[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}) {
  type GuideRow = {
    id: string;
    guideShortName?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  };

  const rows: GuideRow[] = (assignments || []).map((g) => ({
    id: g.id,
    guideShortName: g.guideShortName || g.guideId,
    type: g.type || '',
    startDate: g.startDate || '',
    endDate: g.endDate || '',
    isActive: !!g.isActive,
  }));

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, GuideRow>>({});
  const getDraft = (r: GuideRow) => drafts[r.id] || r;

  // Use Enterprise Set Filter for booleans

  const columnDefs: ColDef<GuideRow>[] = [
    { headerName: 'Guide', field: 'guideShortName', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Type', field: 'type', flex: 1, filter: 'agTextColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <Input className="h-7" value={d.type || ''} onChange={(e) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, type: e.target.value } }))} />
        }
        return d.type || '-';
      }
    },
    { headerName: 'Start Date', field: 'startDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.startDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, startDate: v } }))} />
        }
        return d.startDate || '-';
      }
    },
    { headerName: 'End Date', field: 'endDate', width: 140, filter: 'agDateColumnFilter',
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <DateInputInline value={d.endDate || ''} onChange={(v) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, endDate: v } }))} />
        }
        return d.endDate || '-';
      }
    },
    { headerName: 'Active', field: 'isActive', width: 110, filter: 'agSetColumnFilter',
      valueGetter: (p) => (p.data?.isActive ? 'Yes' : 'No'),
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow; const d = getDraft(row);
        if (editingRowId === row.id) {
          return <YesNoSelectInline value={!!d.isActive} onChange={(next) => setDrafts(prev => ({ ...prev, [row.id]: { ...d, isActive: next } }))} />
        }
        return <ActiveBadge active={!!row.isActive} />;
      }
    },
    { headerName: 'Actions', field: 'id', width: 140, sortable: false, filter: false,
      cellRenderer: (p: ICellRendererParams<GuideRow>) => {
        const row = p.data as GuideRow;
        const isEditing = editingRowId === row.id;
        return (
          <div className="flex gap-1">
            {!isEditing ? (
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrafts(prev => ({ ...prev, [row.id]: { ...row } })); setEditingRowId(row.id); }}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-700" title="Save" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const d = drafts[row.id]; if (d) { onUpdate(row.id, { type: d.type || '', startDate: d.startDate || '', endDate: d.endDate || '', isActive: !!d.isActive }); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); } }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Cancel" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingRowId(null); setDrafts(prev => { const cp={...prev}; delete cp[row.id]; return cp; }); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" title="Delete" onClick={() => onDelete(row.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      }
    },
  ];

  return (
    <div className="border rounded-lg p-3">
      <GridBase
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
        gridProps={{
          domLayout: 'autoHeight',
          singleClickEdit: false,
          stopEditingWhenCellsLoseFocus: false,
          getRowHeight: (p: any) => (editingRowId && p.data && p.data.id === editingRowId ? 80 : (DEFAULT_GRID_PROPS.rowHeight as number)),
        }}
      />
    </div>
  );
}
// TeacherAssociationRow component for inline editing
function TeacherAssociationRow({ 
  association, 
  teacher,
  school,
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  onEndStint,
  isSaving 
}: {
  association: TeacherSchoolAssociation;
  teacher?: Teacher;
  school: School;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  onEndStint: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    role: association.role || '',
    startDate: association.startDate || '',
    endDate: association.endDate || '',
    isActive: association.isActive || false
  });

  useEffect(() => {
    setEditData({
      role: association.role || '',
      startDate: association.startDate || '',
      endDate: association.endDate || '',
      isActive: association.isActive || false
    });
  }, [association]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          {teacher ? (
            <Link 
              href={`/teacher/${teacher.id}`}
              className="text-wildflower-blue hover:underline"
            >
              {teacher.fullName || teacher.firstName + ' ' + teacher.lastName}
            </Link>
          ) : (
            <Link 
              href={`/teacher/${association.educatorId}`}
              className="text-wildflower-blue hover:underline"
            >
              {association.educatorName || association.educatorId}
            </Link>
          )}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray((school as any)?.fieldOptions?.roles) ? (school as any).fieldOptions.roles : ['TL','ETL','Classroom Staff','Fellow','Other'])
              .map((opt: string) => {
                const rolesArr: string[] = Array.isArray(editData.role)
                  ? editData.role
                  : String(editData.role || '').split(',').map((s) => s.trim()).filter(Boolean);
                const checked = rolesArr.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const next = checked ? rolesArr.filter(r => r !== opt) : Array.from(new Set([...rolesArr, opt]));
                      setEditData(prev => ({ ...prev, role: next }));
                    }}
                    className={`px-2 py-1 rounded border text-xs ${checked ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-slate-300 text-slate-700'}`}
                  >
                    {opt}
                  </button>
                );
              })}
          </div>
        </TableCell>
        
        <TableCell>
          <Input
            value={(teacher as any)?.currentPrimaryEmailAddress || ''}
            disabled
            placeholder="Email"
            className="h-8 bg-gray-50"
          />
        </TableCell>
        <TableCell>
          <Input
            value={teacher?.primaryPhone || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, primaryPhone: e.target.value }))}
            placeholder="Phone"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.isActive ? "true" : "false"}
            onValueChange={(value) => setEditData(prev => ({ ...prev, isActive: value === "true" }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        {teacher ? (
          <Link 
            href={`/teacher/${teacher.id}`}
            className="text-wildflower-blue hover:underline"
          >
            {teacher.fullName}
          </Link>
        ) : (
          <Link 
            href={`/teacher/${association.educatorId}`}
            className="text-wildflower-blue hover:underline"
          >
            {association.educatorName || association.educatorId}
          </Link>
        )}
      </TableCell>
      <TableCell>
        {association.role ? (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(association.role) ? (
              association.role.flatMap((roleString, arrayIndex) => 
                roleString.split(',').map((role, roleIndex) => {
                  const trimmedRole = role.trim();
                  // No special-casing of roles
                  return (
                    <Badge key={`${arrayIndex}-${roleIndex}`} variant="secondary" className="text-xs">
                      {trimmedRole}
                    </Badge>
                  );
                }).filter(Boolean)
              )
            ) : typeof association.role === 'string' ? (
              association.role.split(',').map((role, index) => {
                const trimmedRole = role.trim();
                // No special-casing of roles
                return (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trimmedRole}
                  </Badge>
                );
              }).filter(Boolean)
            ) : (
              // Handle non-string roles
              (<Badge variant="secondary" className="text-xs">
                {String(association.role)}
              </Badge>)
            )}
          </div>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        {}
        {/* Founder flag removed */}
      </TableCell>
      <TableCell>
        {(teacher as any)?.currentPrimaryEmailAddress || '-'}
      </TableCell>
      <TableCell>
        {teacher?.primaryPhone || '-'}
      </TableCell>
      <TableCell>{association.startDate || '-'}</TableCell>
      <TableCell>{association.endDate || '-'}</TableCell>
      <TableCell>
        <Badge 
          variant={association.isActive ? "default" : "secondary"}
          className={association.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {association.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (teacher) {
                window.open(`/teacher/${teacher.id}`, '_blank');
              } else {
                window.open(`/teacher/${association.educatorId}`, '_blank');
              }
            }}
            disabled={!teacher && !association.educatorId}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
            onClick={onEndStint}
            title="End stint"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={onDelete}
            title="Delete stint"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// GuideAssignmentRow component for inline editing
function GuideAssignmentRow({ 
  assignment, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  assignment: GuideAssignment;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    guideShortName: assignment.guideShortName || '',
    type: assignment.type || '',
    startDate: assignment.startDate || '',
    endDate: assignment.endDate || '',
    isActive: assignment.isActive || false
  });

  useEffect(() => {
    setEditData({
      guideShortName: assignment.guideShortName || '',
      type: assignment.type || '',
      startDate: assignment.startDate || '',
      endDate: assignment.endDate || '',
      isActive: assignment.isActive || false
    });
  }, [assignment]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.guideShortName}
            onChange={(e) => setEditData(prev => ({ ...prev, guideShortName: e.target.value }))}
            placeholder="Guide short name"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.type}
            onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Type"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.isActive ? "true" : "false"}
            onValueChange={(value) => setEditData(prev => ({ ...prev, isActive: value === "true" }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{assignment.guideShortName || '-'}</TableCell>
      <TableCell>{assignment.type || '-'}</TableCell>
      <TableCell>{assignment.startDate || '-'}</TableCell>
      <TableCell>{assignment.endDate || '-'}</TableCell>
      <TableCell>
        <Badge 
          variant={assignment.isActive ? "default" : "secondary"}
          className={assignment.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {assignment.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// LocationRow component for inline editing
function LocationRow({ 
  location, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  location: Location;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    address: location.address || "",
    currentPhysicalAddress: location.currentPhysicalAddress || false,
    currentMailingAddress: location.currentMailingAddress || false,
    startDate: location.startDate || "",
    endDate: location.endDate || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        address: location.address || "",
        currentPhysicalAddress: location.currentPhysicalAddress || false,
        currentMailingAddress: location.currentMailingAddress || false,
        startDate: location.startDate || "",
        endDate: location.endDate || "",
      });
    }
  }, [isEditing, location]);

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.address}
            onChange={(e) => setEditData({...editData, address: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <input
            type="checkbox"
            checked={editData.currentPhysicalAddress}
            onChange={(e) => setEditData({...editData, currentPhysicalAddress: e.target.checked})}
            className="h-4 w-4"
          />
        </TableCell>
        <TableCell>
          <input
            type="checkbox"
            checked={editData.currentMailingAddress}
            onChange={(e) => setEditData({...editData, currentMailingAddress: e.target.checked})}
            className="h-4 w-4"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData({...editData, startDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData({...editData, endDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave(editData)}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{location.address || '-'}</TableCell>
      <TableCell>
        <input 
          type="checkbox" 
          checked={location.currentPhysicalAddress || false} 
          readOnly 
          className="h-4 w-4"
        />
      </TableCell>
      <TableCell>
        <input 
          type="checkbox" 
          checked={location.currentMailingAddress || false} 
          readOnly 
          className="h-4 w-4"
        />
      </TableCell>
      <TableCell>{location.startDate || '-'}</TableCell>
      <TableCell>{location.endDate || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// GovernanceDocumentRow component for inline editing
function GovernanceDocumentRow({ 
  document, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  document: GovernanceDocument;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    docType: document.docType || "",
    dateEntered: document.dateEntered || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        docType: document.docType || "",
        dateEntered: document.dateEntered || "",
      });
    }
  }, [isEditing, document]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editData.docType}
            onChange={(e) => setEditData({...editData, docType: e.target.value})}
            placeholder="Document Type"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.dateEntered}
            onChange={(e) => setEditData({...editData, dateEntered: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="h-8">
      <TableCell className="py-1">
        {document.docUrl ? (
          <a 
            href={document.docUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            {document.docType || '-'}
          </a>
        ) : (
          document.docType || '-'
        )}
      </TableCell>
      <TableCell className="py-1">{document.dateEntered || '-'}</TableCell>
      <TableCell className="py-1">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Tax990Row component for inline editing
function Tax990Row({ 
  tax990, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  tax990: Tax990;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    year: tax990.year || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        year: tax990.year || "",
      });
    }
  }, [isEditing, tax990]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow className="h-8">
        <TableCell>
          <Input
            value={editData.year}
            onChange={(e) => setEditData({...editData, year: e.target.value})}
            placeholder="Year"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="h-8">
      <TableCell className="py-1 text-sm">
        {tax990.attachmentUrl ? (
          <a 
            href={tax990.attachmentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            {tax990.year || '-'}
          </a>
        ) : (
          tax990.year || '-'
        )}
      </TableCell>
      <TableCell className="py-1">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// SchoolNoteRow component for inline editing
function SchoolNoteRow({ 
  note, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  note: SchoolNote;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    dateCreated: note.dateCreated || "",
    createdBy: note.createdBy || "",
    notes: note.notes || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        dateCreated: note.dateCreated || "",
        createdBy: note.createdBy || "",
        notes: note.notes || "",
      });
    }
  }, [isEditing, note]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="date"
            value={editData.dateCreated}
            onChange={(e) => setEditData({...editData, dateCreated: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.createdBy}
            onChange={(e) => setEditData({...editData, createdBy: e.target.value})}
            placeholder="Created By"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.notes}
            onChange={(e) => setEditData({...editData, notes: e.target.value})}
            placeholder="Notes"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{note.dateCreated || '-'}</TableCell>
      <TableCell>{note.createdBy || '-'}</TableCell>
      <TableCell>{note.notes || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// GrantRow component for inline editing
function GrantRow({ 
  grant, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  grant: Grant;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    amount: grant.amount || 0,
    issuedDate: grant.issuedDate || "",
    issuedBy: grant.issuedBy || "",
    status: grant.status || "",
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        amount: grant.amount || 0,
        issuedDate: grant.issuedDate || "",
        issuedBy: grant.issuedBy || "",
        status: grant.status || "",
      });
    }
  }, [isEditing, grant]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
            placeholder="Amount"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="date"
            value={editData.issuedDate}
            onChange={(e) => setEditData({...editData, issuedDate: e.target.value})}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.issuedBy}
            onChange={(e) => setEditData({...editData, issuedBy: e.target.value})}
            placeholder="Issued By"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.status}
            onChange={(e) => setEditData({...editData, status: e.target.value})}
            placeholder="Status"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{grant.amount ? `$${grant.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{grant.issuedDate || '-'}</TableCell>
      <TableCell>{grant.issuedBy || '-'}</TableCell>
      <TableCell>{grant.status || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            title="Open"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// LoanRow component for inline editing
function LoanRow({ 
  loan, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  isSaving 
}: {
  loan: Loan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    amount: loan.amount || 0,
    status: loan.status || "",
    interestRate: loan.interestRate || 0,
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        amount: loan.amount || 0,
        status: loan.status || "",
        interestRate: loan.interestRate || 0,
      });
    }
  }, [isEditing, loan]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
            placeholder="Amount"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.status}
            onChange={(e) => setEditData({...editData, status: e.target.value})}
            placeholder="Status"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={editData.interestRate}
            onChange={(e) => setEditData({...editData, interestRate: parseFloat(e.target.value) || 0})}
            placeholder="Interest Rate"
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{loan.amount ? `$${loan.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{loan.status || '-'}</TableCell>
      <TableCell>{loan.interestRate ? `${loan.interestRate}%` : '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            title="Open"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const [locationDeleteModalOpen, setLocationDeleteModalOpen] = useState(false);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);
  const [isAssociatingTeacher, setIsAssociatingTeacher] = useState(false);
  const [preselectedEducatorId, setPreselectedEducatorId] = useState<string | undefined>(undefined);
  const [isCreatingGuideAssignment, setIsCreatingGuideAssignment] = useState(false);
  const [editingAssociationId, setEditingAssociationId] = useState<string | null>(null);
  const [deletingAssociationId, setDeletingAssociationId] = useState<string | null>(null);
  const [associationDeleteModalOpen, setAssociationDeleteModalOpen] = useState(false);
  
  // Edit states for different sections
  const [editingSupport, setEditingSupport] = useState(false);
  const [editingSystems, setEditingSystems] = useState(false);
  const [editingSystemsComm, setEditingSystemsComm] = useState(false);
  const [editingSystemsFinance, setEditingSystemsFinance] = useState(false);
  const [editingSystemsBranding, setEditingSystemsBranding] = useState(false);
  const [editingSupportOverview, setEditingSupportOverview] = useState(false);
  const [editingSupportTimeline, setEditingSupportTimeline] = useState(false);
  const [editingSupportFacility, setEditingSupportFacility] = useState(false);
  const [editingSupportFunding, setEditingSupportFunding] = useState(false);
  const [editingDetailsProgram, setEditingDetailsProgram] = useState(false);
  const [editingDetailsLegal, setEditingDetailsLegal] = useState(false);
  // Toggle for About language (English vs Spanish)
  const [aboutLang, setAboutLang] = useState<'en' | 'es'>('en');
  const [editingDetailsContact, setEditingDetailsContact] = useState(false);
  
  // Form data for editing
  const [editFormData, setEditFormData] = useState<any>({});
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [guideDeleteModalOpen, setGuideDeleteModalOpen] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [documentDeleteModalOpen, setDocumentDeleteModalOpen] = useState(false);
  
  // Tax 990s state
  const [editingTax990Id, setEditingTax990Id] = useState<string | null>(null);
  const [deletingTax990Id, setDeletingTax990Id] = useState<string | null>(null);
  const [tax990DeleteModalOpen, setTax990DeleteModalOpen] = useState(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [isCreating990, setIsCreating990] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [noteDeleteModalOpen, setNoteDeleteModalOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingGrantId, setEditingGrantId] = useState<string | null>(null);
  const [deletingGrantId, setDeletingGrantId] = useState<string | null>(null);
  const [grantDeleteModalOpen, setGrantDeleteModalOpen] = useState(false);
  const [isCreatingGrant, setIsCreatingGrant] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [deletingLoanId, setDeletingLoanId] = useState<string | null>(null);
  const [loanDeleteModalOpen, setLoanDeleteModalOpen] = useState(false);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [newLocation, setNewLocation] = useState({
    address: "",
    currentPhysicalAddress: false,
    currentMailingAddress: false,
    startDate: "",
    endDate: "",
  });
  const [newDocument, setNewDocument] = useState({
    docType: "",
    doc: "",
    dateEntered: "",
  });
  const [new990, setNew990] = useState({
    year: "",
    attachment: "",
    attachmentUrl: "",
  });
  const [newNote, setNewNote] = useState({
    dateCreated: "",
    createdBy: "",
    notes: "",
  });
  const [selectedNote, setSelectedNote] = useState<SchoolNote | null>(null);
  const [selectedActionStep, setSelectedActionStep] = useState<ActionStep | null>(null);
  const [newGrant, setNewGrant] = useState({
    amount: 0,
    issuedDate: "",
    issuedBy: "",
    status: "",
  });
  const [newLoan, setNewLoan] = useState({
    amount: 0,
    status: "",
    interestRate: 0,
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  // Validation function
  const validateField = (fieldName: string, value: any): string => {
    switch (fieldName) {
      case 'EIN':
        if (value && !/^\d{2}-\d{7}$/.test(value)) {
          return 'EIN must be in format XX-XXXXXXX';
        }
        break;
      case 'numberOfClassrooms':
      case 'enrollmentCap':
        if (value && (isNaN(value) || value < 0)) {
          return 'Must be a positive number';
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Must be a valid email address';
        }
        break;
      case 'incorporationDate':
      case 'groupExemptionDateGranted':
      case 'groupExemptionDateWithdrawn':
      case 'dateReceivedGroupExemption':
      case 'dateWithdrawnGroupExemption':
        if (value && isNaN(Date.parse(value))) {
          return 'Must be a valid date';
        }
        break;
    }
    return '';
  };

  // Helper function to check if field has validation error
  const hasValidationError = (fieldName: string): boolean => {
    return Boolean(validationErrors[fieldName]);
  };

  // Helper function to get error styling
  const getFieldErrorStyle = (fieldName: string): string => {
    return hasValidationError(fieldName) 
      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
      : '';
  };

  // Validate field on change and update errors
  const handleFieldChange = (fieldName: string, value: any) => {
    const error = validateField(fieldName, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    setEditedDetails({ ...editedDetails, [fieldName]: value });
  };

  // Validate existing data when entering edit mode
  useEffect(() => {
    if (isEditingDetails && editedDetails) {
      const errors: Record<string, string> = {};
      Object.keys(editedDetails).forEach(key => {
        const error = validateField(key, editedDetails[key]);
        if (error) {
          errors[key] = error;
        }
      });
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [isEditingDetails, editedDetails]);

  // Update Add New options when active tab changes
  useEffect(() => {
    const getAddNewOptions = () => {
      switch (activeTab) {
        case "tls":
          return [
            { label: "Create New Educator at This School", onClick: () => setIsCreatingTeacher(true) },
            { label: "Assign Educator to This School", onClick: () => setIsAssociatingTeacher(true) }
          ];
        case "locations":
          return [{ label: "Add Location", onClick: () => setIsCreatingLocation(true) }];
        case "governance":
          return [
            { label: "Add Governance Document", onClick: () => setIsCreatingDocument(true) },
            { label: "Add 990", onClick: () => setIsCreating990(true) }
          ];
        case "guides":
          return [{ label: "Add Guide Assignment", onClick: () => setIsCreatingGuideAssignment(true) }];
        case "notes":
          return [
            { label: "Add Note", onClick: () => setIsCreatingNote(true) },
            { label: "Add Action Step", onClick: () => console.log("Add Action Step clicked - Modal not implemented yet") }
          ];
        case "grants":
          return [
            { label: "Add Grant", onClick: () => setIsCreatingGrant(true) },
            { label: "Add Loan", onClick: () => setIsCreatingLoan(true) }
          ];
        case "membership":
          return []; // No add functionality on this tab
        case "summary":
        case "details":
        case "support":
        case "systems":
          return []; // These tabs have no add functionality
        default:
          return [];
      }
    };

    const options = getAddNewOptions();
    addNewEmitter.setOptions(options);

    // Cleanup when component unmounts
    return () => {
      addNewEmitter.setOptions([]);
    };
  }, [activeTab]);


  const { data: school, isLoading } = useQuery<School>({
    queryKey: ["/api/schools", id],
    queryFn: async () => {
      const response = await fetch(`/api/schools/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch school");
      return response.json();
    },
  });

  const { data: associations, isLoading: associationsLoading, refetch: refetchAssociations } = useQuery<TeacherSchoolAssociation[]>({
    queryKey: [`/api/school-associations/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/school-associations/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch associations");
      return response.json();
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: teachers } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const { data: locations, isLoading: locationsLoading, refetch: refetchLocations } = useQuery<Location[]>({
    queryKey: [`/api/locations/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/locations/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: guideAssignments, isLoading: guidesLoading } = useQuery<GuideAssignment[]>({
    queryKey: [`/api/guide-assignments/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/guide-assignments/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch guide assignments");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: governanceDocuments, isLoading: documentsLoading } = useQuery<GovernanceDocument[]>({
    queryKey: [`/api/governance-documents/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/governance-documents/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch governance documents");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: grants, isLoading: grantsLoading } = useQuery<Grant[]>({
    queryKey: [`/api/grants/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/grants/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch grants");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: loans, isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: [`/api/loans/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/loans/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch loans");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: schoolNotes, isLoading: notesLoading } = useQuery<SchoolNote[]>({
    queryKey: [`/api/school-notes/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/school-notes/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch school notes");
      return response.json();
    },
    enabled: !!id,
  });

  // Membership Fees data
  const { data: membershipFeesByYear, isLoading: feesLoading } = useQuery<MembershipFeeByYear[]>({
    queryKey: [`/api/membership-fees-by-year/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/membership-fees-by-year/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch membership fees");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: membershipFeeUpdates, isLoading: updatesLoading } = useQuery<MembershipFeeUpdate[]>({
    queryKey: [`/api/membership-fee-updates/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/membership-fee-updates/school/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch membership fee updates");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: actionSteps, isLoading: actionStepsLoading } = useQuery<ActionStep[]>({
    queryKey: [`/api/action-steps/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/action-steps/school/${id}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch action steps");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: tax990s, isLoading: tax990sLoading } = useQuery<Tax990[]>({
    queryKey: [`/api/tax-990s/school/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/tax-990s/school/${id}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch 990s");
      return response.json();
    },
    enabled: !!id,
  });

  // Metadata for dropdown options
  const { data: fieldOptions } = useQuery<any>({
    queryKey: ["/api/metadata/school-field-options"],
    queryFn: async () => {
      const response = await fetch("/api/metadata/school-field-options", { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch field options");
      return response.json();
    },
  });

  const form = useForm({
    resolver: zodResolver(insertSchoolSchema),
    defaultValues: {
      name: school?.name || "",
      address: school?.address || "",
      city: school?.city || "",
      state: school?.state || "",
      zipCode: school?.zipCode || "",
      status: school?.status || "Active",
      phone: school?.phone || "",
      email: school?.email || "",
    },
  });



  const updateSchoolMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/schools/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schools", id] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "School updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update school",
        variant: "destructive",
      });
    },
  });

  const updateSchoolDetailsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/schools/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schools", id] });
      setIsEditingDetails(false);
      setEditedDetails(null);
      toast({
        title: "Success",
        description: "School details updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update school details",
        variant: "destructive",
      });
    },
  });

  const deleteSchoolMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/schools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    },
  });

  // Location mutations
  const createLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/locations", { ...data, schoolId: id });
    },
    onSuccess: () => {
      // Force immediate refetch
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      queryClient.refetchQueries({ queryKey: [`/api/locations/school/${id}`] });
      
      setIsCreatingLocation(false);
      setNewLocation({
        address: "",
        currentPhysicalAddress: false,
        currentMailingAddress: false,
        startDate: "",
        endDate: "",
      });
      toast({
        title: "Success",
        description: "Location created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ locationId, data }: { locationId: string; data: any }) => {
      return await apiRequest("PUT", `/api/locations/${locationId}`, data);
    },
    onSuccess: () => {
      // Force immediate refetch
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      queryClient.refetchQueries({ queryKey: [`/api/locations/school/${id}`] });
      
      setEditingLocationId(null);
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      return await apiRequest("DELETE", `/api/locations/${locationId}`);
    },
    onSuccess: () => {
      // Force immediate refetch
      queryClient.invalidateQueries({ queryKey: [`/api/locations/school/${id}`] });
      queryClient.refetchQueries({ queryKey: [`/api/locations/school/${id}`] });
      
      setLocationDeleteModalOpen(false);
      setDeletingLocationId(null);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    },
  });

  const updateAssociationMutation = useMutation({
    mutationFn: async ({ associationId, data }: { associationId: string; data: any }) => {
      return await apiRequest("PUT", `/api/teacher-school-associations/${associationId}`, data);
    },
    onSuccess: () => {
      // Invalidate and refetch with both query key formats
      queryClient.invalidateQueries({ queryKey: [`/api/school-associations/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      queryClient.refetchQueries({ queryKey: [`/api/school-associations/${id}`] });
      
      setEditingAssociationId(null);
      toast({
        title: "Success",
        description: "Teacher association updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update teacher association",
        variant: "destructive",
      });
    },
  });

  const deleteAssociationMutation = useMutation({
    mutationFn: async (associationId: string) => {
      return await apiRequest("DELETE", `/api/teacher-school-associations/${associationId}`);
    },
    onSuccess: () => {
      // Invalidate and force refetch
      queryClient.invalidateQueries({ queryKey: [`/api/school-associations/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      queryClient.refetchQueries({ queryKey: [`/api/school-associations/${id}`] });
      
      setAssociationDeleteModalOpen(false);
      setDeletingAssociationId(null);
      toast({
        title: "Success",
        description: "Teacher association deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher association",
        variant: "destructive",
      });
    },
  });

  const endStintMutation = useMutation({
    mutationFn: async (associationId: string) => {
      const today = new Date().toISOString().split('T')[0];
      return await apiRequest("PUT", `/api/teacher-school-associations/${associationId}`, {
        endDate: today,
        isActive: false
      });
    },
    onSuccess: () => {
      // Invalidate and force refetch
      queryClient.invalidateQueries({ queryKey: [`/api/school-associations/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/school-associations", id] });
      queryClient.refetchQueries({ queryKey: [`/api/school-associations/${id}`] });
      
      toast({
        title: "Success",
        description: "Teacher stint ended successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to end teacher stint",
        variant: "destructive",
      });
    },
  });

  const updateGuideAssignmentMutation = useMutation({
    mutationFn: async ({ guideId, data }: { guideId: string; data: any }) => {
      return await apiRequest("PUT", `/api/guide-assignments/${guideId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guide-assignments/school/${id}`] });
      setEditingGuideId(null);
      toast({
        title: "Success",
        description: "Guide assignment updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update guide assignment",
        variant: "destructive",
      });
    },
  });

  const deleteGuideAssignmentMutation = useMutation({
    mutationFn: async (guideId: string) => {
      return await apiRequest("DELETE", `/api/guide-assignments/${guideId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/guide-assignments/school/${id}`] });
      setGuideDeleteModalOpen(false);
      setDeletingGuideId(null);
      toast({
        title: "Success",
        description: "Guide assignment deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete guide assignment",
        variant: "destructive",
      });
    },
  });

  // Governance document mutations
  const createGovernanceDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/governance-documents", {
        ...data,
        schoolId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setIsCreatingDocument(false);
      setNewDocument({ docType: "", doc: "", dateEntered: "" });
      toast({
        title: "Success",
        description: "Governance document created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create governance document",
        variant: "destructive",
      });
    },
  });

  const updateGovernanceDocumentMutation = useMutation({
    mutationFn: async ({ documentId, data }: { documentId: string; data: any }) => {
      return await apiRequest("PATCH", `/api/governance-documents/${documentId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setEditingDocumentId(null);
      toast({
        title: "Success",
        description: "Governance document updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update governance document",
        variant: "destructive",
      });
    },
  });

  const deleteGovernanceDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("DELETE", `/api/governance-documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/governance-documents/school/${id}`] });
      setDocumentDeleteModalOpen(false);
      setDeletingDocumentId(null);
      toast({
        title: "Success",
        description: "Governance document deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete governance document",
        variant: "destructive",
      });
    },
  });

  // Tax 990s mutations
  const updateTax990Mutation = useMutation({
    mutationFn: async ({ tax990Id, data }: { tax990Id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/tax-990s/${tax990Id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tax-990s/school/${id}`] });
      setEditingTax990Id(null);
      toast({
        title: "Success",
        description: "990 updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update 990",
        variant: "destructive",
      });
    },
  });

  const deleteTax990Mutation = useMutation({
    mutationFn: async (tax990Id: string) => {
      return await apiRequest("DELETE", `/api/tax-990s/${tax990Id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tax-990s/school/${id}`] });
      setTax990DeleteModalOpen(false);
      setDeletingTax990Id(null);
      toast({
        title: "Success",
        description: "990 deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete 990",
        variant: "destructive",
      });
    },
  });

  // Sort grants by issuedDate (newest first)
  const sortedGrants = useMemo(() => {
    const list = Array.isArray(grants) ? [...grants] : [];
    list.sort((a, b) => {
      const da = a?.issuedDate ? Date.parse(a.issuedDate) : 0;
      const db = b?.issuedDate ? Date.parse(b.issuedDate) : 0;
      return db - da; // descending: newest first
    });
    return list;
  }, [grants]);

  // Create Action Step state and mutation
  const [isCreatingAction, setIsCreatingAction] = useState(false);
  const [newAction, setNewAction] = useState<{ item: string; assignee: string; dueDate: string; status: string }>({ item: "", assignee: "", dueDate: "", status: "Pending" });
  const createActionStepMutation = useMutation({
    mutationFn: async (data: { item: string; assignee: string; dueDate: string; status: string }) => {
      return await apiRequest("POST", "/api/action-steps", { ...data, schoolId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/action-steps/school/${id}`] });
      setIsCreatingAction(false);
      setNewAction({ item: "", assignee: "", dueDate: "", status: "Pending" });
      toast({ title: "Success", description: "Action step created" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create action step", variant: "destructive" });
    }
  });

  // Grant mutations
  const createGrantMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/grants", { ...data, schoolId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/grants/school/${id}`] });
      setIsCreatingGrant(false);
      setNewGrant({ amount: 0, issuedDate: "", issuedBy: "", status: "" });
      toast({ title: "Success", description: "Grant created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create grant", variant: "destructive" });
    },
  });

  const onSubmit = (data: any) => {
    updateSchoolMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteSchoolMutation.mutate();
    setShowDeleteModal(false);
  };

  // Helper function to handle section editing
  const handleEditSection = (section: string) => {
    if (!school) return;
    
    switch (section) {
      case 'program':
        setEditingDetailsProgram(true);
        setEditFormData({
          programFocus: school.programFocus || '',
          schoolCalendar: school.schoolCalendar || '',
          schoolSchedule: school.schoolSchedule || '',
          agesServed: school.agesServed || [],
          numberOfClassrooms: school.numberOfClassrooms || '',
          enrollmentCap: school.enrollmentCap || ''
        });
        break;
      case 'legal':
        setEditingDetailsLegal(true);
        setEditFormData({
          legalStructure: school.legalStructure || '',
          currentFYEnd: school.currentFYEnd || '',
          governanceModel: school.governanceModel || '',
          groupExemptionStatus: school.groupExemptionStatus || '',
          groupExemptionDateGranted: school.groupExemptionDateGranted || '',
          groupExemptionDateWithdrawn: school.groupExemptionDateWithdrawn || ''
        });
        break;
      case 'contact':
        setEditingDetailsContact(true);
        setEditFormData({
          primaryContactName: school.primaryContactName || '',
          primaryContactEmail: school.primaryContactEmail || '',
          primaryContactPhone: school.primaryContactPhone || '',
          website: school.website || '',
          facebook: school.facebook || '',
          instagram: school.instagram || ''
        });
        break;
      case 'support':
        setEditingSupport(true);
        setEditFormData({
          ssjTool: school.ssjTool || '',
          ssjStage: school.ssjStage || '',
          ssjOpsGuideTrack: school.ssjOpsGuideTrack || [],
          ssjReadinessRating: school.ssjReadinessRating || '',
          ssjOriginalProjectedOpenDate: school.ssjOriginalProjectedOpenDate || '',
          ssjProjOpenSchoolYear: school.ssjProjOpenSchoolYear || '',
          ssjProjectedOpen: school.ssjProjectedOpen || ''
        });
        break;
      case 'systems':
        setEditingSystems(true);
        setEditFormData({
          googleVoice: school.googleVoice || '',
          googleEmail: school.googleEmail || '',
          googleDrive: school.googleDrive || '',
          quickBooks: school.quickBooks || '',
          mailchimp: school.mailchimp || '',
          website: school.website || ''
        });
        break;
    }
  };

  const handleSaveSection = () => {
    updateSchoolMutation.mutate(editFormData);
  };

  const handleCancelEdit = () => {
    setEditingSupport(false);
    setEditingSystems(false);
    setEditingSystemsComm(false);
    setEditingSystemsFinance(false);
    setEditingSystemsBranding(false);
    setEditingSupportOverview(false);
    setEditingSupportTimeline(false);
    setEditingSupportFacility(false);
    setEditingSupportFunding(false);
    setEditingDetailsProgram(false);
    setEditingDetailsLegal(false);
    setEditingDetailsContact(false);
    setEditFormData({});
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">School not found</h2>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-200 overflow-x-auto">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-wildflower-blue px-3 py-3 flex-shrink-0">
                    {school.name}
                  </h1>
                  <TabsList className="flex bg-transparent h-auto p-0 w-max">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="tls" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    TLs
                  </TabsTrigger>
                  <TabsTrigger value="locations" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Locations
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Docs
                  </TabsTrigger>
                  <TabsTrigger value="guides" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Guides
                  </TabsTrigger>
                  <TabsTrigger value="support" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    SSJ
                  </TabsTrigger>

                  <TabsTrigger value="grants" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Grants/Loans
                  </TabsTrigger>
                  <TabsTrigger value="membership" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Membership Fees
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Notes/Actions
                  </TabsTrigger>
                  <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                    Linked Email/Meetings
                  </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-6">
                <TabsContent value="summary" className="mt-0">
                  <SummaryTab school={school} />
                </TabsContent>

                {/* Details */}
                {/* Details */}
                <TabsContent value="details" className="mt-0">
                  <DetailGrid>
                    <EntityCard title="Name" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'name', label: 'School Name', type: 'readonly', value: school.name },
                      { key: 'shortName', label: 'Short Name', type: 'readonly', value: school.shortName || '' },
                      { key: 'priorNames', label: 'Prior Names', type: 'readonly', value: (school as any).priorNames || '' },
                    ]} />

                    <EntityCard title="Program Details" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'governanceModel', label: 'Governance', type: 'readonly', value: school.governanceModel || '' },
                      { key: 'agesServed', label: 'Ages Served', type: 'readonly', value: school.agesServed?.join(', ') || '' },
                      { key: 'programFocus', label: 'Program Focus', type: 'readonly', value: Array.isArray(school.programFocus) ? school.programFocus.join(', ') : (school.programFocus || '') },
                      { key: 'numberOfClassrooms', label: 'Number of Classrooms', type: 'readonly', value: (school as any).numberOfClassrooms ?? '' },
                      { key: 'enrollmentCap', label: 'Enrollment Capacity', type: 'readonly', value: (school as any).enrollmentCap ?? '' },
                      { key: 'currentEnrollment', label: 'Current Enrollment', type: 'readonly', value: (school as any).currentEnrollment ?? '' },
                      { key: 'status', label: 'School Status', type: 'readonly', value: (school as any).status || '' },
                      { key: 'stageStatus', label: 'Stage/Status', type: 'readonly', value: (school as any).stageStatus || '' },
                      { key: 'openDate', label: 'Open Date', type: 'readonly', value: school.openDate || '' },
                    ]} />

                    <EntityCard title="Legal Entity Structure" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'institutionalPartner', label: 'Institutional Partner', type: 'readonly', value: (school as any).institutionalPartner || '' },
                      { key: 'charterId', label: 'Charter ID', type: 'readonly', value: (school as any).charterId || '' },
                    ]} />

                    <EntityCard title="Nonprofit Status" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'membershipStatus', label: 'Membership Status', type: 'readonly', value: (school as any).membershipStatus || '' },
                      { key: 'groupExemptionStatus', label: 'Group Exemption Status', type: 'readonly', value: (school as any).groupExemptionStatus || '' },
                      { key: 'groupExemptionDateGranted', label: 'Date Granted', type: 'readonly', value: (school as any).groupExemptionDateGranted || '' },
                      { key: 'groupExemptionDateWithdrawn', label: 'Date Withdrawn', type: 'readonly', value: (school as any).groupExemptionDateWithdrawn || '' },
                      { key: 'leftNetworkDate', label: 'Left Network Date', type: 'readonly', value: (school as any).leftNetworkDate || '' },
                      { key: 'leftNetworkReason', label: 'Left Network Reason', type: 'readonly', value: (school as any).leftNetworkReason || '' },
                    ]} />

                    <EntityCard title="School Contact Information" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'phone', label: 'School Phone', type: 'readonly', value: (school as any).phone || '' },
                      { key: 'email', label: 'School Email', type: 'readonly', value: (school as any).email || '' },
                      { key: 'activePhysicalAddress', label: 'Address', type: 'readonly', value: (school as any).activePhysicalAddress || '' },
                    ]} />

                    <EntityCard title="Online Presence" columns={1} editable={false} showDivider={false} fields={[
                      { key: 'website', label: 'Website', type: 'readonly', value: (school as any).website || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
                      { key: 'instagram', label: 'Instagram', type: 'readonly', value: (school as any).instagram || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
                      { key: 'facebook', label: 'Facebook', type: 'readonly', value: (school as any).facebook || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
                    ]} />
                  </DetailGrid>
                </TabsContent>

                <TabsContent value="tls" className="mt-0">
                  {associationsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : associations && associations.length > 0 ? (
                    <div className="border rounded-lg p-3">
                      <SchoolTLsAssociationGrid 
                        school={school} 
                        associations={associations}
                        teachers={teachers || []}
                        onUpdateAssociation={(associationId: string, data: any) => updateAssociationMutation.mutate({ associationId, data })}
                        onEndStint={(associationId: string) => endStintMutation.mutate(associationId)}
                        onDeleteAssociation={(associationId: string) => { setDeletingAssociationId(associationId); setAssociationDeleteModalOpen(true); }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>No teachers found for this school.</p>
                      <p className="text-sm mt-2">Use the Add menu or modals to create or assign educators.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="locations" className="mt-0">
                  <div className="space-y-4">
                    {isCreatingLocation && (
                      <div className="flex flex-wrap items-end gap-2 p-3 border rounded-md bg-slate-50">
                        <div className="flex-1 min-w-[240px]">
                          <label className="block text-xs text-slate-600">Address</label>
                          <Input value={newLocation.address} onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} className="h-8" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600">Current Physical</label>
                          <input type="checkbox" checked={newLocation.currentPhysicalAddress} onChange={(e) => setNewLocation({ ...newLocation, currentPhysicalAddress: e.target.checked })} className="h-4 w-4 mt-2" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600">Current Mailing</label>
                          <input type="checkbox" checked={newLocation.currentMailingAddress} onChange={(e) => setNewLocation({ ...newLocation, currentMailingAddress: e.target.checked })} className="h-4 w-4 mt-2" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600">Start Date</label>
                          <Input type="date" value={newLocation.startDate} onChange={(e) => setNewLocation({ ...newLocation, startDate: e.target.value })} className="h-8" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600">End Date</label>
                          <Input type="date" value={newLocation.endDate} onChange={(e) => setNewLocation({ ...newLocation, endDate: e.target.value })} className="h-8" />
                        </div>
                        <div className="ml-auto flex gap-2">
                          <Button size="sm" onClick={() => createLocationMutation.mutate(newLocation)} disabled={createLocationMutation.isPending}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => { setIsCreatingLocation(false); setNewLocation({ address: "", currentPhysicalAddress: false, currentMailingAddress: false, startDate: "", endDate: "" }); }}>Cancel</Button>
                        </div>
                      </div>
                    )}

                    {locationsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : (
                      <LocationsTab
                        locations={locations || []}
                        onUpdate={(id, data) => updateLocationMutation.mutate({ locationId: id, data })}
                        onDelete={(id) => { setDeletingLocationId(id); setLocationDeleteModalOpen(true); }}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Governance Documents - Left Column */}
                    <div className="space-y-4">
                      {documentsLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : (
                        <TableCard
                          title="Governance Documents"
                          actionsRight={
                            <Button size="sm" onClick={() => setIsCreatingDocument(true)}>
                              Add Document
                            </Button>
                          }
                        >
                          <Table>
                              <TableHeader>
                                <TableRow className="h-8">
                                  <TableHead className="h-8 py-1">Document title</TableHead>
                                  <TableHead className="h-8 py-1">Date</TableHead>
                                  <TableHead className="h-8 py-1 w-16">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingDocument && (
                                  <TableRow className="h-8">
                                    <TableCell className="py-1">
                                      <Input
                                        value={newDocument.docType}
                                        onChange={(e) => setNewDocument({...newDocument, docType: e.target.value})}
                                        placeholder="Document Type"
                                        className="h-7 text-sm"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <Input
                                        type="date"
                                        value={newDocument.dateEntered}
                                        onChange={(e) => setNewDocument({...newDocument, dateEntered: e.target.value})}
                                        className="h-7 text-sm"
                                      />
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => createGovernanceDocumentMutation.mutate(newDocument)}
                                          disabled={createGovernanceDocumentMutation.isPending}
                                          className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingDocument(false);
                                            setNewDocument({ docType: "", doc: "", dateEntered: "" });
                                          }}
                                          disabled={createGovernanceDocumentMutation.isPending}
                                          className="h-6 px-2 text-xs"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {governanceDocuments && governanceDocuments.length > 0 ? (
                                  governanceDocuments
                                    .sort((a, b) => {
                                      // Sort by document type alphabetically
                                      const typeA = (a.docType || '').toLowerCase();
                                      const typeB = (b.docType || '').toLowerCase();
                                      return typeA.localeCompare(typeB);
                                    })
                                    .map((document) => (
                                    <GovernanceDocumentRow
                                      key={document.id}
                                      document={document}
                                      isEditing={editingDocumentId === document.id}
                                      onEdit={() => setEditingDocumentId(document.id)}
                                      onSave={(data) => updateGovernanceDocumentMutation.mutate({ documentId: document.id, data })}
                                      onCancel={() => setEditingDocumentId(null)}
                                      onDelete={() => {
                                        setDeletingDocumentId(document.id);
                                        setDocumentDeleteModalOpen(true);
                                      }}
                                      isSaving={updateGovernanceDocumentMutation.isPending}
                                    />
                                  ))
                                ) : (
                                  <TableRow className="h-8">
                                    <TableCell colSpan={3} className="text-center text-gray-500 py-4 text-sm">
                                      No governance documents found
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                        </TableCard>
                      )}
                    </div>

                    {/* 990s - Right Column */}
                    <div className="space-y-4">
                      <TableCard
                        title="990s"
                        actionsRight={<Button size="sm" onClick={() => setIsCreating990(true)}>Add 990</Button>}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow className="h-8">
                              <TableHead className="h-8 py-1">Year</TableHead>
                              <TableHead className="h-8 py-1 w-16">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isCreating990 && (
                              <TableRow className="h-8">
                                <TableCell className="py-1">
                                  <Input
                                    value={new990.year}
                                    onChange={(e) => setNew990({...new990, year: e.target.value})}
                                    placeholder="Year"
                                    className="h-7 text-sm"
                                  />
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // TODO: Implement create 990 API call
                                        setIsCreating990(false);
                                        setNew990({ year: "", attachment: "", attachmentUrl: "" });
                                      }}
                                      className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setIsCreating990(false);
                                        setNew990({ year: "", attachment: "", attachmentUrl: "" });
                                      }}
                                      className="h-7 px-2"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                            {tax990sLoading ? (
                              <TableRow className="h-8">
                                <TableCell colSpan={2} className="text-center py-2">
                                  Loading 990s...
                                </TableCell>
                              </TableRow>
                            ) : tax990s && tax990s.length > 0 ? (
                              tax990s
                                .sort((a, b) => {
                                  // Sort by year descending (most recent first)
                                  const yearA = parseInt(a.year || '0');
                                  const yearB = parseInt(b.year || '0');
                                  return yearB - yearA;
                                })
                                .map((tax990) => (
                                <Tax990Row
                                  key={tax990.id}
                                  tax990={tax990}
                                  isEditing={editingTax990Id === tax990.id}
                                  onEdit={() => setEditingTax990Id(tax990.id)}
                                  onSave={(data) => updateTax990Mutation.mutate({ tax990Id: tax990.id, data })}
                                  onCancel={() => setEditingTax990Id(null)}
                                  onDelete={() => {
                                    setDeletingTax990Id(tax990.id);
                                    setTax990DeleteModalOpen(true);
                                  }}
                                  isSaving={updateTax990Mutation.isPending}
                                />
                              ))
                            ) : isCreating990 ? null : (
                              <TableRow className="h-8">
                                <TableCell colSpan={2} className="text-center text-gray-500 py-4 text-sm">
                                  No 990s found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCard>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="mt-0">
                  <div className="space-y-4">
                    {guidesLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : (guideAssignments && guideAssignments.length > 0) ? (
                      <GuidesTab
                        assignments={guideAssignments}
                        onUpdate={(id, data) => updateGuideAssignmentMutation.mutate({ guideId: id, data })}
                        onDelete={(id) => { setDeletingGuideId(id); setGuideDeleteModalOpen(true); }}
                      />
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No guide assignments found for this school.</p>
                        <p className="text-sm mt-2">Click "Assign Guide" to create the first guide assignment.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="support" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* High Priority Fields */}
                    <EntityCard
                      title="High Priority Fields"
                      columns={3}
                      showDivider={false}
                      fields={[
                        { key: 'ssjStage', label: 'SSJ Stage', type: 'text', value: school?.ssjStage ?? '' },
                        { key: 'status', label: 'School Status', type: 'text', value: school?.status ?? '' },
                        { key: 'ssjProjectedOpen', label: 'Projected Open Date', type: 'date', value: school?.ssjProjectedOpen ?? '' },
                        { key: 'ssjReadinessRating', label: 'Readiness to Open', type: 'text', value: school?.ssjReadinessRating ?? '' },
                      ]}
                      onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)}
                    />
                    {/* Timeline & Milestones */}
                    <EntityCard
                      title="Timeline & Milestones"
                      columns={3}
                      showDivider={false}
                      fields={[
                        { key: 'ssjOriginalProjectedOpenDate', label: 'Original Projected Open Date', type: 'date', value: school?.ssjOriginalProjectedOpenDate ?? '' },
                        { key: 'ssjProjectedOpen', label: 'Projected Open Date', type: 'date', value: school?.ssjProjectedOpen ?? '' },
                        { key: 'openDate', label: 'Open Date', type: 'date', value: school?.openDate ?? '' },
                        { key: 'enteredVisioningDate', label: 'Entered Visioning', type: 'date', value: school?.enteredVisioningDate ?? '' },
                        { key: 'enteredPlanningDate', label: 'Entered Planning', type: 'date', value: school?.enteredPlanningDate ?? '' },
                        { key: 'enteredStartupDate', label: 'Entered Startup', type: 'date', value: school?.enteredStartupDate ?? '' },
                      ]}
                      onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)}
                    />

                    

                    {/* Funding & Financial */}
                    <EntityCard
                      title="Funding & Financial Planning"
                      columns={1}
                      showDivider={false}
                      fields={[
                        { key: 'budgetLink', label: 'Budget Link', type: 'text', value: school?.budgetLink ?? '' },
                      ]}
                      onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)}
                    />

                    {/* Albums */}
                    <EntityCard
                      title="Albums"
                      columns={2}
                      showDivider={false}
                      fields={[
                        { key: 'planningAlbum', label: 'Planning Album', type: 'text', value: school?.planningAlbum ?? '' },
                        { key: 'visioningAlbum', label: 'Visioning Album', type: 'text', value: school?.visioningAlbum ?? '' },
                      ]}
                      onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)}
                    />

                    {/* Cohorts */}
                    <EntityCard
                      title="Cohorts"
                      columns={2}
                      showDivider={false}
                      fields={[
                        { key: 'cohorts', label: 'Cohorts', type: 'multiselect', value: school?.cohorts ?? [], placeholder: 'Comma separated list' },
                        { key: 'ssjOpsGuideTrack', label: 'Ops Guide Track', type: 'multiselect', value: school?.ssjOpsGuideTrack ?? [], placeholder: 'Comma separated list' },
                      ]}
                      onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)}
                    />
                  </div>
                </TabsContent>



                <TabsContent value="grants" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Grants Table */}
                      <TableCard
                        title="Grants"
                        actionsRight={
                          <div className="flex items-center gap-2">
                            {!isCreatingGrant && (
                              <Button size="sm" onClick={() => setIsCreatingGrant(true)}>
                                Add Grant
                              </Button>
                            )}
                          </div>
                        }
                      >
                        {grantsLoading ? (
                          <div className="space-y-3 p-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : (grants && grants.length > 0) || isCreatingGrant ? (
                          <Table>
                              <TableHeader>
                                <TableRow>
                                <TableHead>Amount</TableHead>
                                  <TableHead>Issued Date</TableHead>
                                  <TableHead>Issued By</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingGrant && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={newGrant.amount}
                                        onChange={(e) => setNewGrant({...newGrant, amount: parseFloat(e.target.value) || 0})}
                                        placeholder="Grant amount"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="date"
                                        value={newGrant.issuedDate}
                                        onChange={(e) => setNewGrant({...newGrant, issuedDate: e.target.value})}
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newGrant.issuedBy}
                                        onChange={(e) => setNewGrant({...newGrant, issuedBy: e.target.value})}
                                        placeholder="Issued By"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newGrant.status}
                                        onChange={(e) => setNewGrant({...newGrant, status: e.target.value})}
                                        placeholder="Status"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                       <Button
                                         size="sm"
                                         onClick={() => createGrantMutation.mutate(newGrant)}
                                         className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                       >
                                         Save
                                       </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingGrant(false);
                                            setNewGrant({ amount: 0, issuedDate: "", issuedBy: "", status: "" });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                               {sortedGrants.map((grant) => (
                                 <GrantRow
                                   key={grant.id}
                                    grant={grant}
                                    isEditing={editingGrantId === grant.id}
                                    onEdit={() => setEditingGrantId(grant.id)}
                                    onSave={(data) => {/* grant update mutation */}}
                                    onCancel={() => setEditingGrantId(null)}
                                    onDelete={() => {
                                      setDeletingGrantId(grant.id);
                                      setGrantDeleteModalOpen(true);
                                    }}
                                    isSaving={false}
                                  />
                                ))}
                              </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No grants found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Grant" button above to create grants.</p>
                          </div>
                        )}
                      </TableCard>

                      {/* Loans Table */}
                      <TableCard title="Loans">
                        {loansLoading ? (
                          <div className="space-y-3 p-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : (loans && loans.length > 0) || isCreatingLoan ? (
                          <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Loan Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Interest Rate</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingLoan && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={newLoan.amount}
                                        onChange={(e) => setNewLoan({...newLoan, amount: parseFloat(e.target.value) || 0})}
                                        placeholder="Loan amount"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newLoan.status}
                                        onChange={(e) => setNewLoan({...newLoan, status: e.target.value})}
                                        placeholder="Status"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={newLoan.interestRate}
                                        onChange={(e) => setNewLoan({...newLoan, interestRate: parseFloat(e.target.value) || 0})}
                                        placeholder="Interest Rate"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => {/* loan mutation here */}}
                                          className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingLoan(false);
                                            setNewLoan({ amount: 0, status: "", interestRate: 0 });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {loans?.map((loan) => (
                                  <LoanRow
                                    key={loan.id}
                                    loan={loan}
                                    isEditing={editingLoanId === loan.id}
                                    onEdit={() => setEditingLoanId(loan.id)}
                                    onSave={(data) => {/* loan update mutation */}}
                                    onCancel={() => setEditingLoanId(null)}
                                    onDelete={() => {
                                      setDeletingLoanId(loan.id);
                                      setLoanDeleteModalOpen(true);
                                    }}
                                    isSaving={false}
                                  />
                                ))}
                              </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No loans found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Loan" button above to create loans.</p>
                          </div>
                        )}
                      </TableCard>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="membership" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1: Membership Fee by Year Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Membership Fee by Year</h4>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>School Year</TableHead>
                                <TableHead>Fee Amount</TableHead>
                                <TableHead>Exempt?</TableHead>
                                <TableHead>Likelihood of paying</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {feesLoading ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    Loading membership fees...
                                  </TableCell>
                                </TableRow>
                              ) : membershipFeesByYear && membershipFeesByYear.length > 0 ? (
                                membershipFeesByYear.map((fee) => (
                                  <TableRow 
                                    key={fee.id}
                                    className="cursor-pointer hover:bg-slate-50"
                                    onClick={() => console.log("Button clicked - Handler not implemented")}
                                  >
                                    <TableCell>{fee.schoolYear || '-'}</TableCell>
                                    <TableCell>{fee.feeAmount ? `$${fee.feeAmount.toLocaleString()}` : '-'}</TableCell>
                                    <TableCell>
                                      {fee.status && (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          fee.status.toLowerCase().includes('exempt') 
                                            ? fee.status.toLowerCase().includes('non-exempt')
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {fee.status}
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {fee.likelihoodOfPaying ? (
                                        <span className="text-slate-900">
                                          {typeof fee.likelihoodOfPaying === 'number' 
                                            ? `${(fee.likelihoodOfPaying * 100).toFixed(0)}%`
                                            : fee.likelihoodOfPaying
                                          }
                                        </span>
                                      ) : '-'}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-gray-500">
                                    No membership fees found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Column 2: Membership Fee Updates Table */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Membership Fee Updates</h4>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Update Type</TableHead>
                                <TableHead>Attachment</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {updatesLoading ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center">
                                    Loading membership fee updates...
                                  </TableCell>
                                </TableRow>
                              ) : membershipFeeUpdates && membershipFeeUpdates.length > 0 ? (
                                membershipFeeUpdates.map((update) => (
                                  <TableRow key={update.id}>
                                    <TableCell>{update.updateDate || '-'}</TableCell>
                                    <TableCell>{update.updateType || '-'}</TableCell>
                                    <TableCell>
                                      {update.attachment ? (
                                        <a 
                                          href={update.attachment} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                          View Attachment
                                        </a>
                                      ) : '-'}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center text-gray-500">
                                    No membership fee updates found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Column 3: Calculated Fields */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Calculated Fields</h4>
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Total Fees Paid</label>
                            <p className="text-lg font-semibold text-slate-900">$9,800</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Outstanding Balance</label>
                            <p className="text-lg font-semibold text-slate-900">$0</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Average Annual Fee</label>
                            <p className="text-lg font-semibold text-slate-900">$4,900</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Payment History</label>
                            <p className="text-sm text-slate-900">2 years on record</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Next Due Date</label>
                            <p className="text-sm text-slate-900">2025-08-31</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* School Notes Table */}
                      <TableCard title="Notes" actionsRight={<Button size="sm" onClick={() => setIsCreatingNote(true)}>Add Note</Button>}>
                        {notesLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : schoolNotes && schoolNotes.length > 0 || isCreatingNote ? (
                          <Table className="table-fixed w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[15%]">Date</TableHead>
                                  <TableHead className="w-[15%]">Created By</TableHead>
                                  <TableHead className="w-[45%]">Headline</TableHead>
                                  <TableHead className="w-[25%]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {isCreatingNote && (
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="date"
                                        value={newNote.dateCreated}
                                        onChange={(e) => setNewNote({...newNote, dateCreated: e.target.value})}
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newNote.createdBy}
                                        onChange={(e) => setNewNote({...newNote, createdBy: e.target.value})}
                                        placeholder="Created by"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={newNote.notes}
                                        onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                                        placeholder="Note content"
                                        className="h-8"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => {/* note creation mutation */}}
                                          className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setIsCreatingNote(false);
                                            setNewNote({ dateCreated: "", createdBy: "", notes: "" });
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {schoolNotes?.map((note) => (
                                  <TableRow key={note.id}>
                                    <TableCell className="py-1 text-sm">{String(note.dateCreated || '-')}</TableCell>
                                    <TableCell className="py-1 text-sm">{String(note.createdBy || '-')}</TableCell>
                                    <TableCell className="py-1 max-w-0">
                                      <button 
                                        className="text-sm block truncate pr-2 text-left hover:text-blue-600 hover:underline cursor-pointer w-full" 
                                        title={String(note.headline || note.notes || '-')}
                                        onClick={() => setSelectedNote(note)}
                                      >
                                        {String(note.headline || note.notes || '-')}
                                      </button>
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setEditingNoteId(note.id)}
                                          title="Edit note"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                          onClick={() => {/* Mark private */}}
                                          title="Mark as private"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                          onClick={() => {
                                            setDeletingNoteId(note.id);
                                            setNoteDeleteModalOpen(true);
                                          }}
                                          title="Delete note"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No notes found for this school.</p>
                            <p className="text-sm mt-2">Use the "Add Note" button above to create notes.</p>
                          </div>
                        )}
                      </TableCard>

                      {/* Action Steps Table */}
                      <TableCard title="Action Steps" actionsRight={<Button size="sm" onClick={() => setIsCreatingAction(true)}>Add Action</Button>}>
                        {actionStepsLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : actionSteps && actionSteps.length > 0 ? (
                          <Table className="table-fixed w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[35%]">Action item</TableHead>
                                <TableHead className="w-[15%]">Assignee</TableHead>
                                <TableHead className="w-[15%]">Due Date</TableHead>
                                <TableHead className="w-[15%]">Status</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {isCreatingAction && (
                                <TableRow>
                                  <TableCell className="py-1 text-sm">
                                    <Input value={newAction.item} onChange={(e) => setNewAction({ ...newAction, item: e.target.value })} placeholder="Action item" className="h-8" />
                                  </TableCell>
                                  <TableCell className="py-1 text-sm">
                                    <Input value={newAction.assignee} onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })} placeholder="Assignee" className="h-8" />
                                  </TableCell>
                                  <TableCell className="py-1 text-sm">
                                    <Input type="date" value={newAction.dueDate} onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })} className="h-8" />
                                  </TableCell>
                                  <TableCell className="py-1 text-sm">
                                    <Select value={newAction.status} onValueChange={(v) => setNewAction({ ...newAction, status: v })}>
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell className="py-1">
                                    <div className="flex gap-1">
                                      <Button size="sm" className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => createActionStepMutation.mutate(newAction)}>Save</Button>
                                      <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => { setIsCreatingAction(false); setNewAction({ item: "", assignee: "", dueDate: "", status: "Pending" }); }}>Cancel</Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                                {actionSteps
                                  .sort((a, b) => {
                                    // Sort by status (incomplete first) then by due date
                                    if (a.isCompleted !== b.isCompleted) {
                                      return a.isCompleted ? 1 : -1;
                                    }
                                    return (a.dueDate || '').localeCompare(b.dueDate || '');
                                  })
                                  .map((step) => (
                                  <TableRow key={step.id} className="h-8">
                                    <TableCell className="py-1 max-w-0">
                                      <span className="text-sm block truncate pr-2" title={step.item || '-'}>
                                        {step.item || '-'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-1 text-sm">{step.assignee || '-'}</TableCell>
                                    <TableCell className="py-1 text-sm">
                                      {step.dueDate ? new Date(step.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <span className={`inline-flex items-center px-1 py-1 rounded-full text-xs font-medium ${
                                        step.isCompleted 
                                          ? 'bg-green-100 text-green-800' 
                                          : step.status === 'In Progress'
                                          ? 'bg-blue-100 text-blue-800'
                                          : step.status === 'Overdue'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {step.status || 'Pending'}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-1">
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setSelectedActionStep(step)}
                                          title="Open action item details"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => {/* Edit action step */}}
                                          title="Edit action item"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className={`h-6 w-6 p-0 ${
                                            step.isCompleted 
                                              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' 
                                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                                          }`}
                                          onClick={() => {/* Toggle complete status */}}
                                          title={step.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                        >
                                          {step.isCompleted ? <RotateCcw className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                          onClick={() => {/* Delete action step */}}
                                          title="Delete action item"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <p>No action steps found for this school.</p>
                            <p className="text-sm mt-2">Action items will appear here when assigned.</p>
                          </div>
                        )}
                      </TableCard>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="linked" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Linked Email & Meetings</h4>
                    <div className="text-center py-8 text-slate-500">
                      Linked emails and meeting information will be displayed here
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        title="Delete School"
        description="Are you sure you want to delete this school? This action cannot be undone."
        isLoading={deleteSchoolMutation.isPending}
      />
      <DeleteConfirmationModal
        open={locationDeleteModalOpen}
        onOpenChange={setLocationDeleteModalOpen}
        onConfirm={() => {
          if (deletingLocationId) {
            deleteLocationMutation.mutate(deletingLocationId);
          }
        }}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        isLoading={deleteLocationMutation.isPending}
      />
      <DeleteConfirmationModal
        open={associationDeleteModalOpen}
        onOpenChange={setAssociationDeleteModalOpen}
        onConfirm={() => {
          if (deletingAssociationId) {
            deleteAssociationMutation.mutate(deletingAssociationId);
          }
        }}
        title="Delete Teacher Stint"
        description="Are you sure you want to delete this teacher stint? This action cannot be undone."
        isLoading={deleteAssociationMutation.isPending}
      />
      <DeleteConfirmationModal
        open={guideDeleteModalOpen}
        onOpenChange={setGuideDeleteModalOpen}
        onConfirm={() => {
          if (deletingGuideId) {
            deleteGuideAssignmentMutation.mutate(deletingGuideId);
          }
        }}
        title="Delete Guide Assignment"
        description="Are you sure you want to delete this guide assignment? This action cannot be undone."
        isLoading={deleteGuideAssignmentMutation.isPending}
      />
      <DeleteConfirmationModal
        open={documentDeleteModalOpen}
        onOpenChange={setDocumentDeleteModalOpen}
        onConfirm={() => {
          if (deletingDocumentId) {
            deleteGovernanceDocumentMutation.mutate(deletingDocumentId);
          }
        }}
        title="Delete Governance Document"
        description="Are you sure you want to delete this governance document? This action cannot be undone."
        isLoading={deleteGovernanceDocumentMutation.isPending}
      />
      <DeleteConfirmationModal
        open={tax990DeleteModalOpen}
        onOpenChange={setTax990DeleteModalOpen}
        onConfirm={() => {
          if (deletingTax990Id) {
            deleteTax990Mutation.mutate(deletingTax990Id);
          }
        }}
        title="Delete 990"
        description="Are you sure you want to delete this 990 record? This action cannot be undone."
        isLoading={deleteTax990Mutation.isPending}
      />
      {/* Note View Modal */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Note Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Date Created</Label>
                  <p className="text-sm text-slate-900">{selectedNote.dateCreated || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Created By</Label>
                  <p className="text-sm text-slate-900">{selectedNote.createdBy || '-'}</p>
                </div>
              </div>
              {selectedNote.headline && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Headline</Label>
                  <p className="text-sm text-slate-900">{selectedNote.headline}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-slate-600">Full Note</Label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedNote.notes || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Record ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedNote.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Last Modified</Label>
                  <p className="text-xs text-slate-500">{selectedNote.lastModified || '-'}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedNote(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setSelectedNote(null);
                setEditingNoteId(selectedNote.id);
              }}>
                Edit Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Action Step View Modal */}
      {selectedActionStep && (
        <Dialog open={!!selectedActionStep} onOpenChange={() => setSelectedActionStep(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Action Step Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Assignee</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.assignee || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedActionStep.isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : selectedActionStep.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedActionStep.status === 'Overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedActionStep.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Assigned Date</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.assignedDate ? new Date(selectedActionStep.assignedDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Due Date</Label>
                  <p className="text-sm text-slate-900">{selectedActionStep.dueDate ? new Date(selectedActionStep.dueDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Action Item Description</Label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{selectedActionStep.item || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Record ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedActionStep.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">School ID</Label>
                  <p className="text-xs text-slate-500 font-mono">{selectedActionStep.schoolId}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedActionStep(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setSelectedActionStep(null);
                // Could add edit functionality here
              }}>
                Edit Action Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Educator Assignment Modals */}
      <AssignEducatorModal
        open={isAssociatingTeacher}
        onOpenChange={(open) => {
          setIsAssociatingTeacher(open);
          if (!open) {
            setPreselectedEducatorId(undefined); // Clear preselection when modal closes
          }
        }}
        schoolId={id || ""}
        preselectedEducatorId={preselectedEducatorId}
      />
      
      <CreateAndAssignEducatorModal
        open={isCreatingTeacher}
        onOpenChange={setIsCreatingTeacher}
        schoolId={id || ""}
        onSwitchToAssign={(educatorId: string) => {
          setPreselectedEducatorId(educatorId);
          setIsCreatingTeacher(false);
          setIsAssociatingTeacher(true);
        }}
      />
    </>
  );
}




