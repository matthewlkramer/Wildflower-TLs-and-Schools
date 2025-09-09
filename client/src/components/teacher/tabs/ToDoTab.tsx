import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ActionStep, Teacher } from '@shared/schema.generated';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef } from 'ag-grid-community';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';

export function ToDoTab({ teacher }: { teacher: Teacher }) {
  const userId = (teacher as any)?.tcUserID || (teacher as any)?.assignedPartnerShortName || (teacher as any)?.fullName || teacher.id;
  const { data: steps = [], isLoading } = useQuery<ActionStep[]>({
    queryKey: ['/api/action-steps/user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/action-steps/user/${encodeURIComponent(String(userId))}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch user action steps');
      return res.json();
    },
    enabled: !!userId,
  });

  const rows = (steps || []).map((s) => ({ id: s.id, description: s.description || '', assignee: s.assignee || '', status: s.status || (s.complete ? 'Complete' : 'Pending'), dueDate: s.dueDate || '' }));
  const cols: ColDef<any>[] = [
    { headerName: 'Item', field: 'description', flex: 2, filter: 'agTextColumnFilter' },
    { headerName: 'Assignee', field: 'assignee', width: 160, filter: 'agTextColumnFilter' },
    { headerName: 'Status', field: 'status', width: 120, filter: 'agTextColumnFilter' },
    { headerName: 'Due', field: 'dueDate', width: 140, filter: 'agTextColumnFilter' },
  ];

  return (
    <div className="border rounded-lg p-3">
      <GridBase
        rowData={rows}
        columnDefs={cols}
        defaultColDefOverride={{ sortable: true, filter: true, resizable: true }}
        gridProps={{
          ...DEFAULT_GRID_PROPS,
          domLayout: 'autoHeight',
          overlayLoadingTemplate: isLoading ? '<span class="ag-overlay-loading-center">Loading.</span>' : undefined,
        }}
      />
    </div>
  );
}

