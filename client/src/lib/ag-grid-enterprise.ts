import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Using dynamic import so the app runs even if enterprise package is not installed.
// If present, we register enterprise modules and set the license.
export async function initAgGridEnterprise(): Promise<void> {
  // Avoid double registration
  if (typeof window !== 'undefined' && (window as any).__AG_GRID_ENTERPRISE_INIT__) return;

  // Always register community module (safe to call more than once)
  try {
    ModuleRegistry.registerModules([AllCommunityModule]);
  } catch {
    // ignore
  }

  // Apply license if provided (enterprise can still register without one; watermark may show)
  // Normalize license key from Vite env (strip accidental quotes/whitespace)
  const rawKey = (import.meta as any)?.env?.VITE_AG_GRID_LICENSE_KEY ?? '';
  const licenseKey = String(rawKey).trim().replace(/^"|"$/g, '');

  // Attempt to load enterprise modules; fall back gracefully if not present
  try {
    const ent = await import('ag-grid-enterprise');
    try {
        const {
          LicenseManager,
          SetFilterModule,
          SideBarModule,
          ColumnsToolPanelModule,
          FiltersToolPanelModule,
          MenuModule,
        } = ent as any;

        // Set license key from Vite env, if provided
        if (licenseKey && LicenseManager?.setLicenseKey) {
          LicenseManager.setLicenseKey(licenseKey);
          try { (window as any).__AG_GRID_LICENSE_SET__ = true; } catch {}
        } else {
          try { (window as any).__AG_GRID_LICENSE_SET__ = false; } catch {}
        }

        ModuleRegistry.registerModules([
          SetFilterModule,
          SideBarModule,
          ColumnsToolPanelModule,
          FiltersToolPanelModule,
          MenuModule,
        ].filter(Boolean));

        if (typeof window !== 'undefined') {
          (window as any).__AG_GRID_ENTERPRISE__ = true;
        }

        // In development without a license, AG Grid logs very noisy license banners via console.error.
        // Suppress only those specific messages to keep the console usable while still allowing features/watermark.
        if (!licenseKey && typeof window !== 'undefined' && !(window as any).__AG_GRID_LICENSE_LOG_SUPPRESSED__) {
          try {
            const originalError = console.error.bind(console);
            console.error = (...args: any[]) => {
              const first = args?.[0];
              if (typeof first === 'string' && (
                first.includes('AG Grid Enterprise License') ||
                first.includes('License Key Not Found') ||
                first.includes('All AG Grid Enterprise features are unlocked for trial')
              )) {
                return; // swallow AG Grid license banner
              }
              originalError(...args);
            };
            (window as any).__AG_GRID_LICENSE_LOG_SUPPRESSED__ = true;
          } catch {}
        }
    } catch (e) {
      console.warn('AG Grid Enterprise modules present but failed to register:', e);
      if (typeof window !== 'undefined') {
        (window as any).__AG_GRID_ENTERPRISE__ = false;
        (window as any).__AG_GRID_LICENSE_SET__ = false;
      }
    }
  } catch {
    // Enterprise bundle not installed; continue without it
    if (typeof window !== 'undefined') {
      (window as any).__AG_GRID_ENTERPRISE__ = false;
      (window as any).__AG_GRID_LICENSE_SET__ = false;
    }
  } finally {
    if (typeof window !== 'undefined') {
      (window as any).__AG_GRID_ENTERPRISE_INIT__ = true;
    }
  }
}

export function isAgGridEnterpriseEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  // Consider enterprise enabled if modules registered, regardless of license
  return Boolean((window as any).__AG_GRID_ENTERPRISE__);
}
