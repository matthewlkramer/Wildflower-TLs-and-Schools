import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
import type { MontessoriCertification } from "@shared/schema.generated";
import { supabase } from "@/integrations/supabase/client";

interface MontessoriCertificationsTableProps {
  educatorId: string;
}

export function MontessoriCertificationsTable({ educatorId }: MontessoriCertificationsTableProps) {
  const handleOpenCertification = (certification: MontessoriCertification) => {
    // TODO: Implement open certification modal
    console.log("Opening certification:", certification);
  };

  const handleEditCertification = (certification: MontessoriCertification) => {
    // TODO: Implement inline edit functionality
    console.log("Editing certification:", certification);
  };

  const handleDeleteCertification = (certification: MontessoriCertification) => {
    // TODO: Implement delete functionality
    console.log("Deleting certification:", certification);
  };
  const { data: certifications = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/montessori_certifications/people", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('montessori_certifications')
        .select('*')
        .eq('people_id', educatorId)
        .order('year_received', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Year Certified",
      field: "yearReceived",
      width: 150,
      ...createTextFilter(),
      valueGetter: (p:any) => p?.data?.yearReceived ?? p?.data?.year_received ?? '',
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Level",
      field: "certificationLevel",
      width: 150,
      ...createTextFilter(),
      valueGetter: (p:any) => p?.data?.certificationLevel ?? p?.data?.certification_level ?? '',
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Abbreviation",
      field: "certifier",
      width: 150,
      ...createTextFilter(),
      valueGetter: (p:any) => p?.data?.certifier ?? p?.data?.certifier_abbreviation ?? p?.data?.certifier_name ?? '',
      valueFormatter: (p) => String(p.value || ''),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const certification = params.data as MontessoriCertification;
        return (
          <div className="flex items-center gap-1 h-full">
            <button
              onClick={() => handleOpenCertification(certification)}
              className="p-1 hover:bg-slate-100 rounded"
              title="Open certification details"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => handleEditCertification(certification)}
              className="p-1 hover:bg-slate-100 rounded"
              title="Edit certification inline"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteCertification(certification)}
              className="p-1 hover:bg-slate-100 rounded"
              title="Delete certification"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (certifications.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No Montessori certifications found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div style={{ height: "400px", width: "100%" }}>
        <GridBase
          rowData={certifications}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
          gridProps={{
            rowSelection: { enableClickSelection: false } as any,
            domLayout: 'autoHeight',
            context: { componentName: 'montessori-certifications-table' },
          }}
        />
      </div>
    </div>
  );
}
