import { LOCATIONS_FIELDS as LF } from "@shared/airtable-schema";
import type { Location } from "@shared/schema";
import { firstId, toNumber, toYesBool, createdAt, updatedAt } from "./util";

export function transformLocationRecord(record: any): Location {
  const f = record.fields;
  const schoolId = firstId(f[LF.school_id] ?? f[LF.School]);
  return {
    id: record.id,
    schoolId: schoolId || "",
    charterId: firstId(f[LF.charter_id]),
    address: String(f[LF.Address] || ''),
    city: String(f[LF.City] || ''),
    state: String(f[LF.State] || ''),
    postalCode: String(f[LF.Postal_code] || ''),
    country: String(f[LF.Country] || ''),
    neighborhood: String(f[LF.Neighborhood] || ''),
    sqFt: toNumber(f[LF.Square_feet]),
    maxOccupancy: toNumber(f[LF.Max_Students_Licensed_For]),
    latitude: toNumber(f[LF.Latitude]),
    longitude: toNumber(f[LF.Longitude]),
    currentPhysicalAddress: Boolean(f[LF.Current_physical_address_]),
    currentMailingAddress: Boolean(f[LF.Current_mailing_address_]),
    locationType: String(f[LF.Location_type] || ''),
    startDate: String(f[LF.Start_of_time_at_location] || ''),
    endDate: String(f[LF.End_of_time_at_location] || ''),
    coLocationType: String(f[LF.Co_Location_Type] || ''),
    coLocationPartner: String(f[LF.Co_Location_Partner_] || ''),
    censusTract: String(f[LF.Census_Tract] || ''),
    qualLICT: toYesBool(f[LF.Qualified_Low_Income_Census_Tract]),
    leaseEndDate: String(f[LF.Lease_End_Date] || ''),
    lease: String(f[LF.Lease] || ''),
    timeZone: String(f[LF.Time_Zone] || ''),
    created: createdAt(f),
    lastModified: updatedAt(f),
  };
}

