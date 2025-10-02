import React from 'react';
import { useCharterDetails } from '../api/queries';
import { CHARTER_FIELD_METADATA } from '../views';
import { CHARTER_VIEW_SPEC } from '../views';
import { asTabs } from '@/shared/views/types';
import { DetailsRenderer } from '@/shared/components';

export function CharterDetailPage({ params }: { params: { id: string } }) {
  const charterId = params.id;
  const { data, isLoading } = useCharterDetails(charterId);

  if (isLoading) return <div>Loading charter...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <DetailsRenderer
      entityId={charterId}
      tabs={asTabs(CHARTER_VIEW_SPEC)}
    />
  );
}
