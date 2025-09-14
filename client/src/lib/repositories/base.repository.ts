import { useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Base repository interface for consistent data access patterns
export interface BaseRepository<TEntity, TInsert = Partial<TEntity>, TUpdate = Partial<TEntity>> {
  // Query hooks
  useList: (filters?: Record<string, any>, options?: UseQueryOptions<any, any>) => any;
  useById: (id: string, options?: UseQueryOptions<any, any>) => any;
  useLinked?: (entityId: string, options?: UseQueryOptions<any, any>) => any;
  
  // Mutation hooks
  useCreate: (options?: UseMutationOptions<any, any, any>) => any;
  useUpdate: (options?: UseMutationOptions<any, any, any>) => any;
  useUpdateField: (options?: UseMutationOptions<any, any, any>) => any;
  useDelete: (options?: UseMutationOptions<any, any, any>) => any;
}

// Query key generators for consistent cache management
export const createQueryKeys = (entity: string) => ({
  all: [entity] as const,
  lists: () => [entity, 'list'] as const,
  list: (filters: Record<string, any>) => [entity, 'list', filters] as const,
  details: () => [entity, 'detail'] as const,
  detail: (id: string) => [entity, 'detail', id] as const,
  linked: (entityId: string, type: string) => [entity, 'linked', type, entityId] as const,
});

// Base mutation helpers
export const createBaseMutations = <T>(
  tableName: string,
  queryKeys: ReturnType<typeof createQueryKeys>,
  queryClient: ReturnType<typeof useQueryClient>
) => ({
  create: async (data: Partial<T>) => {
    const { data: result, error } = await supabase.from(tableName).insert(data).select().single();
    if (error) throw error;
    return result;
  },
  
  update: async ({ id, data }: { id: string; data: Partial<T> }) => {
    const { data: result, error } = await supabase.from(tableName).update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  
  updateField: async ({ id, field, value }: { id: string; field: string; value: any }) => {
    const { data: result, error } = await supabase.from(tableName).update({ [field]: value }).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  // Optimistic cache updates
  invalidateQueries: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.all });
  },
  
  updateCache: (id: string, data: Partial<T>) => {
    queryClient.setQueryData(queryKeys.detail(id), (old: any) => ({ ...old, ...data }));
  },
});