import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/ui/button';
import { supabase } from '@/core/supabase/client';
import { useDialog } from '@/shared/components/ConfirmDialog';
import { FileUpload } from '@/shared/components/FileUpload';

type AdviceStage = 'Visioning' | 'Planning';

interface ConcludeAdviceModalProps {
  schoolId: string;
  stage: AdviceStage;
  onClose: () => void;
  onSuccess: () => void;
}

interface AdviceRecord {
  id: number;
  advice_giver_people_id: string | null;
  advice_giver_guide_id: string | null;
  advice_requested_date: string | null;
  advice_submitted: boolean | null;
  advice_given_date: string | null;
  advice_text: string | null;
  advice_docs_object_ids: string[] | null;
  advice_docs_public_urls: string[] | null;
  advice_loop_closed: boolean | null;
  advice_loop_closed_date: string | null;
  response_to_advice: string | null;
  loop_closing_object_ids: string[] | null;
  loop_closing_public_urls: string[] | null;
  giver_name?: string;
}

export const ConcludeAdviceModal: React.FC<ConcludeAdviceModalProps> = ({
  schoolId,
  stage,
  onClose,
  onSuccess,
}) => {
  const [adviceRecords, setAdviceRecords] = useState<AdviceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AdviceRecord | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'enterAdvice' | 'enterResponse' | 'viewDetails'>('list');
  const [editingText, setEditingText] = useState('');
  const [uploadedObjectIds, setUploadedObjectIds] = useState<string[]>([]);
  const [uploadedPublicUrls, setUploadedPublicUrls] = useState<string[]>([]);
  const dialog = useDialog();

  useEffect(() => {
    loadAdviceRecords();
  }, []);

  const loadAdviceRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advice')
        .select('*')
        .eq('school_id', schoolId)
        .eq('stage', stage);

      if (error) throw error;

      // Enrich with people/guide names
      const enriched = await Promise.all((data || []).map(async (record) => {
        let giver_name = 'Unknown';

        if (record.advice_giver_people_id) {
          const { data: personData } = await supabase
            .from('people')
            .select('first_name, last_name')
            .eq('id', record.advice_giver_people_id)
            .single();
          if (personData) giver_name = `${personData.first_name} ${personData.last_name}`;
        } else if (record.advice_giver_guide_id) {
          giver_name = record.advice_giver_guide_id;
        }

        return { ...record, giver_name };
      }));

      setAdviceRecords(enriched);
    } catch (error) {
      console.error('Error loading advice records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterAdvice = async () => {
    if (!selectedRecord) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Merge existing URLs with new uploads
      const existingObjectIds = selectedRecord.advice_docs_object_ids || [];
      const existingUrls = selectedRecord.advice_docs_public_urls || [];
      const allObjectIds = [...existingObjectIds, ...uploadedObjectIds];
      const allUrls = [...existingUrls, ...uploadedPublicUrls];

      const { error } = await supabase
        .from('advice')
        .update({
          advice_text: editingText,
          advice_given_date: today,
          advice_submitted: true,
          advice_docs_object_ids: allObjectIds,
          advice_docs_public_urls: allUrls,
        })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      await loadAdviceRecords();
      setViewMode('list');
      setSelectedRecord(null);
      setEditingText('');
      setUploadedObjectIds([]);
      setUploadedPublicUrls([]);
    } catch (error) {
      console.error('Error saving advice:', error);
      alert('Failed to save advice');
    }
  };

  const handleEnterResponse = async () => {
    if (!selectedRecord) return;

    try {
      // Merge existing URLs with new uploads
      const existingObjectIds = selectedRecord.loop_closing_object_ids || [];
      const existingUrls = selectedRecord.loop_closing_public_urls || [];
      const allObjectIds = [...existingObjectIds, ...uploadedObjectIds];
      const allUrls = [...existingUrls, ...uploadedPublicUrls];

      const { error } = await supabase
        .from('advice')
        .update({
          response_to_advice: editingText,
          loop_closing_object_ids: allObjectIds,
          loop_closing_public_urls: allUrls,
        })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      await loadAdviceRecords();
      setViewMode('list');
      setSelectedRecord(null);
      setEditingText('');
      setUploadedObjectIds([]);
      setUploadedPublicUrls([]);
    } catch (error) {
      console.error('Error saving response:', error);
      alert('Failed to save response');
    }
  };

  const handleCloseLoop = async (record: AdviceRecord) => {
    const confirmed = await dialog.confirm(
      'Mark this advice loop as closed? The advice giver will be notified that you have responded.',
      { title: 'Close Advice Loop', variant: 'warning' }
    );

    if (!confirmed) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('advice')
        .update({
          advice_loop_closed: true,
          advice_loop_closed_date: today,
        })
        .eq('id', record.id);

      if (error) throw error;

      await loadAdviceRecords();
    } catch (error) {
      console.error('Error closing loop:', error);
      alert('Failed to close advice loop');
    }
  };

  const handleReopenLoop = async (record: AdviceRecord) => {
    try {
      const { error } = await supabase
        .from('advice')
        .update({
          advice_loop_closed: false,
          advice_loop_closed_date: null,
        })
        .eq('id', record.id);

      if (error) throw error;

      await loadAdviceRecords();
    } catch (error) {
      console.error('Error reopening loop:', error);
      alert('Failed to reopen advice loop');
    }
  };

  const handleConclude = async () => {
    const allClosed = adviceRecords.every(r => r.advice_loop_closed);

    const message = allClosed
      ? 'Are you ready to end this phase of the advice process?'
      : 'Not all advice has been given and responded to. Are you sure you want to end this phase of the advice process?';

    const confirmed = await dialog.confirm(message, {
      title: 'Conclude Advice Process',
      variant: 'warning',
    });

    if (!confirmed) return;

    try {
      const statusField = stage === 'Visioning' ? 'visioning_advice_loop_status' : 'planning_advice_loop_status';
      const { error } = await supabase
        .from('school_ssj_data')
        .update({ [statusField]: 'Complete' })
        .eq('school_id', schoolId);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error concluding advice:', error);
      alert('Failed to conclude advice process');
    }
  };

  if (viewMode === 'enterAdvice' && selectedRecord) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-4">Enter Advice for {selectedRecord.giver_name}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advice Text</label>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full h-64 border rounded p-3"
                placeholder="Enter advice text..."
              />
            </div>
            <FileUpload
              bucket="Advice"
              onUploadComplete={(objectIds, publicUrls) => {
                setUploadedObjectIds(prev => [...prev, ...objectIds]);
                setUploadedPublicUrls(prev => [...prev, ...publicUrls]);
              }}
              existingUrls={selectedRecord.advice_docs_public_urls || []}
              label="Upload Advice Documents"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => {
              setViewMode('list');
              setSelectedRecord(null);
              setEditingText('');
              setUploadedObjectIds([]);
              setUploadedPublicUrls([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEnterAdvice}>Save Advice</Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (viewMode === 'enterResponse' && selectedRecord) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-4">Enter Response to {selectedRecord.giver_name}'s Advice</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Text</label>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full h-64 border rounded p-3"
                placeholder="Enter your response..."
              />
            </div>
            <FileUpload
              bucket="Advice"
              onUploadComplete={(objectIds, publicUrls) => {
                setUploadedObjectIds(prev => [...prev, ...objectIds]);
                setUploadedPublicUrls(prev => [...prev, ...publicUrls]);
              }}
              existingUrls={selectedRecord.loop_closing_public_urls || []}
              label="Upload Response Documents"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => {
              setViewMode('list');
              setSelectedRecord(null);
              setEditingText('');
              setUploadedObjectIds([]);
              setUploadedPublicUrls([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEnterResponse}>Save Response</Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (viewMode === 'viewDetails' && selectedRecord) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 10000 }}>
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-4">Advice from {selectedRecord.giver_name}</h3>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Advice:</h4>
            <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{selectedRecord.advice_text || 'No advice provided yet'}</p>
            {selectedRecord.advice_docs_public_urls && selectedRecord.advice_docs_public_urls.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-semibold">Documents:</h5>
                {selectedRecord.advice_docs_public_urls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                    Document {idx + 1}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Response:</h4>
            <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">{selectedRecord.response_to_advice || 'No response provided yet'}</p>
            {selectedRecord.loop_closing_public_urls && selectedRecord.loop_closing_public_urls.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-semibold">Documents:</h5>
                {selectedRecord.loop_closing_public_urls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                    Document {idx + 1}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => { setViewMode('list'); setSelectedRecord(null); }}>Close</Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Conclude {stage} Advice</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {adviceRecords.map((record) => (
                <div key={record.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{record.giver_name}</h3>
                      <p className="text-sm text-gray-600">
                        Requested: {record.advice_requested_date || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className={record.advice_submitted ? 'text-green-600' : 'text-gray-400'}>
                        {record.advice_submitted ? '✓ Submitted' : '✗ Not Submitted'}
                      </div>
                      <div className={record.advice_loop_closed ? 'text-green-600' : 'text-gray-400'}>
                        {record.advice_loop_closed ? '✓ Loop Closed' : '✗ Loop Open'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(record);
                        setEditingText(record.advice_text || '');
                        setViewMode('enterAdvice');
                      }}
                    >
                      Enter/Upload Advice
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(record);
                        setEditingText(record.response_to_advice || '');
                        setViewMode('enterResponse');
                      }}
                    >
                      Enter/Upload Response
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(record);
                        setViewMode('viewDetails');
                      }}
                    >
                      View Details
                    </Button>
                    {!record.advice_loop_closed ? (
                      <Button
                        size="sm"
                        onClick={() => handleCloseLoop(record)}
                      >
                        Close Loop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReopenLoop(record)}
                      >
                        Reopen Loop
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConclude}>
                Proceed
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
