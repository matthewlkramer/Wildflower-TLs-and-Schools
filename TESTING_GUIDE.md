# Quick Testing Guide

## How to Use Test Mode

1. **Enable Test Mode**: Look for the test tube icon and toggle at the top of the app
2. **Orange Banner**: When test mode is active, you'll see an orange "Testing enabled" banner
3. **Safe Testing**: All create/edit/delete operations will be simulated - no real data changes
4. **View Data**: You can still view all your real data normally

## What Test Mode Does

### ✅ Safe Operations (Simulated)
- **Creating new records**: Add School, Add Teacher, Add Charter
- **Editing existing data**: All edit forms and inline editing
- **Deleting records**: All delete operations
- **Association changes**: Teacher-school associations, guide assignments

### ✅ Normal Operations (Real)
- **Viewing data**: All tables and detail pages show real data
- **Searching**: Search and filtering work normally
- **Navigation**: Moving between pages works normally

## Testing Workflow

### Quick Test (5 minutes)
1. Turn on Test Mode
2. Try adding a new school from the Schools page
3. Try editing a school's details
4. Try adding a teacher association
5. Watch for orange success messages

### Comprehensive Test (30 minutes)
Follow the detailed checklist in `TESTING_PLAN.md`

## Visual Indicators

- **🧪 Test Mode ON**: Orange toggle, orange banner, orange toast messages
- **✅ Simulated Success**: "Test mode: Operation completed successfully"
- **❌ Real Operation**: Regular success/error messages (when test mode is off)

## Pro Tips

- **Leave test mode on** while going through your testing checklist
- **Toggle it off** when you want to make real changes
- **Orange toast messages** confirm operations were simulated
- **Test with confidence** - your real data is completely safe

## Troubleshooting

If something doesn't work in test mode:
1. Check the browser console for errors
2. Toggle test mode off and on again
3. Refresh the page if needed
4. Report the specific action that failed

## Example Test Scenarios

### Scenario 1: School Management
1. Enable test mode
2. Go to Schools page
3. Click "Add School" 
4. Fill out the form
5. Save - should see orange success message
6. Go to a school detail page
7. Try editing various fields
8. Each save should show orange confirmation

### Scenario 2: Teacher Management  
1. Stay in test mode
2. Go to Teachers page
3. Click "Add Educator"
4. Fill form and save
5. Go to teacher detail page
6. Test editing contact info, demographics, etc.

### Scenario 3: Associations
1. Stay in test mode
2. Go to school detail page, TLs tab
3. Try "Associate Existing Educator"
4. Try editing teacher roles/dates
5. Try "End Stint" action
6. All should show orange confirmations