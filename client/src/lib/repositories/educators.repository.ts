import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createQueryKeys } from './base.repository';

// Query keys for educators
const educatorKeys = createQueryKeys('educators');

// Educator repository with typed hooks
export const educatorsRepository = {
  // List educators with filtering
  useList: (filters: Record<string, any> = {}) => {
    return useQuery({
      queryKey: educatorKeys.list(filters),
      queryFn: async () => {
        let query = supabase.from('ui_grid_educators').select('*');
        
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

  // Get educator by ID
  useById: (id: string) => {
    return useQuery({
      queryKey: educatorKeys.detail(id),
      enabled: !!id,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_details_educator')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      },
    });
  },

  // Get educator-school associations
  useAssociations: (educatorId: string) => {
    return useQuery({
      queryKey: educatorKeys.linked(educatorId, 'associations'),
      enabled: !!educatorId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('details_associations')
          .select('*')
          .eq('people_id', educatorId);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get linked emails for educator (using UI view)
  useEmails: (educatorId: string) => {
    return useQuery({
      queryKey: educatorKeys.linked(educatorId, 'emails'),
      enabled: !!educatorId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_educator_emails')
          .select('*')
          .eq('people_id', educatorId)
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get linked events for educator (using UI view)
  useEvents: (educatorId: string) => {
    return useQuery({
      queryKey: educatorKeys.linked(educatorId, 'events'),
      enabled: !!educatorId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('ui_educator_events')
          .select('*')
          .eq('people_id', educatorId)
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Update educator field mutation (using secure RPC)
  useUpdateField: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
        const { data, error } = await supabase.rpc('update_educator_field', {
          educator_id: id,
          field_name: field,
          field_value: value
        });
        if (error) throw error;
        return data;
      },
      onSuccess: (data, variables) => {
        // Optimistic update
        queryClient.setQueryData(educatorKeys.detail(variables.id), (old: any) => 
          old ? { ...old, [variables.field]: variables.value } : old
        );
        // Invalidate lists
        queryClient.invalidateQueries({ queryKey: educatorKeys.lists() });
      },
    });
  },

  // Update educator-school association
  useUpdateAssociation: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
        const { data: result, error } = await supabase
          .from('details_associations')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return result;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: educatorKeys.linked(variables.id, 'associations') });
      },
    });
  },

  // Create educator mutation (using secure RPC)
  useCreate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (data: Record<string, any>) => {
        const { data: result, error } = await supabase.rpc('create_educator', {
          educator_data: data
        });
        if (error) throw error;
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: educatorKeys.lists() });
      },
    });
  },

  // Update educator mutation (using field updates)
  useUpdate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
        // Use field-level updates for security
        const promises = Object.entries(data).map(([field, value]) => 
          supabase.rpc('update_educator_field', {
            educator_id: id,
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
        queryClient.setQueryData(educatorKeys.detail(variables.id), data);
        queryClient.invalidateQueries({ queryKey: educatorKeys.lists() });
      },
    });
  },
};