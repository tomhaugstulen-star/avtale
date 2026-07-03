import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';

const STORAGE_KEY = 'privateAppointments';

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

export async function addAppointment(item: Appointment) {
  try {
    const items = await getAppointments();
    const next = [...items, item].sort((a, b) =>
      a.startDate.localeCompare(b.startDate),
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Kunne ikke lagre avtalen', error);
    throw new Error('Kunne ikke lagre avtalen.');
  }
}
