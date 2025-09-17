import React from 'react';
import { useSchoolDetails } from '../api/queries';
import { SCHOOL_DETAIL_TABS, SCHOOL_FIELD_METADATA } from '../constants';
import { DetailsRenderer } from '../../shared/details-renderer';

export function SchoolDetailPage({ params }: { params: { id: string } }) {
  const schoolId = params.id;
  const { data, isLoading } = useSchoolDetails(schoolId);

  if (isLoading) return <div>Loading school...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <DetailsRenderer
      entityId={schoolId}
      details={data as any}
      tabs={SCHOOL_DETAIL_TABS}
      fieldMeta={SCHOOL_FIELD_METADATA}
      resolveTitle={(details) => details.school_name ?? details.long_name ?? details.short_name ?? schoolId}
    />
  );
}
