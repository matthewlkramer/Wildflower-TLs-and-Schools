import { useMemo, useEffect, useRef, useState } from "react";
import { useSearch } from "@/contexts/search-context";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";

interface UseSearchFilterOptions<T> {
  data: T[] | undefined;
  searchFields: (item: T) => string[];
  userFilterField?: (item: T, currentUser: string) => boolean;
  debugName?: string;
}

export function useSearchFilter<T extends { id: string }>({
  data,
  searchFields,
  userFilterField,
  debugName = "Component"
}: UseSearchFilterOptions<T>) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [gridFilteredCount, setGridFilteredCount] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      if (!item) return false;

      const term = (searchTerm || "").trim().toLowerCase();
      if (term) {
        const haystacks = searchFields(item);
        const matchesSearch = haystacks.some(v => (v || "").toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      if (showOnlyMyRecords && currentUser && userFilterField) {
        return userFilterField(item, currentUser);
      }

      return true;
    });
  }, [data, searchTerm, showOnlyMyRecords, currentUser, searchFields, userFilterField]);

  useEffect(() => {
    const isEditable = (el: any) => {
      if (!el) return false;
      const t = (el.tagName || '').toLowerCase();
      return t === 'input' || t === 'textarea' || t === 'select' || !!el.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditable(document.activeElement)) return;
      
      const k = e.key;
      const printable = k.length === 1;
      if (!(printable || k === 'Backspace' || k === 'Delete' || k === 'Escape')) return;
      
      try { searchInputRef.current?.focus(); } catch {}
      e.preventDefault();
      
      if (k === 'Escape') { 
        setSearchTerm(''); 
        return; 
      }
      if (k === 'Backspace' || k === 'Delete') { 
        setSearchTerm((searchTerm || '').slice(0, -1)); 
        return; 
      }
      if (printable) { 
        setSearchTerm((searchTerm || '') + k); 
      }
    };

    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true } as any);
  }, [searchTerm, setSearchTerm]);

  const showing = gridFilteredCount ?? (filteredData?.length ?? 0);
  const total = data?.length ?? 0;
  const searchDebug = `Search: "${searchTerm}" | Total: ${total} | Filtered: ${showing}`;
  
  logger.log(`${debugName} - filtered result:`, searchDebug);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    searchInputRef,
    gridFilteredCount,
    setGridFilteredCount,
    showing,
    total,
    searchDebug
  };
}