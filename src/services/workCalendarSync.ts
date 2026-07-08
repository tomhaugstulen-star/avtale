import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';
import { getWorkAppointments, replaceWorkAppointments } from '@/src/services/workAppointmentStorage';

const CONNECTION_KEY = 'workCalendarSyncConnection';
const LAST_SYNC_KEY = 'workCalendarSyncLastSuccess';

type SyncConnection = {
  baseUrl: string;
  token: string;
};

type RemoteAppointment = {
  id: string;
  startAt: string;
  endAt: string;
};

type RemoteCalendar = {
  updatedAt: string | null;
  appointments: RemoteAppointment[];
};

export async function saveWorkSyncConnection(connection: SyncConnection) {
  const normalized = {
    baseUrl: connection.baseUrl.trim().replace(/\/$/, ''),
    token: connection.token.trim(),
  };
  await AsyncStorage.setItem(CONNECTION_KEY, JSON.stringify(normalized));
}

export async function getWorkSyncConnection(): Promise<SyncConnection | null> {
  const value = await AsyncStorage.getItem(CONNECTION_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<SyncConnection>;
    if (!parsed.baseUrl || !parsed.token) return null;
    return { baseUrl: parsed.baseUrl, token: parsed.token };
  } catch {
    return null;
  }
}

export async function getLastWorkSync() {
  return AsyncStorage.getItem(LAST_SYNC_KEY);
}

export async function disconnectWorkCalendar() {
  await AsyncStorage.multiRemove([CONNECTION_KEY, LAST_SYNC_KEY]);
  const current = await getWorkAppointments();
  await replaceWorkAppointments(current.filter((item) => item.source !== 'website'));
}

function mapRemoteAppointment(item: RemoteAppointment): Appointment {
  return {
    id: `website:${item.id}`,
    externalId: item.id,
    title: 'Opptatt',
    startDate: item.startAt,
    endDate: item.endAt,
    calendarType: 'work',
    createdAt: item.startAt,
    source: 'website',
  };
}

export async function syncWorkCalendar() {
  const connection = await getWorkSyncConnection();
  if (!connection) throw new Error('PC-synk er ikke konfigurert.');

  const response = await fetch(`${connection.baseUrl}/api/calendar`, {
    headers: { Authorization: `Bearer ${connection.token}` },
  });
  if (!response.ok) throw new Error(`PC-synk svarte med ${response.status}.`);

  const remote = await response.json() as RemoteCalendar;
  const current = await getWorkAppointments();
  const localOnly = current.filter((item) => item.source !== 'website');
  const imported = Array.isArray(remote.appointments)
    ? remote.appointments.map(mapRemoteAppointment)
    : [];

  await replaceWorkAppointments([...localOnly, ...imported]);
  const syncedAt = new Date().toISOString();
  await AsyncStorage.setItem(LAST_SYNC_KEY, syncedAt);
  return { count: imported.length, syncedAt, sourceUpdatedAt: remote.updatedAt };
}
