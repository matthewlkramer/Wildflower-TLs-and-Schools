import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';

/**
 * Custom hook to ensure table data refreshes after mutations
 * This solves the persistent issue of tables not updating after record creation
 */
export function useTableRefresh(queryKeys: string[], dependencies: any[] = []) {
  useEffect(() => {
    // Set up an interval to periodically check for stale data
    const intervalId = setInterval(() => {
      queryKeys.forEach(key => {
        const queryState = queryClient.getQueryState([key]);
        if (queryState?.isInvalidated) {
          // Force refetch if query is marked as invalidated
          queryClient.refetchQueries({ queryKey: [key] });
        }
      });
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, dependencies);

  // Return a manual refresh function
  const refreshTables = () => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.refetchQueries({ queryKey: [key] });
    });
  };

  return { refreshTables };
}

/**
 * Global refresh function for all school-related data
 */
export function refreshSchoolData(schoolId: string) {
  const queries = [
    `/api/school-associations/${schoolId}`,
    `/api/locations/school/${schoolId}`,
    `/api/guide-assignments/school/${schoolId}`,
    `/api/governance-documents/school/${schoolId}`,
    `/api/tax-990s/school/${schoolId}`,
    `/api/grants/school/${schoolId}`,
    `/api/loans/school/${schoolId}`,
    `/api/school-notes/school/${schoolId}`,
    `/api/action-steps/school/${schoolId}`,
    `/api/membership-fees-by-year/school/${schoolId}`,
    `/api/membership-fee-updates/school/${schoolId}`,
  ];

  queries.forEach(query => {
    queryClient.invalidateQueries({ queryKey: [query] });
    queryClient.refetchQueries({ queryKey: [query] });
  });
}