import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appointment } from '@/src/models/Appointment';

const STORAGE_KEY = 'workAppointments';

async function saveAppointments(items: Appointment[]) {
  const sorted = [...items].sort((a, b) => a.startDate.localeCompare(b.startDate));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
}

export async function getWorkAppointments(): Promise<Appointment[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as Appointment[] : [];
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
  await saveAppointments(items.map((current) => current.id === item.id ? item : current));
}

export async function deleteWorkAppointment(id: string) {
  const items = await getWorkAppointments();
  await saveAppointments(items.filter((item) => item.id !== id));
}
