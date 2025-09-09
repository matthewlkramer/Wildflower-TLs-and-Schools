import { base } from "./airtable-base";
import { cache } from "./cache";
import { handleError } from "./error-handler";
import { AIRTABLE_TABLES as AT } from "@shared/airtable-tables";
import { TABLE_TYPE_MAPPING, toStringArray, toYesBool } from "@shared/schema";

// Import all the transformer functions
import { transformLocationRecord } from "./storage/locations";
import { transformEXSRecord } from "./storage/exs";
import { transformGovernanceDocument, transformCharterGovernanceDocument, transformCharter990, transformTax990, transformCharterNote } from "./storage/governance";
import { transformActionStepRecord } from "./storage/action-steps";
import type { Charter, Educator, School, Loan, Grant, Event, EventAttendance } from "@shared/schema";
import {
  SCHOOLS_FIELDS as SF,
  EDUCATORS_FIELDS as EF,
  CHARTERS_FIELDS as CHF,
  LOANS_FIELDS as LNF,
  GRANTS_FIELDS as GF,
  EVENTS_FIELDS as EVF,
  EVENT_ATTENDANCE_FIELDS as EATF,
} from "@shared/schema";

// Generic CRUD operations for any Airtable table
export class GenericStorage {
  
  // Metadata mapping table names to their configuration
  private static readonly TABLE_CONFIG = {
    [AT.SCHOOLS]: {
      type: 'School',
      transformer: 'transformSchoolRecord',
      cachePrefix: 'schools'
    },
    [AT.CHARTERS]: {
      type: 'Charter', 
      transformer: 'transformCharterRecord',
      cachePrefix: 'charters'
    },
    [AT.EDUCATORS]: {
      type: 'Educator',
      transformer: 'transformEducatorRecord', 
      cachePrefix: 'educators'
    },
    [AT.LOCATIONS]: {
      type: 'Location',
      transformer: transformLocationRecord,
      cachePrefix: 'locations'
    },
    [AT.EDUCATORS_X_SCHOOLS]: {
      type: 'EducatorSchoolAssociation',
      transformer: transformEXSRecord,
      cachePrefix: 'exs'
    },
    [AT.GOVERNANCE_DOCS]: {
      type: 'GovernanceDocument',
      transformer: transformGovernanceDocument,
      cachePrefix: 'governance'
    },
    [AT._990S]: {
      type: 'Charter990', 
      transformer: transformCharter990,
      cachePrefix: '990s'
    },
    [AT.SCHOOL_NOTES]: {
      type: 'CharterNote',
      transformer: transformCharterNote,
      cachePrefix: 'notes'
    },
    [AT.ACTION_STEPS]: {
      type: 'ActionStep',
      transformer: transformActionStepRecord,
      cachePrefix: 'actions'
    },
    [AT.LOANS]: {
      type: 'Loan',
      transformer: 'transformLoanRecord',
      cachePrefix: 'loans'
    },
    [AT.GRANTS]: {
      type: 'Grant', 
      transformer: 'transformGrantRecord',
      cachePrefix: 'grants'
    },
    [AT.EVENTS]: {
      type: 'Event',
      transformer: 'transformEventRecord', 
      cachePrefix: 'events'
    },
    [AT.EVENT_ATTENDANCE]: {
      type: 'EventAttendance',
      transformer: 'transformEventAttendanceRecord',
      cachePrefix: 'attendance'
    }
  } as const;

