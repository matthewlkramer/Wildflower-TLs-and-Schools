// Row action handler implementation for list containers
// This will be integrated into DetailsRenderer.tsx

import { supabase } from '@/core/supabase/client';
import type { RenderableListData } from '../services/card-service';
import { TABLE_LIST_PRESETS } from '../config/table-list-presets';

export async function handleListRowAction(
  rowId: any,
  actionId: string,
  listData: RenderableListData,
  preset: string,
  dialog: any,
  setLocation: any,
  loadListData: () => Promise<void>
) {
  if (!listData || !preset) return;

  const row = listData.rows.find(r => r.id === rowId);
  if (!row) return;

  const presetConfig = TABLE_LIST_PRESETS[preset as keyof typeof TABLE_LIST_PRESETS];
  const sourceTable = presetConfig?.sourceTable;

  try {
    switch (actionId) {
      case 'email': {
        let emails: string[] = [];

        const primaryEmail = row.fields['primary_email']?.value.raw;
        if (primaryEmail) emails = [primaryEmail];

        const emailOrName = row.fields['email_or_name']?.value.raw;
        if (emailOrName && emailOrName.includes('@')) emails = [emailOrName];

        const tlPrimaryEmails = row.fields['tl_primary_emails']?.value.raw;
        if (Array.isArray(tlPrimaryEmails)) {
          emails = tlPrimaryEmails.filter(e => e && e.includes('@'));
        }

        if (emails.length === 0) {
          await dialog.alert('No email address is available for this record.', {
            title: 'No Email',
            variant: 'warning',
          });
          break;
        }

        const to = encodeURIComponent(emails.join(','));
        window.location.assign(`/email/compose?to=${to}`);
        break;
      }

      case 'jump_to_modal': {
        const peopleId = row.fields['people_id']?.value.raw || row.fields['person_id']?.value.raw;
        const schoolId = row.fields['school_id']?.value.raw;
        const charterId = row.fields['charter_id']?.value.raw;

        if (peopleId) {
          setLocation(`/educators/${peopleId}`);
        } else if (schoolId) {
          setLocation(`/schools/${schoolId}`);
        } else if (charterId) {
          setLocation(`/charters/${charterId}`);
        } else {
          await dialog.alert('Unable to determine linked record.', {
            title: 'Error',
            variant: 'error',
          });
        }
        break;
      }

      case 'archive': {
        const confirmed = await dialog.confirm(
          'Are you sure you want to archive this record? It will no longer appear in any views.',
          { title: 'Archive Record', variant: 'warning' }
        );

        if (!confirmed || !sourceTable) break;

        const { error } = await (supabase as any)
          .from(sourceTable)
          .update({ is_archived: true })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'end_stint': {
        const confirmed = await dialog.confirm(
          'Are you sure you want to end this association?',
          { title: 'End Stint', variant: 'warning' }
        );

        if (!confirmed || !sourceTable) break;

        const { error } = await (supabase as any)
          .from(sourceTable)
          .update({
            end_date: new Date().toISOString().split('T')[0],
            is_active: false
          })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'end_occupancy': {
        // Ask about current_mail_address and current_physical_address
        const updateMailAddress = await dialog.confirm(
          'Do you want to mark this as no longer the current mailing address?',
          { title: 'Update Mailing Address?', variant: 'info' }
        );

        const updatePhysicalAddress = await dialog.confirm(
          'Do you want to mark this as no longer the current physical address?',
          { title: 'Update Physical Address?', variant: 'info' }
        );

        const updates: any = {
          end_date: new Date().toISOString().split('T')[0]
        };

        if (updateMailAddress) {
          updates.current_mail_address = false;
        }

        if (updatePhysicalAddress) {
          updates.current_physical_address = false;
        }

        if (!sourceTable) break;

        const { error } = await (supabase as any)
          .from(sourceTable)
          .update(updates)
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'make_primary': {
        if (sourceTable !== 'email_addresses') break;

        const peopleId = row.fields['people_id']?.value.raw;
        if (!peopleId) break;

        // Set all emails for this person to is_primary=false
        await (supabase as any)
          .from('email_addresses')
          .update({ is_primary: false })
          .eq('people_id', peopleId);

        // Set this one to true
        const { error } = await (supabase as any)
          .from('email_addresses')
          .update({ is_primary: true })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'toggle_complete': {
        const currentValue = row.fields['is_complete']?.value.raw;
        const { error } = await (supabase as any)
          .from(sourceTable)
          .update({ is_complete: !currentValue })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'toggle_private_public': {
        const currentValue = row.fields['is_private']?.value.raw;
        const { error } = await (supabase as any)
          .from(sourceTable)
          .update({ is_private: !currentValue })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      case 'toggle_valid': {
        const currentValue = row.fields['is_valid']?.value.raw;
        const { error } = await (supabase as any)
          .from(sourceTable)
          .update({ is_valid: !currentValue })
          .eq('id', rowId);

        if (error) throw error;
        await loadListData();
        break;
      }

      default:
        await dialog.alert('This action is not implemented yet for list items.', {
          title: 'Not Implemented',
          variant: 'warning',
        });
        break;
    }
  } catch (error) {
    console.error('Row action error:', error);
    await dialog.alert('Unable to complete the request.', {
      title: 'Error',
      variant: 'error',
    });
  }
}
