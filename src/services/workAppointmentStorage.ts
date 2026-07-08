import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';
import {
  normalizeAppointments,
  parseStoredAppointments,
} from '@/src/services/appointmentPersistence';

const STORAGE_KEY = 'workAppointments';

async function saveAppointments(items: Appointment[]) {
  const normalized = normalizeAppointments(items, 'work');
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export async function getWorkAppointments(): Promise<Appointment[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? parseStoredAppointments(value, 'work') : [];
  } catch (error) {
    console.error('Kunne ikke lese arbeidsavtaler', error);
    throw new Error('Kunne ikke lese lagrede arbeidsavtaler.');
  }
}

export async function getWorkAppointment(id: string) {
  const items = await getWorkAppointments();
  return items.find((item) => item.id === id);
}

export async function addWorkAppointment(item: Appointment) {
  const items = await getWorkAppointments();
  await saveAppointments([...items, item]);
}

export async function updateWorkAppointment(item: Appointment) {
  const items = await getWorkAppointments();
  await saveAppointments(
    items.map((current) => current.id === item.id ? item : current),
  );
}

export async function deleteWorkAppointment(id: string) {
  const items = await getWorkAppointments();
  await saveAppointments(items.filter((item) => item.id !== id));
}

export async function replaceWorkAppointments(items: Appointment[]) {
  await saveAppointments(items);
}