  /**
   * Generic get all records for a table
   */
  async getAll<T>(tableName: keyof typeof GenericStorage.TABLE_CONFIG): Promise<T[]> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    // Check cache first
    const cacheKey = `${config.cachePrefix}:all`;
    const cached = cache.get<T[]>(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${config.type} - all`);
      return cached;
    }

    try {
      const records = await base(tableName).select().all();
      
      // Transform records using the configured transformer
      let transformed: T[];
      if (typeof config.transformer === 'function') {
        transformed = records.map(record => config.transformer(record)) as T[];
      } else {
        // For string transformer names, we'd need to dynamically invoke
        // For now, handle the known transformers
        transformed = records.map(record => this.getTransformer(config.transformer)(record)) as T[];
      }

      // Cache the results
      cache.set(cacheKey, transformed);
      console.log(`[Cache Miss] ${config.type} - fetched ${transformed.length} records from Airtable`);
      
      return transformed;
    } catch (error) {
      console.error(`Error fetching ${config.type} records:`, error);
      return handleError(error, []);
    }
  }

  /**
   * Generic get single record by ID
   */
  async getById<T>(tableName: keyof typeof GenericStorage.TABLE_CONFIG, id: string): Promise<T | undefined> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    // Check cache first
    const cacheKey = `${config.cachePrefix}:${id}`;
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${config.type}:${id}`);
      return cached;
    }

    try {
      const record = await base(tableName).find(id);
      
      // Transform record
      let transformed: T;
      if (typeof config.transformer === 'function') {
        transformed = config.transformer(record) as T;
      } else {
        transformed = this.getTransformer(config.transformer)(record) as T;
      }

      // Cache the result
      cache.set(cacheKey, transformed);
      console.log(`[Cache Miss] ${config.type}:${id} - fetched from Airtable`);
      
      return transformed;
    } catch (error) {
      console.error(`Error fetching ${config.type} record ${id}:`, error);
      return handleError(error, undefined);
    }
  }

  /**
   * Generic create record
   */
  async create<T, InsertT>(
    tableName: keyof typeof GenericStorage.TABLE_CONFIG, 
    data: InsertT
  ): Promise<T> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    try {
      const record = await base(tableName).create(data as any);
      
      // Transform the created record
      let transformed: T;
      if (typeof config.transformer === 'function') {
        transformed = config.transformer(record) as T;
      } else {
        transformed = this.getTransformer(config.transformer)(record) as T;
      }

      // Clear related cache
      cache.delete(`${config.cachePrefix}:all`);
      console.log(`Created ${config.type} record:`, (transformed as any).id);
      
      return transformed;
    } catch (error) {
      console.error(`Error creating ${config.type} record:`, error);
      throw handleError(error, error);
    }
  }

  /**
   * Generic update record
   */
  async update<T, UpdateT>(
    tableName: keyof typeof GenericStorage.TABLE_CONFIG,
    id: string, 
    data: UpdateT
  ): Promise<T | undefined> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    try {
      const record = await base(tableName).update(id, data as any);
      
      // Transform the updated record
      let transformed: T;
      if (typeof config.transformer === 'function') {
        transformed = config.transformer(record) as T;
      } else {
        transformed = this.getTransformer(config.transformer)(record) as T;
      }

      // Clear related cache
      cache.delete(`${config.cachePrefix}:all`);
      cache.delete(`${config.cachePrefix}:${id}`);
      console.log(`Updated ${config.type} record:`, id);
      
      return transformed;
    } catch (error) {
      console.error(`Error updating ${config.type} record ${id}:`, error);
      return handleError(error, undefined);
    }
  }

  /**
   * Generic delete record
   */
  async delete(tableName: keyof typeof GenericStorage.TABLE_CONFIG, id: string): Promise<boolean> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    try {
      await base(tableName).destroy(id);
      
      // Clear related cache
      cache.delete(`${config.cachePrefix}:all`);
      cache.delete(`${config.cachePrefix}:${id}`);
      console.log(`Deleted ${config.type} record:`, id);
      
      return true;
    } catch (error) {
      console.error(`Error deleting ${config.type} record ${id}:`, error);
      return handleError(error, false);
    }
  }

  /**
   * Generic search records with filter
   */
  async search<T>(
    tableName: keyof typeof GenericStorage.TABLE_CONFIG,
    filter: string,
    options?: { maxRecords?: number; sort?: Array<{ field: string; direction: 'asc' | 'desc' }> }
  ): Promise<T[]> {
    const config = GenericStorage.TABLE_CONFIG[tableName];
    if (!config) {
      throw new Error(`Table configuration not found for: ${tableName}`);
    }

    try {
      const selectOptions: any = {
        filterByFormula: filter
      };

      if (options?.maxRecords) {
        selectOptions.maxRecords = options.maxRecords;
      }

      if (options?.sort) {
        selectOptions.sort = options.sort;
      }

      const records = await base(tableName).select(selectOptions).all();
      
      // Transform records
      let transformed: T[];
      if (typeof config.transformer === 'function') {
        transformed = records.map(record => config.transformer(record)) as T[];
      } else {
        transformed = records.map(record => this.getTransformer(config.transformer)(record)) as T[];
      }

      console.log(`Search ${config.type} - found ${transformed.length} records`);
      return transformed;
    } catch (error) {
      console.error(`Error searching ${config.type} records:`, error);
      return handleError(error, []);
    }
  }

  /**
   * Get transformer function by name (for legacy string-based transformers)
   */
  private getTransformer(transformerName: string): (record: any) => any {
    // This is a temporary bridge - ideally all transformers would be direct function references
    switch (transformerName) {
      case 'transformSchoolRecord':
        return (record) => this.transformSchoolRecord(record);
      case 'transformCharterRecord':
        return (record) => this.transformCharterRecord(record);
      case 'transformEducatorRecord':
        return (record) => this.transformEducatorRecord(record);
      case 'transformLoanRecord':
        return (record) => this.transformLoanRecord(record);
      case 'transformGrantRecord':
        return (record) => this.transformGrantRecord(record);
      case 'transformEventRecord':
        return (record) => this.transformEventRecord(record);
      case 'transformEventAttendanceRecord':
        return (record) => this.transformEventAttendanceRecord(record);
      default:
        throw new Error(`Unknown transformer: ${transformerName}`);
    }
  }

  // Actual transformer methods from simple-storage.ts
  private transformSchoolRecord(record: any): School {
    const fields = record.fields;
    return {
      id: record.id,
      name: fields[SF.Name] || "",
      shortName: fields[SF.Short_Name] || undefined,
      logo: fields[SF.Logo]?.[0]?.url || undefined,
      logoMainSquare: fields[SF.Logo___main_square]?.[0]?.url || undefined,
      logoFlowerOnly: fields[SF.Logo___flower_only]?.[0]?.url || undefined,
      logoMainRectangle: fields[SF.Logo___main_rectangle]?.[0]?.url || undefined,
      logoUrl: fields[SF.Logo_URL] || undefined,
      currentPhysicalAddress: fields[SF.Current_Physical_Address] || undefined,
      currentMailingAddress: fields[SF.Current_Mailing_Address] || undefined,
      activeLatitude: fields[SF.activeLatitude] ? parseFloat(String(fields[SF.activeLatitude])) : undefined,
      activeLongitude: fields[SF.activeLongitude] ? parseFloat(String(fields[SF.activeLongitude])) : undefined,
      ssjTargetCity: fields[SF.SSJ___Target_City] || null,
      ssjTargetState: fields[SF.SSJ___Target_State] || null,
      locality: (fields[SF.Current_Physical_Address___City]
        ? `${fields[SF.Current_Physical_Address___City]}${fields[SF.Current_Physical_Address___State] ? ', ' + fields[SF.Current_Physical_Address___State] : ''}`
        : fields[SF.SSJ___Target_City]
          ? `${fields[SF.SSJ___Target_City]}${fields[SF.SSJ___Target_State] ? ', ' + fields[SF.SSJ___Target_State] : ''}`
          : ''),
      phone: fields[SF.School_Phone] || undefined,
      email: fields[SF.School_Email] || undefined,
      emailDomain: fields[SF.Email_Domain] || undefined,
      domainName: fields[SF.Domain_Name] || undefined,
      website: fields[SF.Website] || undefined,
      instagram: fields[SF.Instagram] || undefined,
      facebook: fields[SF.Facebook] || undefined,
      archived: fields[SF.Archived] === true,
      priorNames: fields[SF.Prior_Names] || '',
      narrative: fields[SF.Narrative] || '',
      institutionalPartner: fields[SF.Institutional_partner] || null,
      membershipStatus: fields[SF.Membership_Status] || '',
      founders: fields[SF.Founders] || [],
      foundersFullNames: fields[SF.Founders_Full_Names] || [],
      membershipAgreementDate: fields[SF.Membership_Agreement_date] || '',
      signedMembershipAgreement: fields[SF.Signed_Membership_Agreement] || '',
      agreementVersion: fields[SF.Agreement_Version_] || '',
      membershipTerminationLetter: fields[SF.Membership_termination_letter] || '',
      primaryContactEmail: fields[SF.Primary_Contact_Email] || '',
      about: fields[SF.About] || '',
      aboutSpanish: fields[SF.About_Spanish] || '',
      agesServed: fields[SF.Ages_served] || undefined,
      governanceModel: fields[SF.Governance_Model] || undefined,
      status: fields[SF.School_Status] || undefined,
      stageStatus: fields[SF.Stage_Status] || undefined,
      openDate: fields[SF.Opened] || undefined,
      enrollmentCap: fields[SF.Enrollment_at_Full_Capacity] || undefined,
      enrollmentCurrent: fields[SF.Current_Enrollment] || undefined,
      created: fields["Created"] || fields["Created time"] || undefined,
      lastModified: fields["Last Modified"] || fields["Last modified"] || undefined,
    };
  }

  private transformCharterRecord(record: any): Charter {
    const fields = record.fields;
    return {
      id: record.id,
      shortName: fields[CHF.Short_Name] || undefined,
      fullName: fields[CHF.Full_name] || undefined,
      initialTargetCommunity: fields[CHF.Initial_target_community] || undefined,
      projectedOpen: fields[CHF.Projected_open] || undefined,
      initialTargetAges: fields[CHF.Initial_target_ages] || undefined,
      status: fields[CHF.Status] || undefined,
      created: fields["Created"] || fields["Created time"] || undefined,
      lastModified: fields["Last Modified"] || fields["Last modified"] || undefined,
    };
  }

  private transformEducatorRecord(record: any): Educator {
    const fields = record.fields;
    return {
      id: record.id,
      fullName: fields[EF.Full_Name] || undefined,
      firstName: fields[EF.First_Name] || undefined,
      nickname: fields[EF.Nickname] || undefined,
      middleName: fields[EF.Middle_Name] || undefined,
      lastName: fields[EF.Last_Name] || undefined,
      primaryPhone: fields[EF.Primary_phone] || undefined,
      secondaryPhone: fields[EF.Secondary_phone] || undefined,
      currentPrimaryEmailAddress: fields[EF.Current_Primary_Email_Address] || undefined,
      currentRoleSchool: fields[EF.Current_Role_School_for_UI] || undefined,
      homeAddress: fields[EF.Home_Address] || undefined,
      pronouns: fields[EF.Pronouns] || undefined,
      pronounsOther: fields[EF.Pronouns___Other] || undefined,
      gender: fields[EF.Gender] || undefined,
      genderOther: fields[EF.Gender___Other] || undefined,
      raceEthnicity: fields[EF.Race___Ethnicity] || undefined,
      raceEthnicityOther: fields[EF.Race___Ethnicity___Other] || undefined,
      lgbtqia: fields[EF.LGBTQIA] === 'Yes' || fields[EF.LGBTQIA] === true,
      created: fields["Created"] || fields["Created time"] || undefined,
      lastModified: fields["Last Modified"] || fields["Last modified"] || undefined,
    };
  }

  private transformLoanRecord(record: any): any {
    // Basic transformer - improve as needed
    return { id: record.id, ...record.fields };
  }

  private transformGrantRecord(record: any): any {
    // Basic transformer - improve as needed
    return { id: record.id, ...record.fields };
  }

  private transformEventRecord(record: any): any {
    // Basic transformer - improve as needed
    return { id: record.id, ...record.fields };
  }

  private transformEventAttendanceRecord(record: any): EventAttendance {
    const fields = record.fields;
    return {
      id: record.id,
      educatorId: fields[EATF?.educator_id] || undefined,
      attended: fields[EATF?.Attended] || undefined,
      registered: fields[EATF?.Registered] || undefined,
      registrationDate: fields[EATF?.Registration_Date] || undefined,
    };
  }
}

