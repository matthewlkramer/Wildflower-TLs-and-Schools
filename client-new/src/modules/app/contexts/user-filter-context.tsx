import React, { createContext, useContext, useMemo, useState } from 'react';

type Ctx = {
  mineOnly: boolean;
  setMineOnly: (v: boolean) => void;
};

const C = createContext<Ctx | undefined>(undefined);

export function UserFilterProvider({ children }: { children: React.ReactNode }) {
  const [mineOnly, setMineOnly] = useState(false);
  const value = useMemo(() => ({ mineOnly, setMineOnly }), [mineOnly]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useUserFilter() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useUserFilter must be used within UserFilterProvider');
  return ctx;
}

