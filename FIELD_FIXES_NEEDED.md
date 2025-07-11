# Field Fixes Required

## Problem Analysis
From testing, the issue is NOT with the frontend form (which is correctly implemented), but with backend field type handling.

## Issues Identified:

### 1. Field Type Mismatches
- **EIN**: Frontend shows text input, backend treats as dropdown
- **Legal Name**: Frontend shows text input, backend treats as dropdown
- **Incorporation Date**: Should be date field, backend has permission issues

### 2. Invalid Default Values
- **Nonprofit Status**: Using "501(c)(3)" instead of valid option "independent" 
- **Current FY End**: Using "June 30" instead of valid option "6/30"
- **Business Insurance**: Using "State Farm Business" instead of valid option "Alliant"

### 3. Multi-select Permission Issues
- **Program Focus**: Valid options exist but permission restrictions prevent updates

## Valid Options Discovered:
- **Nonprofit Status**: ["group exemption", "independent", "for profit", "Partnership", "Under Charter 501c3"]
- **Current FY End**: ["6/30", "7/31", "8/31", "12/31"] 
- **Business Insurance**: ["Alliant", "other", "other (in process w/ Alliant)"]
- **Program Focus**: ["Inclusion", "Lab School", "Nature Based", "Dual Language", "Conversion into WF"]

## Fix Strategy:
1. Check schema definitions for field type conflicts
2. Update Airtable field mappings if needed
3. Ensure text fields are not being validated as dropdowns
4. Update default dropdown values to use valid options
