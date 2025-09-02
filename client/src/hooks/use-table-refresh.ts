/**
 * Keeps AG‑Grid views in sync after mutations. `useTableRefresh` accepts an
 * array of query keys and sets up a 1‑second interval that checks whether each
 * query has been invalidated in React Query; if so, it triggers a refetch. It
 * also returns a `refreshTables` function that forces invalidation and refetch
 * immediately. `refreshSchoolData` is a helper that targets all queries related
 * to a specific school id.
 */
import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';

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