import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'appPreferences';

export type AppPreferences = {
  vibration: boolean;
};

export async function readAppPreferences(): Promise<AppPreferences> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { vibration: true };
  try {
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return { vibration: parsed.vibration !== false };
  } catch {
    return { vibration: true };
  }
}

export async function writeAppPreferences(value: AppPreferences) {
  await AsyncStorage.setItem(KEY, JSON.stringify(value));
}
