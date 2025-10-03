import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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

    return (
      <div key={field.field} className="space-y-2">
        <Label htmlFor={field.field} className="text-sm font-medium text-gray-700">
          {field.label}
          {field.value.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {isEditing && field.value.editable ? (
          <div className="space-y-1">
            {renderEditControl(field, currentValue)}
            {hasError && (
              <p className="text-sm text-red-600">{hasError}</p>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-900">
            {renderDisplayValue(field.value, field.field)}
          </div>
        )}
      </div>
    );
  };

  const renderEditControl = (field: CardField, value: any): React.ReactNode => {
    const { type, options, multiline } = field.value;

    // Select dropdown for enum/lookup fields
    if (options && options.length > 0) {
      return (
        <Select
          value={String(value || '')}
          onValueChange={(newValue) => handleFieldChange(field.field, newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Select --" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">-- Select --</SelectItem>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Boolean checkbox
    if (type === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <input
            id={field.field}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(field.field, e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor={field.field} className="text-sm">
            {field.label}
          </Label>
        </div>
      );
    }

    // Date input
    if (type === 'date') {
      const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
      return (
        <Input
          type="date"
          value={dateValue}
          onChange={(e) => handleFieldChange(field.field, e.target.value)}
        />
      );
    }

    // Multiline textarea
    if (multiline) {
      return (
        <textarea
          value={String(value || '')}
          onChange={(e) => handleFieldChange(field.field, e.target.value)}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-y"
          rows={4}
        />
      );
    }

    // Regular input
    return (
      <Input
        type={type === 'number' ? 'number' : 'text'}
        value={String(value || '')}
        onChange={(e) => {
          const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
          handleFieldChange(field.field, newValue);
        }}
      />
    );
  };

  const renderDisplayValue = (fieldValue: FieldValue, fieldName: string): React.ReactNode => {
    if (!fieldValue.display) {
      return <span className="text-gray-400 italic">No value</span>;
    }

    // Handle attachment fields
    if (fieldValue.type === 'attachment' && fieldValue.raw) {
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
    <Card className={className}>
      <CardHeader>
        {/* Header with title and edit controls */}
        <div className="flex items-center justify-between">
          {showTitle && card.title && (
            <CardTitle className="text-lg">{card.title}</CardTitle>
          )}

          {/* Edit Controls */}
          {card.editable && onSave && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    size="sm"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={saving}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStartEdit}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Fields */}
        <div className={`grid gap-6 ${
          layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}>
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
      </CardContent>
    </Card>
  );
};