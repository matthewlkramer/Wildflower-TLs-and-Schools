// Centralized constants for the Wildflower application

export const CACHE_TTL = {
  DEFAULT: 5 * 60 * 1000, // 5 minutes
  SHORT: 1 * 60 * 1000,   // 1 minute
  LONG: 15 * 60 * 1000,   // 15 minutes
} as const;

export const STATUS_TYPES = {
  CLOSED: ['Closed', 'Left network', 'Dissolved'],
  VISIONING: ['Visioning'],
  PLANNING: ['Planning'],
  STARTUP: ['Startup', 'Start-up'],
  OPEN: ['Open'],
  PLACEHOLDER: ['Placeholder']
} as const;

export const STATUS_COLORS = {
  red: 'bg-red-500 text-white hover:bg-red-600',
  orange: 'bg-orange-500 text-white hover:bg-orange-600',
  yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
  green: 'bg-green-500 text-white hover:bg-green-600',
  gray: 'bg-gray-400 text-white hover:bg-gray-500',
  default: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
} as const;

export const AIRTABLE_TABLES = {
  EDUCATORS: 'Educators',
  SCHOOLS: 'Schools',
  EDUCATOR_SCHOOL_ASSOCIATIONS: 'educator_school_associations',
  LOCATIONS: 'Locations',
  EMAIL_ADDRESSES: 'Email Addresses',
  GOVERNANCE_DOCS: 'Governance docs',
  GRANTS: 'Grants',
  LOANS: 'Loans',
  GUIDE_ASSIGNMENTS: 'Guides Assignments',
  SCHOOL_NOTES: 'School Notes',
  SSJ_FILLOUT_FORMS: 'SSJ fillout form',
  MEMBERSHIP_FEE_BY_YEAR: 'Membership Fee by Year',
  MEMBERSHIP_FEE_UPDATES: 'Membership Fee Updates',
  MONTESSORI_CERTS: 'Montessori Certs',
  EVENT_ATTENDANCE: 'Event attendance',
  EDUCATOR_NOTES: 'Educator notes'
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

export const FIELD_MAPPINGS = {
  EDUCATOR: {
    FULL_NAME: 'Full Name',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    MIDDLE_NAME: 'Middle Name',
    NICKNAME: 'Nickname',
    PRIMARY_PHONE: 'Primary phone',
    SECONDARY_PHONE: 'Secondary phone',
    HOME_ADDRESS: 'Home Address',
    PRONOUNS: 'Pronouns',
    PRONOUNS_OTHER: 'Pronouns - Other',
    GENDER: 'Gender',
    GENDER_OTHER: 'Gender - Other',
    RACE_ETHNICITY: 'Race & Ethnicity',
    RACE_ETHNICITY_OTHER: 'Race & Ethnicity - Other',
    PRIMARY_LANGUAGE: 'Primary Language',
    OTHER_LANGUAGES: 'Other languages',
    EDUCATIONAL_ATTAINMENT: 'Educational Attainment',
    MONTESSORI_CERTIFIED: 'Montessori Certified',
    DISCOVERY_STATUS: 'Discovery status',
    ASSIGNED_PARTNER: 'Assigned Partner',
    CURRENT_ROLE: 'Current Role',
    ACTIVE_SCHOOL: 'Active School',
    STAGE_STATUS: 'Active School Stage_Status'
  },
  SCHOOL: {
    NAME: 'Name',
    SHORT_NAME: 'Short Name',
    LOGO: 'Logo',
    CURRENT_PHYSICAL_ADDRESS: 'Current Physical Address?',
    CURRENT_MAILING_ADDRESS: 'Current Mailing Address?',
    CITY: 'Current Physical Address - City',
    STATE: 'Current Physical Address - State',
    LATITUDE: 'Latitude',
    LONGITUDE: 'Longitude',
    PHONE: 'School Phone',
    EMAIL: 'School Email',
    WEBSITE: 'Website',
    STATUS: 'Status',
    STAGE_STATUS: 'Stage_Status',
    MEMBERSHIP_STATUS: 'Membership Status',
    CURRENT_GUIDES: 'Current Guide(s)',
    SSJ_STAGE: 'SSJ Stage',
    SSJ_PROJECTED_OPEN: 'SSJ Projected Open',
    RISK_FACTORS: 'Risk factors',
    WATCHLIST: 'Watchlist',
    LEFT_NETWORK_DATE: 'Left network date',
    LEFT_NETWORK_REASON: 'Left network reason'
  }
} as const;