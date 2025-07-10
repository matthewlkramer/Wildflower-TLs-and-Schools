// Custom hook for consistent API data fetching with error handling

import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getErrorMessage } from "@shared/utils";

interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

/**
 * Custom hook for fetching data from API endpoints with user filtering support
 */
export function useApiQuery<TData = unknown>(
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'> & {
    includeUserFilter?: boolean;
  }
) {
  // For now, we'll implement user filtering on the client side
  // In a real application, this would be server-side
  const finalQueryKey = [endpoint];
  
  return useQuery<TData, ApiError>({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const response = await fetch(endpoint, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error: ApiError = {
          message: `Failed to fetch from ${endpoint}`,
          statusCode: response.status,
        };
        
        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.code = errorData.code;
        } catch {
          // Use default error message
        }
        
        throw error;
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    ...options,
  });
}

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: method !== 'DELETE' ? JSON.stringify(variables) : undefined,
      });
      
      if (!response.ok) {
        const error: ApiError = {
          message: `${method} request failed`,
          statusCode: response.status,
        };
        
        try {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.code = errorData.code;
        } catch {
          // Use default error message
        }
        
        throw error;
      }
      
      // Handle empty responses (like DELETE)
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    onError: (error) => {
      console.error(`API ${method} error:`, getErrorMessage(error));
    },
    ...options,
  });
}

/**
 * Invalidate queries helper
 */
export function invalidateQueries(keys: string[]) {
  keys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
}