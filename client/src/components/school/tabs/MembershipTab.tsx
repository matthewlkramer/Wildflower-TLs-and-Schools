import React from 'react';
// API response shapes for membership endpoints
interface MembershipFeeByYear { id: string; year?: string | null; amount?: number | null }
interface MembershipFeeUpdate { id: string; updateDate?: string | null; updateType?: string | null; attachment?: string | null }
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

export function MembershipTab({ schoolId }: { schoolId: string }) {
  const { data: membershipFeesByYear, isLoading: feesLoading } = useQuery<MembershipFeeByYear[]>({
    queryKey: [`/api/membership-fees-by-year/school/${schoolId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch membership fees');
      return res.json();
    },
  });
  const { data: membershipFeeUpdates, isLoading: updatesLoading } = useQuery<MembershipFeeUpdate[]>({
    queryKey: [`/api/membership-fee-updates/school/${schoolId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch membership fee updates');
      return res.json();
    },
  });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Membership Fees by Year</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feesLoading ? (
                <TableRow><TableCell colSpan={2} className="text-center">Loading membership fees...</TableCell></TableRow>
              ) : membershipFeesByYear && membershipFeesByYear.length > 0 ? (
                membershipFeesByYear.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.year || '-'}</TableCell>
                    <TableCell>{fee.amount != null ? `$${fee.amount.toLocaleString()}` : '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={2} className="text-center text-gray-500">No membership fees found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Membership Fee Updates</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatesLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Loading membership fee updates...</TableCell></TableRow>
              ) : membershipFeeUpdates && membershipFeeUpdates.length > 0 ? (
                membershipFeeUpdates.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell>{update.updateDate || '-'}</TableCell>
                    <TableCell>{update.updateType || '-'}</TableCell>
                    <TableCell>
                      {update.attachment ? (
                        <a href={update.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Attachment</a>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-500">No membership fee updates found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Calculated Fields</h4>
          <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
            <div>
              <label className="text-sm font-medium text-slate-600">Total Fees Paid</label>
              <p className="text-lg font-semibold text-slate-900">—</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Outstanding Balance</label>
              <p className="text-lg font-semibold text-slate-900">—</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Average Annual Fee</label>
              <p className="text-lg font-semibold text-slate-900">—</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Payment History</label>
              <p className="text-sm text-slate-900">—</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Next Due Date</label>
              <p className="text-sm text-slate-900">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
