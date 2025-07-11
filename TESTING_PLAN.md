# Comprehensive UI Testing Plan

## Testing Framework

### Core Testing Principles
1. **Simulate User Actions**: Use API calls to mimic button clicks and form submissions
2. **Visual Verification**: Take screenshots before and after each action
3. **Data Validation**: Verify data changes in both API responses and UI display
4. **Error Documentation**: Capture console errors, network failures, and UI inconsistencies

### Testing Workflow for Each Component

#### Step 1: Baseline Screenshot
- Capture current state before any action
- Document visible elements and data

#### Step 2: Action Simulation
- API call to simulate user action (create/update/delete)
- Wait for response and any async operations

#### Step 3: Verification
- Take follow-up screenshot
- Compare before/after states
- Check API response matches UI display
- Verify no console errors

#### Step 4: Documentation
- Record success/failure
- Document any discrepancies
- Note required fixes

## School Detail Page Testing Matrix

### Tab 1: Summary
| Element | Test Action | Expected Result | Status |
|---------|------------|----------------|--------|
| No buttons | N/A | Display only | - |

### Tab 2: Details
| Field | Test Action | Expected Result | Status |
|-------|------------|----------------|--------|
| Edit Details Button | Click | Modal opens | ⏳ |
| School Name | Update via modal | New name displays | ⏳ |
| Short Name | Update via modal | New short name displays | ⏳ |
| Email | Update via modal | New email displays | ⏳ |
| Phone | Update via modal | New phone displays | ⏳ |
| Status | Select from dropdown | New status displays | ⏳ |
| Membership Status | Select from dropdown | New status displays | ⏳ |
| [Continue for all fields...] | | | |

### Tab 3: Teachers
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Teacher | 1. Click Add New<br>2. Fill form<br>3. Submit | Teacher appears in table | ⏳ |
| Edit Role | 1. Click edit icon<br>2. Change role<br>3. Save | Role updates in table | ⏳ |
| Edit Start Date | Inline edit | Date updates | ⏳ |
| End Stint | Click button | End date populated | ⏳ |
| Delete | Click delete | Record removed | ⏳ |

### Tab 4: Locations
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Location | Via Add New button | Location appears | ⏳ |
| Edit Address | Inline edit | Address updates | ⏳ |
| Toggle Current | Checkbox click | Status changes | ⏳ |
| Delete | Delete button | Record removed | ⏳ |

### Tab 5: Guides
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Guide | Via Add New button | Guide appears | ⏳ |
| Edit Type | Inline edit | Type updates | ⏳ |
| Edit Dates | Inline edit | Dates update | ⏳ |
| Delete | Delete button | Record removed | ⏳ |

### Tab 6: Governance
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Document | Via dropdown | Document appears | ⏳ |
| Add 990 | Via dropdown | 990 appears | ⏳ |
| Open Document | Click link | Opens in new tab | ⏳ |
| Edit | Edit button | Updates inline | ⏳ |
| Delete | Delete button | Record removed | ⏳ |

### Tab 7: Grants/Loans
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Grant | Via Add New | Grant appears | ⏳ |
| Add Loan | Via Add New | Loan appears | ⏳ |
| View Details | Open icon | Modal shows details | ⏳ |
| Edit | Edit button | Updates inline | ⏳ |
| Delete | Delete button | Record removed | ⏳ |

### Tab 8: Notes/Actions
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| Add Note | Via Add New | Note appears | ⏳ |
| Add Action | Via Add New | Action appears | ⏳ |
| View Note | Click headline | Modal opens | ⏳ |
| Toggle Complete | Click icon | Status changes | ⏳ |
| Delete | Delete button | Record removed | ⏳ |

### Tab 9: SSJ
| Element | Test Action | Expected Result | Status |
|---------|------------|----------------|--------|
| View Only | N/A | Display data correctly | ⏳ |

### Tab 10: Membership Fees
| Action | Test Steps | Expected Result | Status |
|--------|------------|----------------|--------|
| View fees | N/A | Display correctly | ⏳ |
| Filter updates | School year select | Table filters | ⏳ |

## Testing Execution Plan

### Phase 1: Create Clean Test School
1. Use Add School button (not API)
2. Fill all required fields
3. Verify appears in list
4. Navigate to detail page

### Phase 2: Systematic Tab Testing
1. Start with Details tab
2. Test each field one by one
3. Document results in matrix
4. Move to next tab only when current is complete

### Phase 3: Cleanup
1. Delete all test records
2. Delete test school
3. Verify complete removal

## Success Metrics
- ✅ All CRUD operations work
- ✅ UI reflects data changes immediately
- ✅ No console errors
- ✅ Proper error handling
- ✅ Consistent behavior across all tabs