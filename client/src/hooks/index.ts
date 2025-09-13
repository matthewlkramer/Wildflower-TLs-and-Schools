// Grid data hooks
export { useGridEducators, useGridTeachers } from './use-educators-supabase';
export { useGridCharters } from './use-charters-supabase';
// Optional: schools grid alias for consistency
export { useSchoolsSupabase as useGridSchools } from './use-schools-supabase';

// Detail views hooks
export {
  useDetailEducators,
  useDetailSchools,
  useDetailCharters,
} from './use-details';

// Back-compat named exports
export { useEducatorsSupabase } from './use-educators-supabase';
export { useChartersSupabase } from './use-charters-supabase';
export { useSchoolsSupabase } from './use-schools-supabase';
