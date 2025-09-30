import React from 'react';
import { useSchoolDetails } from '../api/queries';
import { SCHOOL_FIELD_METADATA } from '../views';
import { SCHOOL_VIEW_SPEC } from '../views';
import { asTabs } from '../../shared/views/types';
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
      tabs={asTabs(SCHOOL_VIEW_SPEC)}
      fieldMeta={SCHOOL_FIELD_METADATA}
      defaultWriteTo={{ table: 'schools', pk: 'id' }}
      defaultWriteOrder={['schools','schools_ssj_data']}
      resolveTitle={(details) => details.school_name ?? details.long_name ?? details.short_name ?? schoolId}
    />
  );
}
