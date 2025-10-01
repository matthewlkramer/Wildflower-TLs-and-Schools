import {
  isEmail,
  normalizeEmail,
  isPhoneE164,
  normalizePhoneToE164,
  isEIN,
  normalizeEIN
} from '../../validators';
import type { FieldMetadata } from '../../detail-types';

export interface ValidationResult {
  isValid: boolean;
  value: any;
  error?: string;
}

/**
 * Validate and normalize a field value based on its metadata
 */
export function validateField(
  fieldName: string,
  value: any,
  meta?: FieldMetadata
): ValidationResult {
  // Skip validation for null/undefined/empty
  if (value == null || value === '') {
    // Check if required
    if (meta?.required) {
      return {
        isValid: false,
        value,
        error: `${meta.label || fieldName} is required`
      };
    }
    return { isValid: true, value };
  }

  const label = meta?.label || fieldName;
  const lowerName = fieldName.toLowerCase();
  const lowerLabel = label.toLowerCase();

  // Email validation
  if (meta?.type === 'email' || lowerName.includes('email') || lowerLabel.includes('email')) {
    const str = String(value).trim();
    if (!isEmail(str)) {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid email address`
      };
    }
    return {
      isValid: true,
      value: normalizeEmail(str)
    };
  }

  // Phone validation
  if (meta?.type === 'phone' || lowerName.includes('phone') || lowerLabel.includes('phone')) {
    const str = String(value).trim();
    const normalized = normalizePhoneToE164(str);
    if (!normalized || !isPhoneE164(normalized)) {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid phone number`
      };
    }
    return {
      isValid: true,
      value: normalized
    };
  }

  // EIN validation
  if (lowerName === 'ein' || lowerLabel.includes('ein')) {
    const str = String(value).trim();
    const normalized = normalizeEIN(str);
    if (!normalized || !isEIN(normalized)) {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid EIN (XX-XXXXXXX format)`
      };
    }
    return {
      isValid: true,
      value: normalized
    };
  }

  // Number validation
  if (meta?.type === 'number') {
    const num = Number(value);
    if (isNaN(num)) {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid number`
      };
    }

    // Check min/max
    if (meta.min !== undefined && num < meta.min) {
      return {
        isValid: false,
        value,
        error: `${label}: Value must be at least ${meta.min}`
      };
    }
    if (meta.max !== undefined && num > meta.max) {
      return {
        isValid: false,
        value,
        error: `${label}: Value must be at most ${meta.max}`
      };
    }

    return { isValid: true, value: num };
  }

  // String length validation
  if (typeof value === 'string') {
    if (meta?.minLength && value.length < meta.minLength) {
      return {
        isValid: false,
        value,
        error: `${label}: Must be at least ${meta.minLength} characters`
      };
    }
    if (meta?.maxLength && value.length > meta.maxLength) {
      return {
        isValid: false,
        value,
        error: `${label}: Must be at most ${meta.maxLength} characters`
      };
    }
  }

  // Array validation
  if (Array.isArray(value)) {
    // Filter out empty strings from arrays (common with enum[] columns)
    const filtered = value.filter(v => v !== '');

    if (meta?.required && filtered.length === 0) {
      return {
        isValid: false,
        value,
        error: `${label}: At least one value is required`
      };
    }

    return { isValid: true, value: filtered };
  }

  // URL validation
  if (meta?.type === 'url' || lowerName.includes('url') || lowerName.includes('website')) {
    const str = String(value).trim();
    try {
      new URL(str.startsWith('http') ? str : `https://${str}`);
      return { isValid: true, value: str };
    } catch {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid URL`
      };
    }
  }

  // Date validation
  if (meta?.type === 'date' || meta?.type === 'datetime') {
    const dateStr = String(value).trim();
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        value,
        error: `${label}: Please enter a valid date`
      };
    }
    return { isValid: true, value: dateStr };
  }

  // Default: pass through
  return { isValid: true, value };
}

/**
 * Validate multiple fields at once
 */
export function validateFields(
  values: Record<string, any>,
  metadata: Record<string, FieldMetadata>
): {
  isValid: boolean;
  values: Record<string, any>;
  errors: Record<string, string>;
} {
  const validated: Record<string, any> = {};
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, value] of Object.entries(values)) {
    const meta = metadata[field];
    const result = validateField(field, value, meta);

    if (result.isValid) {
      validated[field] = result.value;
    } else {
      isValid = false;
      errors[field] = result.error || 'Invalid value';
      validated[field] = value; // Keep original value
    }
  }

  return { isValid, values: validated, errors };
}

/**
 * Check if a field should be shown based on conditions
 */
export function shouldShowField(
  field: string,
  meta: FieldMetadata | undefined,
  allValues: Record<string, any>
): boolean {
  if (!meta) return true;
  if (meta.hidden) return false;

  // Check conditional visibility
  if (meta.showIf) {
    const condition = meta.showIf;
    const compareValue = allValues[condition.field];

    switch (condition.operator) {
      case '==':
      case '=':
        return compareValue == condition.value;
      case '!=':
      case '<>':
        return compareValue != condition.value;
      case 'in':
        return Array.isArray(condition.value) ?
          condition.value.includes(compareValue) :
          compareValue == condition.value;
      case 'not in':
        return Array.isArray(condition.value) ?
          !condition.value.includes(compareValue) :
          compareValue != condition.value;
      case 'is null':
        return compareValue == null;
      case 'is not null':
        return compareValue != null;
      default:
        return true;
    }
  }

  return true;
}