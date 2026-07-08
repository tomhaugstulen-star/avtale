import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';

const STORAGE_KEY = 'privateAppointments';

async function saveAppointments(items: Appointment[]) {
  const sorted = [...items].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
}

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (!value) return [];

    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as Appointment[] : [];
  } catch (error) {
    console.error('Kunne ikke lese avtaler', error);
    throw new Error('Kunne ikke lese lagrede avtaler.');
  }
}

export async function getAppointment(id: string) {
  const items = await getAppointments();
  return items.find((item) => item.id === id);
}

export async function addAppointment(item: Appointment) {
  try {
    const items = await getAppointments();
    await saveAppointments([...items, item]);
  } catch (error) {
    console.error('Kunne ikke lagre avtalen', error);
    throw new Error('Kunne ikke lagre avtalen.');
  }
}

export async function updateAppointment(item: Appointment) {
  try {
    const items = await getAppointments();
    await saveAppointments(
      items.map((current) => current.id === item.id ? item : current),
    );
  } catch (error) {
    console.error('Kunne ikke oppdatere avtalen', error);
    throw new Error('Kunne ikke oppdatere avtalen.');
  }
}

export async function deleteAppointment(id: string) {
  try {
    const items = await getAppointments();
    await saveAppointments(items.filter((item) => item.id !== id));
  } catch (error) {
    console.error('Kunne ikke slette avtalen', error);
    throw new Error('Kunne ikke slette avtalen.');
  }
}

export async function replaceAppointments(items: Appointment[]) {
  await saveAppointments(items);
}
