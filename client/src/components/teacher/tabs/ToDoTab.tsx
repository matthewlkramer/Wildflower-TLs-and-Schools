import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ActionStep, Teacher } from '@/types/schema.generated';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef } from 'ag-grid-community';
import { DEFAULT_GRID_PROPS } from '@/components/shared/ag-grid-defaults';
import { supabase } from '@/integrations/supabase/client';

export function ToDoTab({ teacher }: { teacher: Teacher }) {
  const userId = (teacher as any)?.tcUserID || (teacher as any)?.assignedPartnerShortName || (teacher as any)?.fullName || teacher.id;
  const { data: steps = [], isLoading } = useQuery<any[]>({
    queryKey: ['supabase/action_steps/people', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_steps')
        .select('*')
        .eq('people_id', userId)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const rows = (steps || []).map((s: any) => ({ id: s.id, description: s.item ?? s.description ?? '', assignee: s.assignee ?? '', status: s.status ?? (s.complete ? 'Complete' : 'Pending'), dueDate: s.due_date ?? s.dueDate ?? '' }));
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