// Create singleton instance
export const genericStorage = new GenericStorage();

// Export convenience methods that match the old simple-storage API
export const storage = {
  // Charters
  getCharters: () => genericStorage.getAll(AT.CHARTERS),
  getCharter: (id: string) => genericStorage.getById(AT.CHARTERS, id),
  createCharter: (data: any) => genericStorage.create(AT.CHARTERS, data),
  updateCharter: (id: string, data: any) => genericStorage.update(AT.CHARTERS, id, data),
  deleteCharter: (id: string) => genericStorage.delete(AT.CHARTERS, id),

  // Schools
  getSchools: () => genericStorage.getAll(AT.SCHOOLS),
  getSchool: (id: string) => genericStorage.getById(AT.SCHOOLS, id),
  createSchool: (data: any) => genericStorage.create(AT.SCHOOLS, data),
  updateSchool: (id: string, data: any) => genericStorage.update(AT.SCHOOLS, id, data),
  deleteSchool: (id: string) => genericStorage.delete(AT.SCHOOLS, id),

  // Educators
  getEducators: () => genericStorage.getAll(AT.EDUCATORS),
  getEducator: (id: string) => genericStorage.getById(AT.EDUCATORS, id),
  createEducator: (data: any) => genericStorage.create(AT.EDUCATORS, data),
  updateEducator: (id: string, data: any) => genericStorage.update(AT.EDUCATORS, id, data),
  deleteEducator: (id: string) => genericStorage.delete(AT.EDUCATORS, id),

  // Locations
  getLocations: () => genericStorage.getAll(AT.LOCATIONS),
  getLocation: (id: string) => genericStorage.getById(AT.LOCATIONS, id),
  createLocation: (data: any) => genericStorage.create(AT.LOCATIONS, data),
  updateLocation: (id: string, data: any) => genericStorage.update(AT.LOCATIONS, id, data),
  deleteLocation: (id: string) => genericStorage.delete(AT.LOCATIONS, id),

  // Educator x Schools associations
  getEducatorSchoolAssociations: () => genericStorage.getAll(AT.EDUCATORS_X_SCHOOLS),
  getEducatorAssociations: (educatorId: string) => 
    genericStorage.search(AT.EDUCATORS_X_SCHOOLS, `{educator_id} = '${educatorId}'`),
  getSchoolAssociations: (schoolId: string) => 
    genericStorage.search(AT.EDUCATORS_X_SCHOOLS, `{school_id} = '${schoolId}'`),

  // Governance
  getGovernanceDocs: () => genericStorage.getAll(AT.GOVERNANCE_DOCS),
  get990s: () => genericStorage.getAll(AT._990S),
  
  // Action Steps
  getActionSteps: () => genericStorage.getAll(AT.ACTION_STEPS),
  
  // Add more convenience methods as needed...
};