import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Appointment } from '@/src/models/Appointment';

const STORAGE_KEY = 'privateAppointments';

export async function getAppointments(): Promise<Appointment[]> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  if (!value) return [];
  return JSON.parse(value) as Appointment[];
}

export async function addAppointment(item: Appointment) {
  const items = await getAppointments();
  items.push(item);
  items.sort((a, b) => a.startDate.localeCompare(b.startDate));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
