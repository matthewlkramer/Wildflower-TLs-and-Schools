// AG Grid init: register Community module always; enable Enterprise if licensed.
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { LicenseManager, SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule, MenuModule, SetFilterModule } from 'ag-grid-enterprise';

let entInit = false;

export function initAgGridEnterprise() {
  if (entInit) return;
  entInit = true;
  // Always register all Community features so base grid works.
  ModuleRegistry.registerModules([
    AllCommunityModule,
    // Enterprise modules we actively use
    SideBarModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    MenuModule,
    SetFilterModule,
  ]);
  const key = import.meta.env.VITE_AG_GRID_LICENSE_KEY as string | undefined;
  if (key) LicenseManager.setLicenseKey(key);
  // Importing the enterprise bundle auto-registers enterprise features
  // in v34 while community features remain available.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  import('ag-grid-enterprise');
}

export function filterForText(entReady: boolean) {
  return entReady ? 'agSetColumnFilter' : 'agTextColumnFilter';
}
