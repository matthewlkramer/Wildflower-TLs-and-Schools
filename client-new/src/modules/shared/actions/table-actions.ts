const TABLE_ACTION_LABELS: Readonly<Record<string, string>> = {
  addActionStep: 'Add Action Step',
  addNote: 'Add Note',
  addGrant: 'Add Grant',
  addLocation: 'Add Location',
  addNewGuide: 'Add Guide & Assignment',
  addGuideLink: 'Assign Guide',
  addExistingEducatorToSchool: 'Add Existing Educator',
  addNewEducatorToSchool: 'Add New Educator',
  addStintAtSchool: 'Add Role at School',
  addSchoolAndStint: 'Add School & Role',
  addEvent: 'Add Attendance at Event',
  addTraining: 'Add Certification',
  addEnrollmentData: 'Add Data',
  addDocument: 'Add Document',
  addNineNinety: 'Add 990',
  email: 'Send Email',
};

export function getTableActionLabel(id: string): string {
  const pretty = TABLE_ACTION_LABELS[id];
  if (pretty) return pretty;
  // Fallback: Title Case a raw id
  return id
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

