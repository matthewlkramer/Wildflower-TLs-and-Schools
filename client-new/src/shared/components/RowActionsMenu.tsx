import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

type RowActionsMenuProps = {
  actions: string[];
  onAction: (actionId: string) => void;
};

// Map action IDs to human-readable labels
const ACTION_LABELS: Record<string, string> = {
  inline_edit: 'Edit',
  view_in_modal: 'View',
  jump_to_modal: 'Open',
  toggle_complete: 'Toggle Complete',
  toggle_private_public: 'Toggle Private/Public',
  toggle_valid: 'Toggle Valid',
  make_primary: 'Make Primary',
  archive: 'Archive',
  end_stint: 'End Stint',
  add_note: 'Add Note',
  add_task: 'Add Task',
  email: 'Send Email',
};

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ actions, onAction }) => {
  const [value, setValue] = React.useState<string>('');

  const handleChange = (actionId: string) => {
    if (actionId && actionId !== '__placeholder__') {
      onAction(actionId);
      // Reset to placeholder after action
      setValue('');
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="h-7 w-24 text-xs" style={{ fontWeight: 'normal', fontSize: 11 }}>
        <SelectValue placeholder="Actions" />
      </SelectTrigger>
      <SelectContent>
        {actions.map(actionId => (
          <SelectItem key={actionId} value={actionId} className="text-xs">
            {ACTION_LABELS[actionId] || actionId}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
