/**
 * Determines whether the AG Grid enterprise modules have finished registering
 * on the page. The hook polls `isAgGridEnterpriseEnabled` until it returns true
 * and then exposes two pieces of state: `entReady` for components that need to
 * know when enterprise features are usable, and `filterForText` which resolves
 * to `agSetColumnFilter` when enterprise is ready or falls back to
 * `agTextColumnFilter` otherwise. This ensures components can reference set
 * filters without causing runtime errors in environments without a license.
 */
import { useEffect, useState } from "react";
import { isAgGridEnterpriseEnabled } from "@/lib/ag-grid-enterprise";

export function useAgGridFeatures() {
  const [entReady, setEntReady] = useState<boolean>(isAgGridEnterpriseEnabled());

  useEffect(() => {
    let active = true;
    const tick = () => {
      const ready = isAgGridEnterpriseEnabled();
      if (!active) return;
      if (ready !== entReady) setEntReady(ready);
      if (!ready) setTimeout(tick, 150);
    };
    tick();
    return () => { active = false; };
  }, [entReady]);

  const filterForText = entReady ? 'agSetColumnFilter' : 'agTextColumnFilter';

  return { entReady, filterForText } as const;
}

