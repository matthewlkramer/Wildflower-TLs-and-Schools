import React, { useState, useEffect } from 'react';
import { cardService, type CardField } from '../services/card-service';
import type { BannerSpec } from '../views/types';

export type BannerRendererProps = {
  banner: BannerSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
  className?: string;
};

export const BannerRenderer: React.FC<BannerRendererProps> = ({
  banner,
  entityId,
  sourceTable,
  fieldMetadata,
  className = '',
}) => {
  const [fields, setFields] = useState<CardField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    loadBannerData();
  }, [banner, entityId]);

  const loadBannerData = async () => {
    try {
      setLoading(true);
      console.log('[BannerRenderer] Loading banner data for entityId:', entityId, 'sourceTable:', sourceTable);
      console.log('[BannerRenderer] Banner spec:', banner);
      console.log('[BannerRenderer] Field metadata:', fieldMetadata);

      // Build list of all fields to load
      const allFields = [
        ...(banner.image ? [banner.image] : []),
        banner.title,
        ...banner.fields,
      ];
      console.log('[BannerRenderer] All fields to load:', allFields);

      // Load entity data
      const entityData = await cardService.loadEntityData(sourceTable, entityId);
      console.log('[BannerRenderer] Entity data loaded:', entityData);

      // Resolve fields
      const resolvedFields = await cardService.resolveFields(
        allFields,
        entityData,
        { table: sourceTable },
        fieldMetadata
      );
      console.log('[BannerRenderer] Resolved fields:', resolvedFields);

      setFields(resolvedFields);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load banner data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded">
        <div className="text-red-700">Error: {error}</div>
      </div>
    );
  }

  // Find specific fields
  const imageField = banner.image ? fields.find(f => f.field === banner.image) : undefined;
  const titleField = fields.find(f => f.field === banner.title);
  const statFields = fields.filter(f => banner.fields.includes(f.field));

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        {/* Image */}
        {imageField && imageField.value.raw && (
          <div style={{ flexShrink: 0 }}>
            <img
              src={imageField.value.raw}
              alt={titleField?.value.display || ''}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          {titleField && (
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: 16,
                wordWrap: 'break-word',
              }}
            >
              {titleField.value.display}
            </h1>
          )}

          {/* Stat Cards */}
          {statFields.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
              }}
            >
              {statFields.map(field => (
                <div
                  key={field.field}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#64748b',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    {field.label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {field.value.display || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
