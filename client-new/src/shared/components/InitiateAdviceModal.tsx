import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/ui/button';
import { supabase } from '@/core/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

type AdviceStage = 'Visioning' | 'Planning';

interface InitiateAdviceModalProps {
  schoolId: string;
  stage: AdviceStage;
  onClose: () => void;
  onSuccess: () => void;
}

interface Person {
  id: string;
  first_name: string;
  last_name: string;
}

interface Guide {
  email_or_name: string;
}

export const InitiateAdviceModal: React.FC<InitiateAdviceModalProps> = ({
  schoolId,
  stage,
  onClose,
  onSuccess,
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load non-archived people
    const { data: peopleData } = await supabase
      .from('people')
      .select('id, first_name, last_name')
      .eq('is_archived', false)
      .order('last_name');

    if (peopleData) setPeople(peopleData);

    // Load active, non-archived guides
    const { data: guidesData } = await supabase
      .from('guides')
      .select('email_or_name')
      .eq('is_active', true)
      .eq('is_archived', false)
      .order('email_or_name');

    if (guidesData) setGuides(guidesData);

    // Load school name
    const { data: schoolData } = await supabase
      .from('schools')
      .select('short_name')
      .eq('id', schoolId)
      .single();

    if (schoolData) setSchoolName(schoolData.short_name);
  };

  const handleInitiate = async () => {
    try {
      setLoading(true);

      // Create advice records for each selected person
      const adviceRecords = [];
      const today = new Date().toISOString().split('T')[0];

      for (const personId of selectedPeople) {
        adviceRecords.push({
          school_id: schoolId,
          advice_giver_people_id: personId,
          advice_requested_date: today,
          stage,
          advice_submitted: false,
          advice_loop_closed: false,
        });
      }

      for (const guideEmail of selectedGuides) {
        adviceRecords.push({
          school_id: schoolId,
          advice_giver_guide_id: guideEmail,
          advice_requested_date: today,
          stage,
          advice_submitted: false,
          advice_loop_closed: false,
        });
      }

      // Insert advice records
      const { error: adviceError } = await supabase
        .from('advice')
        .insert(adviceRecords);

      if (adviceError) throw adviceError;

      // Update school_ssj_data status
      const statusField = stage === 'Visioning' ? 'visioning_advice_loop_status' : 'planning_advice_loop_status';
      const { error: statusError } = await supabase
        .from('school_ssj_data')
        .update({ [statusField]: 'Open' })
        .eq('school_id', schoolId);

      if (statusError) throw statusError;

      // TODO: Send emails to panel members
      // This would require a Supabase Edge Function to send emails
      console.log('TODO: Send advice request emails to panel members');

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error initiating advice:', error);
      alert('Failed to initiate advice process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePerson = (personId: string) => {
    setSelectedPeople(prev =>
      prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
    );
  };

  const toggleGuide = (guideEmail: string) => {
    setSelectedGuides(prev =>
      prev.includes(guideEmail) ? prev.filter(email => email !== guideEmail) : [...prev, guideEmail]
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Initiate {stage} Advice</h2>
        <p className="text-gray-600 mb-6">
          Select team leaders and partner members to participate in the advice panel for {schoolName}.
        </p>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">TL Members of the Panel:</h3>
          <div className="border rounded p-4 max-h-60 overflow-y-auto">
            {people.map((person) => (
              <label key={person.id} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedPeople.includes(person.id)}
                  onChange={() => togglePerson(person.id)}
                  className="w-4 h-4"
                />
                <span>{person.first_name} {person.last_name}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{selectedPeople.length} selected</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Partner Members of the Panel:</h3>
          <div className="border rounded p-4 max-h-60 overflow-y-auto">
            {guides.map((guide) => (
              <label key={guide.email_or_name} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedGuides.includes(guide.email_or_name)}
                  onChange={() => toggleGuide(guide.email_or_name)}
                  className="w-4 h-4"
                />
                <span>{guide.email_or_name}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{selectedGuides.length} selected</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleInitiate}
            disabled={loading || (selectedPeople.length === 0 && selectedGuides.length === 0)}
          >
            {loading ? 'Initiating...' : 'Initiate Requests'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
