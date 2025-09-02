/**
 * Hook that exposes whether AG Grid enterprise modules have been loaded and
 * provides the appropriate text filter type. It polls until enterprise features
 * are ready so grids can safely reference set filters.
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

