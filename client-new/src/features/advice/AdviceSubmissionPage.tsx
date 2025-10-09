import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { supabase } from '@/core/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { FileUpload } from '@/shared/components/FileUpload';

interface AdviceRecord {
  id: number;
  school_id: string;
  stage: string;
  advice_giver_people_id: string | null;
  advice_giver_guide_id: string | null;
  advice_requested_date: string | null;
  advice_text: string | null;
  advice_docs_object_ids: string[] | null;
  advice_docs_public_urls: string[] | null;
  advice_submitted: boolean | null;
  advice_given_date: string | null;
}

interface SchoolInfo {
  long_name: string;
}

export const AdviceSubmissionPage: React.FC = () => {
  const [, params] = useRoute('/advice/submit/:token');
  const token = params?.token;

  const [loading, setLoading] = useState(true);
  const [adviceRecord, setAdviceRecord] = useState<AdviceRecord | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [giverName, setGiverName] = useState<string>('');
  const [adviceText, setAdviceText] = useState('');
  const [uploadedObjectIds, setUploadedObjectIds] = useState<string[]>([]);
  const [uploadedPublicUrls, setUploadedPublicUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadAdviceData();
    }
  }, [token]);

  const loadAdviceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load the advice record by token (assuming token is the advice ID for now)
      // In production, you'd want to generate and store unique tokens
      const { data: advice, error: adviceError } = await supabase
        .from('advice')
        .select('*')
        .eq('id', token)
        .single();

      if (adviceError || !advice) {
        setError('Advice request not found. Please check your link.');
        setLoading(false);
        return;
      }

      setAdviceRecord(advice);
      setAdviceText(advice.advice_text || '');
      setUploadedObjectIds(advice.advice_docs_object_ids || []);
      setUploadedPublicUrls(advice.advice_docs_public_urls || []);

      if (advice.advice_submitted) {
        setSubmitted(true);
      }

      // Load school info
      const { data: school } = await supabase
        .from('schools')
        .select('long_name')
        .eq('id', advice.school_id)
        .single();

      if (school) {
        setSchoolInfo(school);
      }

      // Get giver name
      if (advice.advice_giver_people_id) {
        const { data: person } = await supabase
          .from('people')
          .select('first_name, last_name')
          .eq('id', advice.advice_giver_people_id)
          .single();
        if (person) {
          setGiverName(`${person.first_name} ${person.last_name}`);
        }
      } else if (advice.advice_giver_guide_id) {
        setGiverName(advice.advice_giver_guide_id);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading advice data:', err);
      setError('Failed to load advice request. Please try again.');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adviceRecord) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('advice')
        .update({
          advice_text: adviceText,
          advice_docs_object_ids: uploadedObjectIds,
          advice_docs_public_urls: uploadedPublicUrls,
        })
        .eq('id', adviceRecord.id);

      if (error) throw error;

      alert('Your advice has been saved as a draft.');
      setSaving(false);
    } catch (err) {
      console.error('Error saving advice:', err);
      alert('Failed to save advice. Please try again.');
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!adviceRecord) return;

    try {
      setSaving(true);
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('advice')
        .update({
          advice_text: adviceText,
          advice_docs_object_ids: uploadedObjectIds,
          advice_docs_public_urls: uploadedPublicUrls,
          advice_given_date: today,
          advice_submitted: true,
        })
        .eq('id', adviceRecord.id);

      if (error) throw error;

      setSubmitted(true);
      setSaving(false);

      // TODO: Send email notification to TLs (will be implemented later)
    } catch (err) {
      console.error('Error submitting advice:', err);
      alert('Failed to submit advice. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted || adviceRecord?.advice_submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700">
            Your advice has been submitted successfully. The team appreciates your input!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Advice Panel</h1>

        <div className="mb-6 space-y-2 text-gray-700">
          <p><strong>School:</strong> {schoolInfo?.long_name || 'Loading...'}</p>
          <p><strong>Advice Stage:</strong> {adviceRecord?.stage}</p>
          <p><strong>Advice Giver:</strong> {giverName}</p>
          <p><strong>Requested Date:</strong> {adviceRecord?.advice_requested_date}</p>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">
            Please share your advice with the team in the text box below, and/or by uploading any documents.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
            <textarea
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              className="w-full h-64 border border-gray-300 rounded-md p-4 text-base"
              placeholder="Enter your advice here..."
            />
          </div>

          <FileUpload
            bucket="Advice"
            onUploadComplete={(objectIds, publicUrls) => {
              setUploadedObjectIds(prev => [...prev, ...objectIds]);
              setUploadedPublicUrls(prev => [...prev, ...publicUrls]);
            }}
            existingUrls={uploadedPublicUrls}
            label="Upload Documents (Optional)"
          />

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
            >
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !adviceText.trim()}
            >
              {saving ? 'Submitting...' : 'Submit Advice'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
