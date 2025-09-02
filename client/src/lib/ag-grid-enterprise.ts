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

  // Enable enterprise when explicitly turned on; apply license if provided
  const enabled = (import.meta as any)?.env?.VITE_AG_GRID_ENTERPRISE_ENABLED === 'true';
  const licenseKey = (import.meta as any)?.env?.VITE_AG_GRID_LICENSE_KEY || '';
  if (!enabled) {
    if (typeof window !== 'undefined') {
      (window as any).__AG_GRID_ENTERPRISE__ = false;
      (window as any).__AG_GRID_LICENSE_SET__ = false;
      (window as any).__AG_GRID_ENTERPRISE_INIT__ = true;
    }
    return;
  }

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
  return Boolean((window as any).__AG_GRID_ENTERPRISE__) && Boolean((window as any).__AG_GRID_LICENSE_SET__);
}
