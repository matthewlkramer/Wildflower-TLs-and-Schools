import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGridSchools() {
  return useQuery({
    queryKey: ['view/grid_school'],
    queryFn: async () => {
      const { data, error } = await supabase.from('grid_school').select('*');
      if (error) throw error; return data || [];
    }
  });
}

export function useSchoolDetails(id: string) {
  return useQuery({
    queryKey: ['details/school', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('details_schools').select('*').eq('id', id).maybeSingle();
      if (error) throw error; return data;
    }
  });
}

