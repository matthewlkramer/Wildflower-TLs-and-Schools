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

  // Get linked emails for educator
  useEmails: (educatorId: string) => {
    return useQuery({
      queryKey: educatorKeys.linked(educatorId, 'emails'),
      enabled: !!educatorId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('z_g_emails')
          .select('*')
          .eq('people_id', educatorId)
          .order('date', { ascending: false })
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get linked events for educator
  useEvents: (educatorId: string) => {
    return useQuery({
      queryKey: educatorKeys.linked(educatorId, 'events'),
      enabled: !!educatorId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('z_g_events')
          .select('*')
          .eq('people_id', educatorId)
          .order('start_time', { ascending: false })
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Update educator field mutation
  useUpdateField: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
        const { data, error } = await supabase
          .from('people')
          .update({ [field]: value })
          .eq('id', id)
          .select()
          .single();
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

  // Create educator mutation
  useCreate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (data: Record<string, any>) => {
        const { data: result, error } = await supabase
          .from('people')
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: educatorKeys.lists() });
      },
    });
  },

  // Update educator mutation
  useUpdate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
        const { data: result, error } = await supabase
          .from('people')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return result;
      },
      onSuccess: (data, variables) => {
        queryClient.setQueryData(educatorKeys.detail(variables.id), data);
        queryClient.invalidateQueries({ queryKey: educatorKeys.lists() });
      },
    });
  },
};