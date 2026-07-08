import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';
import {
  clearSyncConnection,
  getSyncConnection,
  saveSyncConnection,
  type SyncConnection,
} from '@/src/services/workCalendarConnectionStore';
import {
  cancelAppointmentNotification,
  scheduleAppointmentNotification,
} from '@/src/services/notificationService';
import {
  parseRemoteCalendarText,
  type RemoteAppointment,
} from '@/src/services/workCalendarSyncValidation';
import {
  getWorkAppointments,
  replaceWorkAppointments,
} from '@/src/services/workAppointmentStorage';

const LAST_SYNC_KEY = 'workCalendarSyncLastSuccess';
const REQUEST_TIMEOUT_MS = 10_000;
let syncInFlight: Promise<SyncResult> | null = null;

type SyncResult = {
  count: number;
  syncedAt: string;
  sourceUpdatedAt: string | null;
};

export async function saveWorkSyncConnection(connection: SyncConnection) {
  return saveSyncConnection(connection);
}

export async function getWorkSyncConnection() {
  return getSyncConnection();
}

export async function getLastWorkSync() {
  return AsyncStorage.getItem(LAST_SYNC_KEY);
}

export async function disconnectWorkCalendar() {
  const current = await getWorkAppointments();
  const imported = current.filter((item) => item.source === 'website');
  await Promise.all(imported.map((item) => cancelAppointmentNotification(item.notificationId)));
  await replaceWorkAppointments(current.filter((item) => item.source !== 'website'));
  await Promise.all([
    clearSyncConnection(),
    AsyncStorage.removeItem(LAST_SYNC_KEY),
  ]);
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
    initials: item.initials,
  };
}

async function fetchRemoteCalendar(connection: SyncConnection) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${connection.baseUrl}/api/calendar`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${connection.token}`,
      },
      signal: controller.signal,
    });

    if (response.status === 401) throw new Error('Paringstokenet ble avvist av PC-en.');
    if (!response.ok) throw new Error(`PC-synk svarte med ${response.status}.`);
    return parseRemoteCalendarText(await response.text());
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('PC-en svarte ikke innen 10 sekunder.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function performSync(): Promise<SyncResult> {
  const connection = await getSyncConnection();
  if (!connection) throw new Error('PC-synk er ikke konfigurert.');

  const remote = await fetchRemoteCalendar(connection);
  const current = await getWorkAppointments();
  const localOnly = current.filter((item) => item.source !== 'website');
  const previousImported = current.filter((item) => item.source === 'website');
  const imported: Appointment[] = [];
  const newNotificationIds: string[] = [];

  try {
    for (const item of remote.appointments) {
      const mapped = mapRemoteAppointment(item);
      const notificationId = await scheduleAppointmentNotification(
        'Opptatt',
        new Date(mapped.startDate),
      );
      if (notificationId) newNotificationIds.push(notificationId);
      imported.push({ ...mapped, notificationId });
    }

    await replaceWorkAppointments([...localOnly, ...imported]);
  } catch (error) {
    await Promise.all(newNotificationIds.map(cancelAppointmentNotification));
    throw error;
  }

  await Promise.all(
    previousImported.map((item) => cancelAppointmentNotification(item.notificationId)),
  );

  const syncedAt = new Date().toISOString();
  await AsyncStorage.setItem(LAST_SYNC_KEY, syncedAt);
  return { count: imported.length, syncedAt, sourceUpdatedAt: remote.updatedAt };
}

export function syncWorkCalendar() {
  if (!syncInFlight) {
    syncInFlight = performSync().finally(() => {
      syncInFlight = null;
    });
  }
  return syncInFlight;
}
