import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UIGridSchool, UIDetailsSchool, SchoolInsert, SchoolUpdate } from '@/lib/zod';
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

  // Get linked emails for school
  useEmails: (schoolId: string) => {
    return useQuery({
      queryKey: schoolKeys.linked(schoolId, 'emails'),
      enabled: !!schoolId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('z_g_emails')
          .select('*')
          .eq('school_id', schoolId)
          .order('date', { ascending: false })
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Get linked events for school
  useEvents: (schoolId: string) => {
    return useQuery({
      queryKey: schoolKeys.linked(schoolId, 'events'),
      enabled: !!schoolId,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('z_g_events')
          .select('*')
          .eq('school_id', schoolId)
          .order('start_time', { ascending: false })
          .limit(100);
        if (error) throw error;
        return data || [];
      },
    });
  },

  // Update school field mutation
  useUpdateField: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
        const { data, error } = await supabase
          .from('schools')
          .update({ [field]: value })
          .eq('id', id)
          .select()
          .single();
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

  // Create school mutation
  useCreate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (data: Record<string, any>) => {
        const { data: result, error } = await supabase
          .from('schools')
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      },
    });
  },

  // Update school mutation
  useUpdate: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
        const { data: result, error } = await supabase
          .from('schools')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return result;
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