import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Edit, Trash2 } from 'lucide-react';
import { TableCard } from '@/components/shared/TableCard';
import type { GovernanceDocument, Tax990 } from '@shared/schema.generated';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function GovernanceDocumentRow({
  document,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isSaving,
}: {
  document: GovernanceDocument;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({
    docType: document.docType || '',
    dateEntered: document.dateEntered || '',
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({ docType: document.docType || '', dateEntered: document.dateEntered || '' });
    }
  }, [isEditing, document]);

  return isEditing ? (
    <TableRow>
      <TableCell>
        <Input value={editData.docType} onChange={(e) => setEditData({ ...editData, docType: e.target.value })} className="h-8" placeholder="Document Type" />
      </TableCell>
      <TableCell>
        <Input type="date" value={editData.dateEntered} onChange={(e) => setEditData({ ...editData, dateEntered: e.target.value })} className="h-8" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(editData)} disabled={isSaving} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-8 px-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow className="h-8">
      <TableCell className="py-1">
        {document.docUrl ? (
          <a href={document.docUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
            {document.docType || '-'}
          </a>
        ) : (
          document.docType || '-'
        )}
      </TableCell>
      <TableCell className="py-1">{document.dateEntered || '-'}</TableCell>
      <TableCell className="py-1">
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function Tax990Row({
  tax990,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isSaving,
}: {
  tax990: Tax990;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState({ year: tax990.year || '' });

  useEffect(() => {
    if (isEditing) setEditData({ year: tax990.year || '' });
  }, [isEditing, tax990]);

  return isEditing ? (
    <TableRow className="h-8">
      <TableCell>
        <Input value={editData.year} onChange={(e) => setEditData({ year: e.target.value })} placeholder="Year" className="h-8" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => onSave(editData)} disabled={isSaving} className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
          <Button size="sm" variant="outline" onClick={onCancel} disabled={isSaving} className="h-8 px-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow className="h-8">
      <TableCell className="py-1 text-sm">
        {tax990.attachmentUrl ? (
          <a href={tax990.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
            {tax990.year || '-'}
          </a>
        ) : (
          tax990.year || '-'
        )}
      </TableCell>
      <TableCell className="py-1">
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function GovernanceTab({ schoolId }: { schoolId: string }) {
  const qc = useQueryClient();
  // Documents
  const { data: governanceDocuments, isLoading: documentsLoading } = useQuery<any[]>({
    queryKey: ["supabase/governance_docs/school", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('governance_docs')
        .select('*')
        .eq('school_id', schoolId)
        .order('date_entered', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<any>({ docType: '', dateEntered: '' });
  const createDoc = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('governance_docs')
        .insert({ school_id: schoolId, doc_type: newDocument.docType, date_entered: newDocument.dateEntered });
      if (error) throw error;
      return true;
    },
    onSuccess: () => { setIsCreatingDocument(false); setNewDocument({ docType: '', dateEntered: '' }); qc.invalidateQueries({ queryKey: ["supabase/governance_docs/school", schoolId] }); },
  });
  const updateDoc = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('governance_docs')
        .update({ doc_type: data.docType, date_entered: data.dateEntered })
        .eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => { setEditingDocumentId(null); qc.invalidateQueries({ queryKey: ["supabase/governance_docs/school", schoolId] }); },
  });
  const deleteDoc = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('governance_docs').delete().eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["supabase/governance_docs/school", schoolId] }),
  });

  // 990s
  const { data: tax990s, isLoading: tax990sLoading } = useQuery<any[]>({
    queryKey: ["supabase/nine_nineties/school", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nine_nineties')
        .select('*')
        .eq('school_id', schoolId)
        .order('year', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
  const [isCreating990, setIsCreating990] = useState(false);
  const [editingTax990Id, setEditingTax990Id] = useState<string | null>(null);
  const [new990, setNew990] = useState<any>({ year: '' });
  const create990 = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('nine_nineties')
        .insert({ school_id: schoolId, year: new990.year });
      if (error) throw error;
      return true;
    },
    onSuccess: () => { setIsCreating990(false); setNew990({ year: '' }); qc.invalidateQueries({ queryKey: ["supabase/nine_nineties/school", schoolId] }); },
  });
  const update990 = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('nine_nineties')
        .update({ year: data.year })
        .eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => { setEditingTax990Id(null); qc.invalidateQueries({ queryKey: ["supabase/nine_nineties/school", schoolId] }); },
  });
  const delete990 = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('nine_nineties').delete().eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["supabase/nine_nineties/school", schoolId] }),
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        {documentsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <TableCard title="Governance Documents" actionsRight={<Button size="sm" onClick={() => setIsCreatingDocument(true)}>Add Document</Button>}>
            <Table>
              <TableHeader>
                <TableRow className="h-8">
                  <TableHead className="h-8 py-1">Document title</TableHead>
                  <TableHead className="h-8 py-1">Date</TableHead>
                  <TableHead className="h-8 py-1 w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCreatingDocument && (
                  <TableRow className="h-8">
                    <TableCell className="py-1">
                      <Input value={newDocument?.docType || ''} onChange={(e) => setNewDocument({ ...newDocument, docType: e.target.value })} placeholder="Document Type" className="h-7 text-sm" />
                    </TableCell>
                    <TableCell className="py-1">
                      <Input type="date" value={newDocument?.dateEntered || ''} onChange={(e) => setNewDocument({ ...newDocument, dateEntered: e.target.value })} className="h-7 text-sm" />
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => createDoc.mutate()} className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs">Save</Button>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => { setIsCreatingDocument(false); setNewDocument({ docType: '', dateEntered: '' }); }}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {governanceDocuments?.length ? (
                  governanceDocuments
                    .sort((a, b) => (a.docType || '').localeCompare(b.docType || ''))
                    .map((document) => (
                      <GovernanceDocumentRow
                        key={document.id}
                        document={document}
                        isEditing={editingDocumentId === document.id}
                        onEdit={() => setEditingDocumentId(document.id)}
                        onSave={(data) => updateDoc.mutate({ id: document.id, data })}
                        onCancel={() => setEditingDocumentId(null)}
                        onDelete={() => deleteDoc.mutate(document.id)}
                        isSaving={updateDoc.isPending}
                      />
                    ))
                ) : !isCreatingDocument ? (
                  <TableRow className="h-8">
                    <TableCell colSpan={3} className="text-center text-gray-500 py-4 text-sm">No governance documents found</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableCard>
        )}
      </div>

      <div className="space-y-4">
        <TableCard title="990s" actionsRight={<Button size="sm" onClick={() => setIsCreating990(true)}>Add 990</Button>}>
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="h-8 py-1">Year</TableHead>
                <TableHead className="h-8 py-1 w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreating990 && (
                <TableRow className="h-8">
                  <TableCell className="py-1">
                    <Input value={new990?.year || ''} onChange={(e) => setNew990({ ...new990, year: e.target.value })} placeholder="Year" className="h-7 text-sm" />
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => create990.mutate()} className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsCreating990(false); setNew990({ year: '' }); }} className="h-7 px-2">Cancel</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {tax990sLoading ? (
                <TableRow className="h-8"><TableCell colSpan={2} className="text-center py-2">Loading 990s...</TableCell></TableRow>
              ) : tax990s?.length ? (
                tax990s
                  .sort((a, b) => (parseInt(b.year || '0') - parseInt(a.year || '0')))
                  .map((tax990) => (
                    <Tax990Row
                      key={tax990.id}
                      tax990={tax990}
                      isEditing={editingTax990Id === tax990.id}
                      onEdit={() => setEditingTax990Id(tax990.id)}
                      onSave={(data) => update990.mutate({ id: tax990.id, data })}
                      onCancel={() => setEditingTax990Id(null)}
                      onDelete={() => delete990.mutate(tax990.id)}
                      isSaving={update990.isPending}
                    />
                  ))
              ) : !isCreating990 ? (
                <TableRow className="h-8"><TableCell colSpan={2} className="text-center text-gray-500 py-4 text-sm">No 990s found</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableCard>
      </div>
    </div>
  );
}
