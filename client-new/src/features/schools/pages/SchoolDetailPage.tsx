import React from 'react';
import { useSchoolDetails } from '../api/queries';
import { SCHOOL_FIELD_METADATA } from '../views';
import { SCHOOL_VIEW_SPEC } from '../views';
import { DetailsRenderer } from '@/shared/components';

export function SchoolDetailPage({ params }: { params: { id: string } }) {
  const schoolId = params.id;
  const { data, isLoading } = useSchoolDetails(schoolId);

  if (isLoading) return <div>Loading school...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <DetailsRenderer
      entityId={schoolId}
      view={SCHOOL_VIEW_SPEC}
    />
  );
}
