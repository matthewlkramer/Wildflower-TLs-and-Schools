import { useEffect, useState } from "react";

// Standardized grid height calculator used across pages
export function useGridHeight(): string {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  if (viewportHeight === 0) return 'calc(100vh - 200px)'; // Fallback initial
  if (viewportHeight < 500) return Math.max(viewportHeight - 120, 280) + 'px';
  return Math.min(viewportHeight - 200, 800) + 'px';
}

