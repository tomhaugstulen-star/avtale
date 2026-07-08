import type {
  Appointment,
  AppointmentSource,
  CalendarType,
} from '@/src/models/Appointment';

const MAX_TITLE_LENGTH = 200;
const MAX_ID_LENGTH = 200;

function optionalString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().slice(0, maxLength);
  return normalized || undefined;
}

function validIsoDate(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function validSource(value: unknown): AppointmentSource | undefined {
  return value === 'local' || value === 'website' ? value : undefined;
}

function normalizeAppointment(
  value: unknown,
  calendarType: CalendarType,
): Appointment | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = optionalString(record.id, MAX_ID_LENGTH);
  const title = optionalString(record.title, MAX_TITLE_LENGTH);
  const startDate = validIsoDate(record.startDate);
  const createdAt = validIsoDate(record.createdAt) ?? startDate;

  if (!id || !title || !startDate || !createdAt) return null;
  if (record.calendarType !== calendarType) return null;

  const endDate = validIsoDate(record.endDate);
  if (endDate && new Date(endDate) <= new Date(startDate)) return null;

  const initials = optionalString(record.initials, 3)
    ?.replace(/[^\p{L}\p{N}]/gu, '')
    .toLocaleUpperCase('nb-NO');

  return {
    id,
    title,
    startDate,
    createdAt,
    calendarType,
    endDate,
    notificationId: optionalString(record.notificationId, 512),
    source: validSource(record.source),
    externalId: optionalString(record.externalId, 128),
    initials: initials || undefined,
  };
}

export function parseStoredAppointments(
  raw: string,
  calendarType: CalendarType,
) {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => normalizeAppointment(item, calendarType))
    .filter((item): item is Appointment => Boolean(item))
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}

export function normalizeAppointments(
  items: Appointment[],
  calendarType: CalendarType,
) {
  return items
    .map((item) => normalizeAppointment(item, calendarType))
    .filter((item): item is Appointment => Boolean(item))
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}
