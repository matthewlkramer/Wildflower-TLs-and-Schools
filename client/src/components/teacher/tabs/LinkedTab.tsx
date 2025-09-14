/**
 * Educator "Linked" tab. Shows linked emails and meetings from Google
 * integration. Displays emails from z_g_emails table and meetings from
 * z_g_events table, both filtered by people_id.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { createTextFilter } from '@/utils/ag-grid-utils';
import { ExternalLink, Mail, Calendar } from 'lucide-react';

export function LinkedTab({ teacher }: { teacher: any }) {
  const teacherId = teacher.id;
  
  // Query for emails
  const { data: emails = [], isLoading: emailsLoading } = useQuery<any[]>({
    queryKey: ["supabase/z_g_emails/people", teacherId],
    enabled: !!teacherId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('z_g_emails')
        .select('*')
        .eq('people_id', teacherId)
        .order('date', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  // Query for meetings/events
  const { data: events = [], isLoading: eventsLoading } = useQuery<any[]>({
    queryKey: ["supabase/z_g_events/people", teacherId],
    enabled: !!teacherId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('z_g_events')
        .select('*')
        .eq('people_id', teacherId)
        .order('start_time', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const emailCols: ColDef<any>[] = [
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      sort: 'desc',
      valueFormatter: (p) => {
        if (!p.value) return '-';
        try {
          return new Date(p.value).toLocaleDateString();
        } catch {
          return String(p.value);
        }
      }
    },
    {
      headerName: 'From',
      field: 'from_email',
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: 'Subject',
      field: 'subject',
      flex: 1,
      ...createTextFilter(),
      cellRenderer: (p: ICellRendererParams) => {
        const subject = p.value || '(No subject)';
        const emailId = p.data?.email_id;
        if (emailId) {
          return (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-slate-400" />
              <span className="truncate">{subject}</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </div>
          );
        }
        return <span className="truncate">{subject}</span>;
      }
    },
  ];

  const eventCols: ColDef<any>[] = [
    {
      headerName: 'Start',
      field: 'start_time',
      width: 140,
      sort: 'desc',
      valueFormatter: (p) => {
        if (!p.value) return '-';
        try {
          return new Date(p.value).toLocaleString();
        } catch {
          return String(p.value);
        }
      }
    },
    {
      headerName: 'Summary',
      field: 'summary',
      flex: 1,
      ...createTextFilter(),
      cellRenderer: (p: ICellRendererParams) => {
        const summary = p.value || '(No title)';
        const eventId = p.data?.event_id;
        if (eventId) {
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span className="truncate">{summary}</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </div>
          );
        }
        return <span className="truncate">{summary}</span>;
      }
    },
    {
      headerName: 'Attendees',
      field: 'attendees_count',
      width: 100,
      valueFormatter: (p) => p.value ? `${p.value}` : '-'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emails Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <h3 className="font-medium text-slate-900">Linked Emails</h3>
            <span className="text-xs text-slate-500">({emails.length})</span>
          </div>
          {emailsLoading ? (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : emails.length > 0 ? (
            <div className="h-96">
              <GridBase
                columnDefs={emailCols}
                rowData={emails}
                suppressColumnVirtualisation={true}
                defaultColDef={{ sortable: true, filter: false, resizable: true }}
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">No linked emails found.</p>
            </div>
          )}
        </div>

        {/* Events/Meetings Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h3 className="font-medium text-slate-900">Linked Meetings</h3>
            <span className="text-xs text-slate-500">({events.length})</span>
          </div>
          {eventsLoading ? (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : events.length > 0 ? (
            <div className="h-96">
              <GridBase
                columnDefs={eventCols}
                rowData={events}
                suppressColumnVirtualisation={true}
                defaultColDef={{ sortable: true, filter: false, resizable: true }}
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">No linked meetings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
