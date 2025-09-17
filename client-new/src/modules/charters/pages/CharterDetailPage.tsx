import React from 'react';
import { useCharterDetails } from '../api/queries';
import { CHARTER_DETAIL_TABS, CHARTER_FIELD_METADATA } from '../constants';
import { DetailsRenderer } from '../../shared/details-renderer';

export function CharterDetailPage({ params }: { params: { id: string } }) {
  const charterId = params.id;
  const { data, isLoading } = useCharterDetails(charterId);

  if (isLoading) return <div>Loading charter...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <DetailsRenderer
      entityId={charterId}
      details={data as any}
      tabs={CHARTER_DETAIL_TABS}
      fieldMeta={CHARTER_FIELD_METADATA}
      resolveTitle={(details) => details.short_name ?? details.full_name ?? charterId}
    />
  );
}
