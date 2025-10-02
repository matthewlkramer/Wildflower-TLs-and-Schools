export type DashboardTableSpec = {
  id: string;
  title: string;
  columns: { field: string; headerName: string }[];
};

export const DASHBOARD_TABLES: DashboardTableSpec[] = [
  {
    id: 'my_educators',
    title: 'My Educators',
    columns: [
      { field: 'full_name', headerName: 'Full Name' },
      { field: 'current_role_at_active_school', headerName: 'Current Role (Active School)' },
    ],
  },
  {
    id: 'my_schools',
    title: 'My Schools',
    columns: [
      { field: 'school_name', headerName: 'Name' },
      { field: 'stage_status', headerName: 'Stage/Status' },
    ],
  },
  {
    id: 'my_charters',
    title: 'My Charters',
    columns: [
      { field: 'charter_name', headerName: 'Name' },
      { field: 'status', headerName: 'Status' },
    ],
  },
  {
    id: 'my_action_steps',
    title: 'My Action Steps',
    columns: [
      { field: 'due_date', headerName: 'Due Date' },
      { field: 'item', headerName: 'Item' },
    ],
  },
  {
    id: 'my_emails',
    title: 'My Emails',
    columns: [
      { field: 'sent_at', headerName: 'Sent Date' },
      { field: 'subject', headerName: 'Subject' },
      { field: 'is_private', headerName: 'Private?' },
    ],
  },
  {
    id: 'my_meetings',
    title: 'My Meetings',
    columns: [
      { field: 'start_time', headerName: 'Start Time' },
      { field: 'summary', headerName: 'Summary' },
      { field: 'is_private', headerName: 'Private?' },
    ],
  },
];

