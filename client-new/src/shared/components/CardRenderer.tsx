import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/ui/button';
import { FieldEditor } from './FieldEditor';
import type { RenderableCard, CardField, FieldValue } from '../services/card-service';

export type CardRendererProps = {
  card: RenderableCard;
  onSave?: (changedValues: Record<string, any>) => Promise<void>;
  className?: string;
  layout?: 'single-column' | 'two-column';
  showTitle?: boolean;
};

export const CardRenderer: React.FC<CardRendererProps> = ({
  card,
  onSave,
  className = '',
  layout = 'single-column',
  showTitle = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    console.log('imagePreview state changed:', imagePreview);
  }, [imagePreview]);

  const handleStartEdit = () => {
    setIsEditing(true);
    // Initialize edit values with current values
    const initialValues: Record<string, any> = {};
    card.fields.forEach(field => {
      initialValues[field.field] = field.value.raw;
    });
    setEditValues(initialValues);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues({});
    setErrors({});
  };

  const handleSaveEdit = async () => {
    if (!onSave) return;

    // Validate all fields
    const validationErrors: Record<string, string> = {};
    card.fields.forEach(field => {
      if (field.field in editValues) {
        const error = validateFieldValue(field, editValues[field.field]);
        if (error) {
          validationErrors[field.field] = error;
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      // Only save changed values
      const changedValues: Record<string, any> = {};
      card.fields.forEach(field => {
        if (field.field in editValues && editValues[field.field] !== field.value.raw) {
          changedValues[field.field] = editValues[field.field];
        }
      });

      if (Object.keys(changedValues).length > 0) {
        await onSave(changedValues);
      }

      setIsEditing(false);
      setEditValues({});
      setErrors({});
    } catch (error) {
      console.error('Save failed:', error);
      // TODO: Show error message to user
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setEditValues(prev => ({ ...prev, [fieldName]: value }));
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const renderField = (field: CardField): React.ReactNode => {
    const currentValue = isEditing ? (editValues[field.field] ?? field.value.raw) : field.value.raw;
    const hasError = errors[field.field];

    // Check visibleIf condition
    if (field.metadata.visibleIf) {
      const { field: conditionField, in: allowedValues } = field.metadata.visibleIf;
      const conditionValue = isEditing ? (editValues[conditionField] ?? card.fields.find(f => f.field === conditionField)?.value.raw) : card.fields.find(f => f.field === conditionField)?.value.raw;

      // If the condition field's value is not in the allowed values, don't render this field
      if (!conditionValue || !allowedValues?.includes(conditionValue)) {
        return null;
      }
    }

    return (
      <div key={field.field} style={{ fontSize: 12 }}>
        <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>
          {field.label}
          {field.value.required && <span className="text-red-500 ml-1">*</span>}
        </div>

        {isEditing && field.value.editable ? (
          <div>
            {renderEditControl(field, currentValue)}
            {hasError && (
              <p style={{ fontSize: 11, color: '#dc2626', marginTop: 2 }}>{hasError}</p>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 12 }}>
            {renderDisplayValue(field.value, field.field)}
          </div>
        )}
      </div>
    );
  };

  const renderEditControl = (field: CardField, value: any): React.ReactNode => {
    return (
      <FieldEditor
        value={value}
        fieldValue={field.value}
        onChange={(newValue) => handleFieldChange(field.field, newValue)}
      />
    );
  };

  const renderDisplayValue = (fieldValue: FieldValue, fieldName: string): React.ReactNode => {
    if (!fieldValue.display) {
      return '';
    }

    // Handle attachment fields
    if (fieldValue.type === 'attachment' && fieldValue.raw) {
      // Check if this is a logo/image field by name or isImage flag
      const isLogo = fieldName.toLowerCase().includes('logo') || fieldValue.isImage;

      if (isLogo) {
        return (
          <img
            src={fieldValue.raw}
            alt={fieldValue.display}
            className="object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
            onClick={() => {
              console.log('Logo clicked in CardRenderer! URL:', fieldValue.raw);
              setImagePreview(fieldValue.raw);
            }}
          />
        );
      }

      return (
        <a
          href={fieldValue.raw}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          📎 {fieldValue.display}
        </a>
      );
    }

    // Handle URL fields (website, facebook, instagram)
    if (fieldValue.type === 'url' && fieldValue.raw) {
      const url = fieldValue.raw.startsWith('http') ? fieldValue.raw : `https://${fieldValue.raw}`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {fieldValue.display}
        </a>
      );
    }

    // Handle email fields - make them clickable to compose email
    if (fieldName.toLowerCase().includes('email') && fieldValue.raw && typeof fieldValue.raw === 'string' && fieldValue.raw.includes('@')) {
      return (
        <a
          href={`/email/compose?to=${encodeURIComponent(fieldValue.raw)}`}
          className="text-blue-600 hover:underline"
        >
          {fieldValue.display}
        </a>
      );
    }

    // Handle multiline text
    if (fieldValue.multiline) {
      return (
        <div className="whitespace-pre-wrap">
          {fieldValue.display}
        </div>
      );
    }

    return fieldValue.display;
  };

  const validateFieldValue = (field: CardField, value: any): string | null => {
    const { validation, required } = field.value;

    // Required validation
    if (required && (value === null || value === undefined || value === '')) {
      return `${field.label} is required`;
    }

    if (!validation) return null;

    const stringValue = String(value || '');

    // Length validation
    if (validation.minLength && stringValue.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && stringValue.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    // Pattern validation
    if (validation.pattern && !new RegExp(validation.pattern).test(stringValue)) {
      return `${field.label} format is invalid`;
    }

    // Custom validation
    if (validation.customValidator) {
      return validation.customValidator(value);
    }

    return null;
  };

  if (card.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (card.error) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded">
        <div className="text-red-700">Error: {card.error}</div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      {(showTitle && card.title) || (card.editable && onSave) ? (
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {showTitle && card.title && (
            <h3 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
              {card.title}
            </h3>
          )}

          {/* Edit Controls */}
          {card.editable && onSave && (
            <div style={{ display: 'flex', gap: 6 }}>
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    size="sm"
                    style={{ fontSize: 11, height: 26, padding: '0 10px' }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={saving}
                    size="sm"
                    style={{ fontSize: 11, height: 26, padding: '0 10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStartEdit}
                  variant="outline"
                  size="sm"
                  style={{ fontSize: 11, height: 26, padding: '0 10px' }}
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Content */}
      <div style={{ padding: '12px' }}>
        {/* Fields - 2 column grid like old UI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {card.fields.map(field => renderField(field))}
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {imagePreview && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => {
            console.log('Modal background clicked, closing');
            setImagePreview(null);
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white p-4 rounded-lg">
            <img
              src={imagePreview}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              style={{ width: 32, height: 32 }}
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};