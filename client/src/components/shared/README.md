Reusable building blocks for detail pages

- InfoCard: A card that displays labeled fields, with an Edit toggle for inline editing (text, textarea, number, date, toggle, select). Call onSave(values) to persist.

  Example:

  <InfoCard
    title="School Overview"
    description="Key identifiers"
    fields={[
      { key: 'shortName', label: 'Short Name', type: 'text', value: school.shortName, editable: true },
      { key: 'status', label: 'Status', type: 'select', value: school.status, editable: true, options: [
        { label: 'Active', value: 'Active' },
        { label: 'Planning', value: 'Planning' },
      ] },
      { key: 'membershipStatus', label: 'Membership', type: 'text', value: school.membershipStatus, editable: true },
    ]}
    onSave={(vals) => updateSchool(school.id, vals)}
  />

- TableCard: A card wrapper with a standardized header for any table (AG Grid or UI table) children.

  Example:

  <TableCard title="Educator Assignments" actionsRight={<Button size="sm">Add</Button>}>
    <div style={{ height: gridHeight }}>
      <AgGridReact {...DEFAULT_GRID_PROPS} rowData={rows} columnDefs={cols} defaultColDef={DEFAULT_COL_DEF} />
    </div>
  </TableCard>

- RowActions: Small, consistent action buttons (View/Edit/Delete) for rows.

  Example:

  <RowActions item={row} onView={() => ...} onEdit={() => ...} onDelete={() => ...} />

- Grid defaults & layout:
  - DEFAULT_GRID_PROPS and DEFAULT_COL_DEF unify grid appearance and behavior.
  - useGridHeight gives a consistent responsive height across pages.
