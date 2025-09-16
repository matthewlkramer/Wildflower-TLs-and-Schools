import React, { useMemo, useState } from 'react';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef } from 'ag-grid-community';
import { useGridSchools } from '../api/queries';
import { useLocation } from 'wouter';
import { SCHOOL_GRID, type SchoolColumnConfig } from '../constants';
import { supabase } from '@/lib/supabase/client';

export function SchoolsPage() {
  const { data = [], isLoading } = useGridSchools();
  const [, navigate] = useLocation();
  const [quick, setQuick] = useState('');

  const cols = useMemo<ColDef<any>[]>(() => {
    if (!data || data.length === 0) return [];
    const sample = data.slice(0, 50);
    const keySet = new Set<string>();
    for (const row of sample) Object.keys(row || {}).forEach((k) => keySet.add(k));

    const configPresent: SchoolColumnConfig[] = SCHOOL_GRID.filter((c) => keySet.has(c.field));
    const suppressed = new Set(configPresent.filter(c => c.visibility === 'suppress').map(c => c.field));

    const orderedFromConfig = configPresent
      .filter(c => c.visibility !== 'suppress')
      .sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));

    const defs: ColDef<any>[] = [];
    for (const c of orderedFromConfig) {
      const def: ColDef<any> = { field: c.field, headerName: c.headerName };
      if (c.visibility === 'hide') def.hide = true;
      switch (c.valueType) {
        case 'select':
          def.filter = 'agSetColumnFilter';
          if ((c as any).selectOptions && (c as any).selectOptions.length) {
            def.filterParams = { values: (c as any).selectOptions as any } as any;
          } else if ((c as any).lookupField) {
            const src = (c as any).lookupField as string;
            const [table, column] = src.split('.');
            def.filterParams = {
              values: (p: any) => {
                (supabase as any).from(table).select(column).order(column, { ascending: true }).then(({ data, error }: any) => {
                  if (error) { p.success([]); return; }
                  const vals = Array.from(new Set((data || []).map((r: any) => r?.[column]).filter((v: any) => v != null))).map((v: any) => String(v));
                  p.success(vals);
                });
              }
            } as any;
          } else if ((c as any).enumName) {
            const enumType = (c as any).enumName as string;
            def.filterParams = {
              values: (p: any) => {
                (supabase as any).rpc('enum_values', { enum_type: enumType }).then(({ data, error }: any) => {
                  if (error) { p.success([]); return; }
                  const vals = Array.isArray(data) ? data.map((r: any) => r.value ?? r).map(String) : [];
                  p.success(vals);
                });
              }
            } as any;
          }
          break;
        case 'multi':
          def.filter = 'agTextColumnFilter';
          def.valueFormatter = (p: any) => Array.isArray(p.value) ? p.value.join(', ') : (p.value ?? '');
          break;
        case 'boolean':
          def.filter = 'agSetColumnFilter';
          def.filterParams = { values: ['Yes', 'No'] } as any;
          def.valueFormatter = (p: any) => {
            const v = p.value;
            if (v === true || v === 'true' || v === 1) return 'Yes';
            if (v === false || v === 'false' || v === 0) return 'No';
            return v ?? '';
          };
          break;
        case 'number':
          def.filter = 'agNumberColumnFilter';
          break;
        case 'date':
          def.filter = 'agDateColumnFilter';
          break;
        default:
          break;
      }
      defs.push(def);
    }
    // Strict: do not append unknown keys
    const sortCfg = configPresent.find((c: any) => c.sortKey === true);
    if (sortCfg) {
      const col = defs.find((d) => d.field === sortCfg.field);
      if (col) {
        col.sortable = true;
        col.sort = 'asc';
      }
    } else {
      const nameCol = defs.find((d) => d.field === 'school_name' || d.field === 'long_name' || d.field === 'short_name' || d.field === 'name');
      if (nameCol) {
        nameCol.headerName = 'Name';
        nameCol.sortable = true;
        nameCol.sort = 'asc';
      }
    }
    return defs;
  }, [data]);

  if (isLoading) return <div>Loading schools.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>Schools</h1>
        <input
          type="text"
          placeholder="Quick filter..."
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          style={{ flex: '0 0 260px', padding: '6px 8px' }}
        />
      </div>
      <GridBase
        columnDefs={cols}
        rowData={data as any[]}
        gridOptions={{
          quickFilterText: quick,
          pagination: false,
          sideBar: {
            toolPanels: [
              { id: 'columns', labelDefault: 'Columns', labelKey: 'columns', iconKey: 'columns', toolPanel: 'agColumnsToolPanel' },
              { id: 'filters', labelDefault: 'Filters', labelKey: 'filters', iconKey: 'filter', toolPanel: 'agFiltersToolPanel' },
            ],
            position: 'right',
            hiddenByDefault: false,
          },
          onGridReady: (params) => {
            params.api.setSideBarVisible(true);
            params.api.closeToolPanel();
          },
          onRowClicked: (e) => navigate(`/schools/${e.data.id}`),
        }}
      />
    </div>
  );
}
