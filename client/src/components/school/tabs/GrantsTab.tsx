import React, { useEffect, useState } from 'react';
import type { Grant, Loan } from '@shared/schema.generated';
import { TableCard } from '@/components/shared/TableCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { X, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function GrantRow({ grant, isEditing, onEdit, onSave, onCancel, onDelete, onView, isSaving }: {
  grant: Grant;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  onView: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({ amount: grant.amount || 0, issuedDate: grant.issuedDate || '', issuedBy: grant.issuedBy || '', status: grant.status || '' });
  useEffect(() => { if (isEditing) setEditData({ amount: grant.amount || 0, issuedDate: grant.issuedDate || '', issuedBy: grant.issuedBy || '', status: grant.status || '' }); }, [isEditing, grant]);
  return isEditing ? (
    <TableRow>
      <TableCell><Input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
      <TableCell><Input type="date" value={editData.issuedDate} onChange={(e) => setEditData({ ...editData, issuedDate: e.target.value })} className="h-8" /></TableCell>
      <TableCell><Input value={editData.issuedBy} onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })} className="h-8" /></TableCell>
      <TableCell><Input value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="h-8" /></TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(editData)} disabled={isSaving} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-8 px-2"><X className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      <TableCell>{grant.amount ? `$${grant.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{grant.issuedDate || '-'}</TableCell>
      <TableCell>{grant.issuedBy || '-'}</TableCell>
      <TableCell>{grant.status || '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700" title="Open" onClick={onView}>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 w-8 p-0"><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function LoanRow({ loan, isEditing, onEdit, onSave, onCancel, onDelete, onView, isSaving }: {
  loan: Loan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  onView: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({ amount: loan.amount || 0, status: loan.status || '', interestRate: loan.interestRate || 0 });
  useEffect(() => { if (isEditing) setEditData({ amount: loan.amount || 0, status: loan.status || '', interestRate: loan.interestRate || 0 }); }, [isEditing, loan]);
  return isEditing ? (
    <TableRow>
      <TableCell><Input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
      <TableCell><Input value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="h-8" /></TableCell>
      <TableCell><Input type="number" step="0.01" value={editData.interestRate} onChange={(e) => setEditData({ ...editData, interestRate: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(editData)} disabled={isSaving} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-8 px-2"><X className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      <TableCell>{loan.amount ? `$${loan.amount.toLocaleString()}` : '-'}</TableCell>
      <TableCell>{loan.status || '-'}</TableCell>
      <TableCell>{loan.interestRate ? `${loan.interestRate}%` : '-'}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700" title="Open" onClick={onView}><ExternalLink className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 w-8 p-0"><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function GrantsTab({ schoolId }: { schoolId: string }) {
  const qc = useQueryClient();
  // Grants
  const { data: grants = [], isLoading: grantsLoading } = useQuery<Grant[]>({
    queryKey: [`/api/grants/school/${schoolId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch grants');
      return res.json();
    },
  });
  const sortedGrants = (grants || []).slice();
  const [isCreatingGrant, setIsCreatingGrant] = useState(false);
  const [editingGrantId, setEditingGrantId] = useState<string | null>(null);
  const [newGrant, setNewGrant] = useState<any>({ amount: 0, issuedDate: '', issuedBy: '', status: '' });
  const createGrant = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/grants', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schoolId, ...newGrant }) });
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    },
    onSuccess: () => { setIsCreatingGrant(false); setNewGrant({ amount: 0, issuedDate: '', issuedBy: '', status: '' }); qc.invalidateQueries({ queryKey: [`/api/grants/school/${schoolId}`] }); },
  });
  const updateGrant = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/grants/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => { setEditingGrantId(null); qc.invalidateQueries({ queryKey: [`/api/grants/school/${schoolId}`] }); },
  });
  const deleteGrant = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/grants/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/grants/school/${schoolId}`] }),
  });

  // Loans
  const { data: loans = [], isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: [`/api/loans/school/${schoolId}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch loans');
      return res.json();
    },
  });
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [newLoan, setNewLoan] = useState<any>({ amount: 0, status: '', interestRate: 0 });
  const createLoan = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/loans', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schoolId, ...newLoan }) });
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    },
    onSuccess: () => { setIsCreatingLoan(false); setNewLoan({ amount: 0, status: '', interestRate: 0 }); qc.invalidateQueries({ queryKey: [`/api/loans/school/${schoolId}`] }); },
  });
  const updateLoan = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/loans/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => { setEditingLoanId(null); qc.invalidateQueries({ queryKey: [`/api/loans/school/${schoolId}`] }); },
  });
  const deleteLoan = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/loans/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/loans/school/${schoolId}`] }),
  });
  const [viewGrant, setViewGrant] = useState<Grant | null>(null);
  const [viewLoan, setViewLoan] = useState<Loan | null>(null);

  return (
    <>
    <div className="space-y-6">
      <TableCard title="Grants" actionsRight={<Button size="sm" onClick={() => setIsCreatingGrant(true)}>Add Grant</Button>}>
        {grantsLoading ? (
          <div className="space-y-3 p-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (sortedGrants && sortedGrants.length > 0) || isCreatingGrant ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreatingGrant && (
                <TableRow>
                  <TableCell><Input type="number" value={newGrant.amount} onChange={(e) => setNewGrant({ ...newGrant, amount: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
                  <TableCell><Input type="date" value={newGrant.issuedDate} onChange={(e) => setNewGrant({ ...newGrant, issuedDate: e.target.value })} className="h-8" /></TableCell>
                  <TableCell><Input value={newGrant.issuedBy} onChange={(e) => setNewGrant({ ...newGrant, issuedBy: e.target.value })} className="h-8" /></TableCell>
                  <TableCell><Input value={newGrant.status} onChange={(e) => setNewGrant({ ...newGrant, status: e.target.value })} className="h-8" /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => createGrant.mutate()} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsCreatingGrant(false); setNewGrant({ amount: 0, issuedDate: '', issuedBy: '', status: '' }); }} className="h-8 px-2"><X className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {sortedGrants.map((grant) => (
                <GrantRow
                  key={grant.id}
                  grant={grant}
                  isEditing={editingGrantId === grant.id}
                  onEdit={() => setEditingGrantId(grant.id)}
                  onSave={(data) => updateGrant.mutate({ id: grant.id, data })}
                  onCancel={() => setEditingGrantId(null)}
                  onDelete={() => deleteGrant.mutate(grant.id)}
                  onView={() => setViewGrant(grant)}
                  isSaving={updateGrant.isPending}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No grants found for this school.</p>
            <p className="text-sm mt-2">Use the "Add Grant" button above to create grants.</p>
          </div>
        )}
      </TableCard>

      <TableCard title="Loans">
        {loansLoading ? (
          <div className="space-y-3 p-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (loans && loans.length > 0) || isCreatingLoan ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreatingLoan && (
                <TableRow>
                  <TableCell><Input type="number" value={newLoan.amount} onChange={(e) => setNewLoan({ ...newLoan, amount: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
                  <TableCell><Input value={newLoan.status} onChange={(e) => setNewLoan({ ...newLoan, status: e.target.value })} className="h-8" /></TableCell>
                  <TableCell><Input type="number" step="0.01" value={newLoan.interestRate} onChange={(e) => setNewLoan({ ...newLoan, interestRate: parseFloat(e.target.value) || 0 })} className="h-8" /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => createLoan.mutate()} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsCreatingLoan(false); setNewLoan({ amount: 0, status: '', interestRate: 0 }); }} className="h-8 px-2"><X className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {loans?.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  isEditing={editingLoanId === loan.id}
                  onEdit={() => setEditingLoanId(loan.id)}
                  onSave={(data) => updateLoan.mutate({ id: loan.id, data })}
                  onCancel={() => setEditingLoanId(null)}
                  onDelete={() => deleteLoan.mutate(loan.id)}
                  onView={() => setViewLoan(loan)}
                  isSaving={updateLoan.isPending}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-slate-500">No loans found for this school.</div>
        )}
      </TableCard>
    </div>
    {viewGrant && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-lg">
          <h3 className="text-sm font-semibold mb-3">Grant Details</h3>
          <pre className="text-xs bg-slate-50 p-2 rounded max-h-[60vh] overflow-auto">{JSON.stringify(viewGrant, null, 2)}</pre>
          <div className="flex justify-end mt-3">
            <Button size="sm" variant="outline" onClick={()=>setViewGrant(null)}>Close</Button>
          </div>
        </div>
      </div>
    )}
    {viewLoan && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-lg">
          <h3 className="text-sm font-semibold mb-3">Loan Details</h3>
          <pre className="text-xs bg-slate-50 p-2 rounded max-h-[60vh] overflow-auto">{JSON.stringify(viewLoan, null, 2)}</pre>
          <div className="flex justify-end mt-3">
            <Button size="sm" variant="outline" onClick={()=>setViewLoan(null)}>Close</Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
