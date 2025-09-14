/**
 * InfoCard - Elegant architecture version
 * Uses new repository pattern for field-level updates
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X } from 'lucide-react';
import { schoolsRepository, educatorsRepository } from '@/lib/repositories';

interface InfoCardProps {
  title: string;
  description?: string;
  data: Record<string, any>;
  entityType: 'school' | 'educator';
  entityId: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'phone' | 'url';
    editable?: boolean;
  }>;
}

export function InfoCard({ title, description, data, entityType, entityId, fields }: InfoCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Use repository for field updates
  const schoolUpdateField = schoolsRepository.useUpdateField();
  const educatorUpdateField = educatorsRepository.useUpdateField();

  const updateField = entityType === 'school' ? schoolUpdateField : educatorUpdateField;

  const handleEdit = (fieldKey: string) => {
    setEditingField(fieldKey);
    setEditValue(String(data[fieldKey] || ''));
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      await updateField.mutateAsync({
        id: entityId,
        field: editingField,
        value: editValue,
      });
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update field:', error);
      // In a real app, show toast notification
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (field: typeof fields[0]) => {
    const isEditing = editingField === field.key;
    const value = data[field.key];

    if (isEditing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{field.label}:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateField.isPending}
                className="h-6 px-2"
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-6 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {field.type === 'textarea' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
              rows={3}
            />
          ) : (
            <Input
              type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-slate-700">{field.label}:</span>
          <div className="text-sm text-slate-900 mt-1">
            {field.type === 'email' && value ? (
              <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
                {value}
              </a>
            ) : field.type === 'url' && value ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {value}
              </a>
            ) : field.type === 'phone' && value ? (
              <a href={`tel:${value}`} className="text-blue-600 hover:underline">
                {value}
              </a>
            ) : (
              <span>{value || '-'}</span>
            )}
          </div>
        </div>
        {field.editable !== false && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(field.key)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>{renderField(field)}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}