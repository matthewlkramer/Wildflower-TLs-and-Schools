#!/bin/bash

echo "=== METADATA-TO-IMPLEMENTATION VALIDATION SCRIPT ==="
echo "This script validates that our implementation matches the actual Airtable structure"
echo ""

# Check if metadata file exists
METADATA_FILE=$(ls attached_assets/Metadata-Grid*.csv 2>/dev/null | head -1)
if [ -z "$METADATA_FILE" ]; then
    echo "❌ ERROR: Metadata file not found in attached_assets/"
    echo "   Please ensure Airtable metadata CSV is available"
    exit 1
fi

echo "✅ Found metadata file: $METADATA_FILE"
echo ""

# Count dropdown fields in Airtable
echo "=== AIRTABLE DROPDOWN FIELD ANALYSIS ==="
SINGLE_SELECT=$(grep ",Schools," "$METADATA_FILE" | grep "singleSelect" | wc -l)
MULTIPLE_SELECT=$(grep ",Schools," "$METADATA_FILE" | grep "multipleSelects" | wc -l)
TOTAL_DROPDOWN=$((SINGLE_SELECT + MULTIPLE_SELECT))

echo "Single select fields: $SINGLE_SELECT"
echo "Multiple select fields: $MULTIPLE_SELECT"
echo "Total dropdown fields: $TOTAL_DROPDOWN"
echo ""

# Count implemented field options
echo "=== IMPLEMENTATION ANALYSIS ==="
if curl -s http://localhost:5000/api/metadata/school-field-options > /dev/null 2>&1; then
    IMPLEMENTED=$(curl -s http://localhost:5000/api/metadata/school-field-options | jq 'keys | length')
    echo "Implemented field options: $IMPLEMENTED"
    
    # Calculate coverage
    COVERAGE=$((IMPLEMENTED * 100 / TOTAL_DROPDOWN))
    echo "Coverage: $COVERAGE% ($IMPLEMENTED/$TOTAL_DROPDOWN)"
    echo ""
    
    # Alert if major mismatch
    if [ $TOTAL_DROPDOWN -gt $((IMPLEMENTED + 10)) ]; then
        MISSING=$((TOTAL_DROPDOWN - IMPLEMENTED))
        echo "🚨 CRITICAL ISSUE DETECTED!"
        echo "   $MISSING dropdown fields are missing from implementation"
        echo "   This causes text inputs to appear instead of dropdowns"
        echo ""
        
        # Show missing fields
        echo "=== MISSING DROPDOWN FIELDS ==="
        grep ",Schools," "$METADATA_FILE" | grep -E "singleSelect|multipleSelects" | cut -d, -f3 | sort > /tmp/airtable_dropdowns.txt
        curl -s http://localhost:5000/api/metadata/school-field-options | jq -r 'keys[]' | sort > /tmp/implemented_dropdowns.txt
        
        echo "Fields in Airtable but NOT implemented:"
        diff /tmp/airtable_dropdowns.txt /tmp/implemented_dropdowns.txt | grep "^<" | sed 's/^< /- /' | head -15
        echo ""
    else
        echo "✅ Dropdown field coverage looks good!"
    fi
else
    echo "❌ ERROR: Cannot connect to server at localhost:5000"
    echo "   Please ensure the application is running"
    exit 1
fi

# Field mapping validation
echo "=== FIELD MAPPING VALIDATION ==="
READ_OPS=$(grep -n "fields\['" server/simple-storage.ts | grep -v "updateFields" | wc -l)
WRITE_OPS=$(grep -n "updateFields\[" server/simple-storage.ts | wc -l)

echo "Read operations: $READ_OPS"
echo "Write operations: $WRITE_OPS"

# Check for healthy read/write ratio
if [ $READ_OPS -gt 0 ] && [ $WRITE_OPS -gt 0 ]; then
    RATIO=$((READ_OPS / WRITE_OPS))
    if [ $RATIO -lt 2 ] || [ $RATIO -gt 20 ]; then
        echo "⚠️  WARNING: Unusual read/write ratio ($RATIO:1)"
        echo "   Consider checking for missing read or write operations"
    else
        echo "✅ Read/write ratio looks healthy ($RATIO:1)"
    fi
else
    echo "❌ ERROR: Missing read or write operations"
fi

echo ""
echo "=== VALIDATION COMPLETE ==="
echo "Run this script regularly to catch metadata mismatches early"