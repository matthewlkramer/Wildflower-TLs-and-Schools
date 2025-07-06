// Centralized error handling for the server

import { ERROR_MESSAGES } from '@shared/constants';
import { getErrorMessage } from '@shared/utils';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.PERMISSION_DENIED) {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class AirtableError extends AppError {
  constructor(message: string, originalError?: unknown) {
    const errorMessage = originalError 
      ? `${message}: ${getErrorMessage(originalError)}`
      : message;
    super(errorMessage, 503, 'AIRTABLE_ERROR');
  }
}

/**
 * Safe error handler that properly types unknown errors
 */
export function handleError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode
    };
  }
  
  if (error instanceof Error) {
    // Check for Airtable specific errors
    if (error.message.includes('NOT_FOUND') || error.message.includes('Record not found')) {
      return {
        message: ERROR_MESSAGES.FETCH_FAILED,
        statusCode: 404
      };
    }
    
    if (error.message.includes('INVALID_REQUEST') || error.message.includes('Invalid request')) {
      return {
        message: ERROR_MESSAGES.INVALID_DATA,
        statusCode: 400
      };
    }
    
    if (error.message.includes('AUTHENTICATION_REQUIRED') || error.message.includes('Unauthorized')) {
      return {
        message: ERROR_MESSAGES.PERMISSION_DENIED,
        statusCode: 401
      };
    }
  }
  
  // Generic error fallback
  return {
    message: getErrorMessage(error),
    statusCode: 500
  };
}