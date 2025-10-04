export type BadgeConfig = {
  field: string;
  trueLabel: string;
  falseLabel?: string; // If omitted, don't show badge when value is false
};

export const BADGE_PRESETS: Record<string, BadgeConfig> = {
  is_active: { field: 'is_active', trueLabel: 'Active', falseLabel: 'Inactive' },
  is_valid: { field: 'is_valid', trueLabel: 'Valid', falseLabel: 'Invalid' },
  is_primary: { field: 'is_primary', trueLabel: 'Primary' },
  current_mail_address: { field: 'current_mail_address', trueLabel: 'Current Mailing Address' },
  current_physical_address: { field: 'current_physical_address', trueLabel: 'Current Physical Address' },
  is_paid_off: { field: 'is_paid_off', trueLabel: 'Paid Off' },
  is_private: { field: 'is_private', trueLabel: 'Private' },
};
