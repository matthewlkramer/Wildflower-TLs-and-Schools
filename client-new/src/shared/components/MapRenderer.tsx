import React, { useState, useEffect } from 'react';
import { cardService, type CardField } from '../services/card-service';
import type { MapSpec } from '../views/types';

export type MapRendererProps = {
  map: MapSpec;
  entityId: string;
  sourceTable: string;
  fieldMetadata?: import('../types/detail-types').FieldMetadataMap;
  className?: string;
};

export const MapRenderer: React.FC<MapRendererProps> = ({
  map,
  entityId,
  sourceTable,
  fieldMetadata,
  className = '',
}) => {
  const [fields, setFields] = useState<CardField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    loadMapData();
  }, [map, entityId]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      console.log('[MapRenderer] Loading map data for entityId:', entityId, 'sourceTable:', sourceTable);
      console.log('[MapRenderer] Map spec:', map);
      console.log('[MapRenderer] Field metadata:', fieldMetadata);

      // Load entity data
      const entityData = await cardService.loadEntityData(sourceTable, entityId);
      console.log('[MapRenderer] Entity data loaded:', entityData);

      // Resolve fields
      const resolvedFields = await cardService.resolveFields(
        map.fields,
        entityData,
        { table: sourceTable },
        fieldMetadata
      );
      console.log('[MapRenderer] Resolved fields:', resolvedFields);

      setFields(resolvedFields);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load map data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading map...</div>
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

  // Extract lat, lng, and address from fields
  // Expecting fields[0] = lat, fields[1] = lng, fields[2] = address
  const latField = fields[0];
  const lngField = fields[1];
  const addressField = fields[2];

  console.log('[MapRenderer] Extracted fields - lat:', latField, 'lng:', lngField, 'address:', addressField);
  console.log('[MapRenderer] Lat field value:', latField?.value);
  console.log('[MapRenderer] Lng field value:', lngField?.value);
  console.log('[MapRenderer] Address field value:', addressField?.value);

  const lat = latField?.value?.raw ? parseFloat(String(latField.value.raw)) : null;
  const lng = lngField?.value?.raw ? parseFloat(String(lngField.value.raw)) : null;
  const address = addressField?.value?.display || '';

  console.log('[MapRenderer] Parsed values - lat:', lat, 'lng:', lng, 'address:', address);

  // If no coordinates, show address only
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.log('[MapRenderer] No valid coordinates, showing address only');
    return (
      <div
        className={className}
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
            {map.title || 'Location'}
          </h3>
        </div>
        <div style={{ padding: 16 }}>
          {address ? (
            <div style={{ fontSize: 12, color: '#64748b' }}>{address}</div>
          ) : (
            <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
              No location coordinates available for this record
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get Google Maps API key from env
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Generate Google Maps link
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
          {map.title || 'Location'}
        </h3>
      </div>

      {/* Map content */}
      <div style={{ padding: 16 }}>
        {/* Google Maps embed with API key */}
        <div style={{ width: '100%', height: 300, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=14`}
            allowFullScreen
          />
        </div>

        {/* Address and link */}
        {address && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
            <div style={{ marginBottom: 8 }}>{address}</div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: 12,
              }}
            >
              Open in Google Maps →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
