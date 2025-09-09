import { LOCATIONS_FIELDS as LF } from "@shared/schema";
import type { Location } from "@shared/schema";
import { 
  createBaseTransformer, 
  firstId, 
  toNumber, 
  toYesBool 
} from "@shared/schema";

export function transformLocationRecord(record: any): Location {
  const f = record.fields;
  const schoolId = firstId(f[LF.schoolId] ?? f[LF.school]);
  return createBaseTransformer(record, {
    schoolId: schoolId || "",
    charterId: firstId(f[LF.charterId]),
    address: String(f[LF.address] || ''),
    city: String(f[LF.city] || ''),
    state: String(f[LF.state] || ''),
    postalCode: String(f[LF.postalCode] || ''),
    country: String(f[LF.country] || ''),
    neighborhood: String(f[LF.neighborhood] || ''),
    sqFt: toNumber(f[LF.squareFeet]),
    maxOccupancy: toNumber(f[LF.maxStudentsLicensedFor]),
    latitude: toNumber(f[LF.latitude]),
    longitude: toNumber(f[LF.longitude]),
    currentPhysicalAddress: Boolean(f[LF.currentPhysicalAddress]),
    currentMailingAddress: Boolean(f[LF.currentMailingAddress]),
    locationType: String(f[LF.locationType] || ''),
    startDate: String(f[LF.startOfTimeAtLocation] || ''),
    endDate: String(f[LF.endOfTimeAtLocation] || ''),
    coLocationType: String(f[LF.colocationType] || ''),
    coLocationPartner: String(f[LF.colocationPartner] || ''),
    censusTract: String(f[LF.censusTract] || ''),
    qualLICT: toYesBool(f[LF.qualifiedLowIncomeCensusTract]),
    leaseEndDate: String(f[LF.leaseEndDate] || ''),
    lease: String(f[LF.lease] || ''),
    timeZone: String(f[LF.timeZone] || ''),
  });
}

