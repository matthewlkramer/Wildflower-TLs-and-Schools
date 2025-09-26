import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGridEducators() {
  return useQuery({
    queryKey: ['view/grid_educator', 'all'],
    queryFn: async () => {
      const pageSize = 5000;
      const all: any[] = [];
      let from = 0;
      // Use a stable order to avoid duplicates across pages
      // Order by name primarily, then id as tiebreaker.
      for (;;) {
        const { data, error } = await supabase
          .from('grid_educator')
          .select('*')
          .order('full_name', { ascending: true })
          .order('id', { ascending: true })
          .range(from, from + pageSize - 1);
        if (error) throw error;
        const chunk = data || [];
        all.push(...chunk);
        if (chunk.length < pageSize) break;
        from += pageSize;
      }
      return all;
    }
  });
}

export function useEducatorDetails(id: string) {
  return useQuery({
    queryKey: ['details/educator', id],
    enabled: !!id,
    queryFn: async () => {
      // Expect a details view to already exist and include all top-level fields
      const { data, error } = await supabase.from('details_educators').select('*').eq('id', id).maybeSingle();
      if (error) throw error; return data;
    }
  });
}
