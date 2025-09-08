import { useEffect } from 'react';

export function useGlobalTypeToSearch(
  inputRef: React.RefObject<HTMLInputElement | null>,
  setSearchTerm: (updater: string | ((prev: string) => string)) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const isEditable = (el: any) => {
      if (!el) return false;
      const t = (el.tagName || '').toLowerCase();
      return t === 'input' || t === 'textarea' || t === 'select' || !!el.isContentEditable;
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e as any).metaKey || (e as any).ctrlKey || (e as any).altKey) return;
      if (isEditable((document as any).activeElement)) return;
      const k = e.key;
      const printable = k.length === 1;
      if (!(printable || k === 'Backspace' || k === 'Delete' || k === 'Escape')) return;
      try {
        inputRef.current?.focus();
      } catch {}
      e.preventDefault();
      if (k === 'Escape') {
        setSearchTerm('');
        return;
      }
      if (k === 'Backspace' || k === 'Delete') {
        setSearchTerm((prev: string) => String(prev || '').slice(0, -1));
        return;
      }
      if (printable) {
        setSearchTerm((prev: string) => String(prev || '') + k);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey as any, { capture: true } as any);
  }, [inputRef, setSearchTerm, ...deps]);
}

