# Row Actions Implementation for List Containers

## Status
The row actions menu is already rendering on list container cards, but the actions don't do anything yet. The `handleRowAction` function in `DetailsRenderer.tsx` (line 313) needs to be implemented.

## Location
File: `client-new/src/shared/components/DetailsRenderer.tsx`
Function: `handleRowAction` in `ListBlockRenderer` component (starts at line 313)

## What Needs to Be Done

Replace the current `handleRowAction` function (lines 313-365) with a complete implementation that:

1. Gets the row data from `listData.rows.find(r => r.id === rowId)`
2. Gets the source table from `TABLE_LIST_PRESETS[block.preset].sourceTable`
3. Implements all the row actions

## Row Actions to Implement

### 1. **email**
- Get email from `row.fields['primary_email']?.value.raw` (for educators/board members)
- OR from `row.fields['email_or_name']?.value.raw` (for guides)
- OR from `row.fields['tl_primary_emails']?.value.raw` (array for schools)
- Navigate to `/email/compose?to={encodedEmails}`

### 2. **jump_to_modal**
- Get `row.fields['people_id']` or `row.fields['school_id']` or `row.fields['charter_id']`
- Navigate to `/educators/{id}` or `/schools/{id}` or `/charters/{id}`

### 3. **archive**
- Show confirmation dialog
- Update `is_archived = true` in source table
- Refresh list with `await loadListData()`

### 4. **end_stint**
- Show confirmation dialog
- Update `end_date = today` and `is_active = false` in source table
- Refresh list

### 5. **end_occupancy**
- Show confirmation dialog. ASK WHETHER TO SWITCH CURRENT_MAIL_ADDRESS AND/OR CURRENT_PHYSICAL_ADDRESS TO FALSE
- Update `end_date = today` in source table AND CURRENT* BASED ON THEIR ANSWER
- Refresh list

### 6. **make_primary**
- Only for `email_addresses` table
- Get `people_id` from row
- Set `is_primary = false` for ALL emails for that person
- Set `is_primary = true` for this email
- Refresh list

### 7. **toggle_complete**
- Get current `row.fields['is_complete']?.value.raw`
- Update to opposite value
- Refresh list

### 8. **toggle_private_public**
- Get current `row.fields['is_private']?.value.raw`
- Update to opposite value
- Refresh list

### 9. **toggle_valid**
- Get current `row.fields['is_valid']?.value.raw`
- Update to opposite value
- Refresh list

### 10. **view_in_modal** (placeholder for now)
- Show alert saying "View details for this specific record"
- TODO: Implement actual modal view
LETS IMPLEMENT THIS NOW. CREATE AN OVERALL VIEW/EDIT MODAL AND A PRESET FILE WHERE WE CAN LIST WHICH FIELDS TO INCLUDE/EXCLUDE. HAVE THE DEFAULT BE TO INCLUDE EVERYTHING THAT THE SCHEMA HAS FOR THAT TABLE SO THAT I ONLY NEED TO LIST FIELDS TO EXCLUDE. PREPOPULATE THAT LIST WITH ALL THE FIELDS FROM THAT TABLE DRAWN THE FROM THE SCHEMA AND I'LL DELETE THE ONES I WANT TO KEEP.

### 11. **add_note** (placeholder for now)
- Determine FK column based on source table:
  - `people` → `people_id`
  - `schools` → `school_id`
  - `charters` → `charter_id`
  - `action_steps` → `action_step_id`
  - etc.
- TODO: Implement note creation modal 
WE ALREADY HAVE A NOTE CREATION MODAL THAT YOU CREATED FOR THE ADD NOTE ACTION IN THE GRID TABLES. USE THE SAME ONE

### 12. **add_task** (placeholder for now)
- TODO: Implement task creation modal. DITTO - WE ALREADY HAVE IT FROM GRID MODALS

## Code Template

```typescript
const handleRowAction = async (rowId: any, actionId: string) => {
  if (!listData || !block.preset) return;

  const row = listData.rows.find(r => r.id === rowId);
  if (!row) return;

  const preset = TABLE_LIST_PRESETS[block.preset as keyof typeof TABLE_LIST_PRESETS];
  const sourceTable = preset?.sourceTable;

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

      // ... implement all other cases ...
    }
  } catch (error) {
    console.error('Row action error:', error);
    await dialog.alert('Unable to complete the request.', {
      title: 'Error',
      variant: 'error',
    });
  }
};
```

## Dependencies Needed

Already imported:
- `useDialog` from `@/shared/components/ConfirmDialog`
- `useNavigate` from `react-router-dom`
- `supabase` from `@/core/supabase/client`
- `TABLE_LIST_PRESETS` from config

## Testing

After implementation, test each action on different list containers:
1. Email from educator list
2. Email from school list
3. Email from guide assignments
4. Archive from various lists
5. End stint from people_roles_associations
6. Toggle actions on notes, tasks, etc.

## Summary

All row actions should now work properly on list container cards. The implementation accesses the row data directly, performs the appropriate database operations, and refreshes the list to reflect changes.
