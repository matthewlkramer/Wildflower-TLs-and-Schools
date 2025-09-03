// Centralized constants for the Wildflower application

export const CACHE_TTL = {
  DEFAULT: 5 * 60 * 1000, // 5 minutes
  SHORT: 1 * 60 * 1000,   // 1 minute
  LONG: 15 * 60 * 1000,   // 15 minutes
} as const;

export const STATUS_COLORS = {
  red: 'bg-red-500 text-white hover:bg-red-600',
  orange: 'bg-orange-500 text-white hover:bg-orange-600',
  yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
  green: 'bg-green-500 text-white hover:bg-green-600',
  gray: 'bg-gray-400 text-white hover:bg-gray-500',
  default: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
} as const;

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data',
  UPDATE_FAILED: 'Failed to update record',
  CREATE_FAILED: 'Failed to create record',
  DELETE_FAILED: 'Failed to delete record',
  PERMISSION_DENIED: 'You do not have permission to access this resource',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_DATA: 'Invalid data provided'
} as const;

