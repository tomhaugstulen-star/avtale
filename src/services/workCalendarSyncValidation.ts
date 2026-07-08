const MAX_APPOINTMENTS = 5_000;
const MAX_RESPONSE_CHARS = 2_000_000;
const MAX_APPOINTMENT_HOURS = 24;

export type RemoteAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  initials?: string;
};

export type RemoteCalendar = {
  updatedAt: string | null;
  appointments: RemoteAppointment[];
};

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  return parts[0] === 10
    || parts[0] === 127
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168);
}

function isPrivateHost(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, '').toLocaleLowerCase('en-US');
  return normalized === 'localhost'
    || normalized === '::1'
    || normalized.endsWith('.local')
    || normalized.startsWith('fe80:')
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || isPrivateIpv4(normalized);
}

export function normalizeLocalBaseUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('PC-adressen er ugyldig.');
  }

  if (url.protocol !== 'http:' || !isPrivateHost(url.hostname)) {
    throw new Error('PC-adressen må være en lokal http-adresse på privat nettverk.');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('PC-adressen kan ikke inneholde innlogging, søk eller fragment.');
  }
  if (url.pathname !== '/' && url.pathname !== '') {
    throw new Error('Skriv bare PC-adressen og porten, uten /api eller annen sti.');
  }

  return `${url.protocol}//${url.host}`;
}

export function normalizePairingToken(value: string) {
  const token = value.trim();
  if (token.length < 32 || token.length > 256 || /\s|[\u0000-\u001F\u007F]/u.test(token)) {
    throw new Error('Paringstokenet har ugyldig format.');
  }
  return token;
}

function sanitizeInitials(value: unknown) {
  const initials = String(value ?? '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .slice(0, 3)
    .toLocaleUpperCase('nb-NO');
  return initials || undefined;
}

function parseAppointment(value: unknown): RemoteAppointment | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? record.id.trim() : '';
  const start = new Date(String(record.startAt ?? ''));
  const end = new Date(String(record.endAt ?? ''));
  const duration = end.getTime() - start.getTime();

  if (!id || id.length > 128 || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (duration <= 0 || duration > MAX_APPOINTMENT_HOURS * 60 * 60 * 1_000) return null;

  return {
    id,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    initials: sanitizeInitials(record.initials),
  };
}

export function parseRemoteCalendarText(text: string): RemoteCalendar {
  if (text.length > MAX_RESPONSE_CHARS) throw new Error('Kalenderdata fra PC-en er for store.');

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error('PC-en sendte ugyldige kalenderdata.');
  }

  if (!value || typeof value !== 'object') throw new Error('PC-en sendte ugyldige kalenderdata.');
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.appointments) || record.appointments.length > MAX_APPOINTMENTS) {
    throw new Error('PC-en sendte for mange eller ugyldige avtaler.');
  }

  const appointments = [...new Map(
    record.appointments
      .map(parseAppointment)
      .filter((item): item is RemoteAppointment => Boolean(item))
      .map((item) => [item.id, item]),
  ).values()];

  const updated = record.updatedAt ? new Date(String(record.updatedAt)) : null;
  return {
    updatedAt: updated && !Number.isNaN(updated.getTime()) ? updated.toISOString() : null,
    appointments,
  };
}
