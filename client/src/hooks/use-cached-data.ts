import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Custom hook for cached data with prefetching capabilities
export function useCachedEducators() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["/api/teachers"],
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
  });

  // Prefetch educator details when hovering over a row
  const prefetchEducator = useCallback((educatorId: string) => {
    queryClient.prefetchQuery({
      queryKey: [`/api/teachers/${educatorId}`],
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return {
    ...query,
    prefetchEducator,
  };
}

export function useCachedSchools() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["/api/schools"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Prefetch school details when hovering over a row
  const prefetchSchool = useCallback((schoolId: string) => {
    queryClient.prefetchQuery({
      queryKey: [`/api/schools/${schoolId}`],
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return {
    ...query,
    prefetchSchool,
  };
}

// Hook for detail pages with automatic background refresh
export function useCachedDetail<T>(endpoint: string, id: string | undefined) {
  return useQuery<T>({
    queryKey: [endpoint, id],
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // Refresh in background if data is stale
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

// Hook for subtables with smart caching
export function useCachedSubtable<T>(endpoint: string, parentId: string | undefined) {
  return useQuery<T>({
    queryKey: [endpoint, parentId],
    enabled: !!parentId,
    staleTime: 2 * 60 * 1000, // Shorter stale time for subtables
    gcTime: 15 * 60 * 1000,
  });
}