import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGridCharters() {
  return useQuery({
    queryKey: ['view/grid_charter'],
    queryFn: async () => {
      const { data, error } = await supabase.from('grid_charter').select('*');
      if (error) throw error; return data || [];
    }
  });
}

export function useCharterDetails(id: string) {
  return useQuery({
    queryKey: ['details/charter', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('details_charters').select('*').eq('id', id).maybeSingle();
      if (error) throw error; return data;
    }
  });
}

