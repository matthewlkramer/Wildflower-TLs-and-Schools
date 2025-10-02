import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function normalizeEmail(value: string): string {
  return String(value || '').trim().toLowerCase()
}

export function isEmail(value: string): boolean {
  const v = normalizeEmail(value)
  // Simple pragmatic email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function normalizePhoneToE164(value: string, defaultCountry: string = 'US'): string | null {
  const raw = String(value || '').trim()
  if (!raw) return null
  try {
    const pn = parsePhoneNumberFromString(raw, defaultCountry as any)
    if (pn && pn.isValid()) return pn.number
  } catch {}
  return null
}

export function isPhoneE164(value: string, defaultCountry: string = 'US'): boolean {
  const e164 = normalizePhoneToE164(value, defaultCountry)
  return !!e164
}

export function normalizeEIN(value: string): string | null {
  const digits = String(value || '').replace(/\D+/g, '')
  if (digits.length !== 9) return null
  return `${digits.slice(0, 2)}-${digits.slice(2)}`
}

export function isEIN(value: string): boolean {
  return normalizeEIN(value) !== null
}
