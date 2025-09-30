import React from 'react';
import { useEducatorDetails } from '../api/queries';
import { EDUCATOR_FIELD_METADATA } from '../views';
import { EDUCATOR_VIEW_SPEC } from '../views';
import { asTabs } from '../../shared/views/types';
import { DetailsRenderer } from '../../shared/details-renderer';

export function EducatorDetailPage({ params }: { params: { id: string } }) {
  const educatorId = params.id;
  const { data, isLoading } = useEducatorDetails(educatorId);

  if (isLoading) return <div>Loading educator...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <DetailsRenderer
      entityId={educatorId}
      details={data as any}
      tabs={asTabs(EDUCATOR_VIEW_SPEC)}
      fieldMeta={EDUCATOR_FIELD_METADATA}
      defaultWriteTo={{ table: 'people', pk: 'id' }}
      defaultWriteOrder={['people','people_educator_early_cultivation','people_systems']}
      resolveTitle={(details) => details.full_name ?? details.name ?? educatorId}
    />
  );
}
