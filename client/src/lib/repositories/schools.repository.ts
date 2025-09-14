import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createQueryKeys, createBaseMutations } from './base.repository';

// Query keys for schools
const schoolKeys = createQueryKeys('schools');

// School repository with typed hooks
export const schoolsRepository = {
  // List schools with filtering
  useList: (filters: Record<string, any> = {}) => {
    return useQuery({
      queryKey: schoolKeys.list(filters),
      queryFn: async () => {
        let query = supabase.from('ui_grid_schools').select('*');
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get school by ID
  useById: (id: string) => {
    return useQuery({
      queryKey: schoolKeys.detail(id),
      enabled: !!id,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_details_school')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      },
    });
  },

  // Get linked emails for school (using UI view)
  useEmails: (schoolId: string) => {
    return useQuery({
      queryKey: schoolKeys.linked(schoolId, 'emails'),
      enabled: !!schoolId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_school_emails')
          .select('*')
          .eq('school_id', schoolId)
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get linked events for school (using UI view)
  useEvents: (schoolId: string) => {
    return useQuery({
      queryKey: schoolKeys.linked(schoolId, 'events'),
      enabled: !!schoolId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_school_events')
          .select('*')
          .eq('school_id', schoolId)
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Update school field mutation (using secure RPC)
  useUpdateField: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
        const { data, error } = await supabase.rpc('update_school_field', {
          school_id: id,
          field_name: field,
          field_value: value
        });
        if (error) throw error;
        return data;
      },
      onSuccess: (data, variables) => {
        // Optimistic update
        queryClient.setQueryData(schoolKeys.detail(variables.id), (old: any) => 
          old ? { ...old, [variables.field]: variables.value } : old
        );
        // Invalidate lists
        queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      },
    });
  },

  // Create school mutation (using secure RPC)
  useCreate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (data: Record<string, any>) => {
        const { data: result, error } = await supabase.rpc('create_school', {
          school_data: data
        });
        if (error) throw error;
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      },
    });
  },

  // Update school mutation (using field updates)
  useUpdate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
        // Use field-level updates for security
        const promises = Object.entries(data).map(([field, value]) => 
          supabase.rpc('update_school_field', {
            school_id: id,
            field_name: field,
            field_value: value
          })
        );
        
        const results = await Promise.all(promises);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) throw errors[0].error;
        
        return results[results.length - 1].data; // Return last result
      },
      onSuccess: (data, variables) => {
        queryClient.setQueryData(schoolKeys.detail(variables.id), data);
        queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      },
    });
  },

  // Delete school mutation
  useDelete: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from('schools').delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      onSuccess: (_, id) => {
        queryClient.removeQueries({ queryKey: schoolKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      },
    });
  },
};