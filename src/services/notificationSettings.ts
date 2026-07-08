import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'notificationSettings';

export type NotificationSettings = {
  reminderMinutes: number | null;
  soundEnabled: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  reminderMinutes: 120,
  soundEnabled: true,
};

export const REMINDER_OPTIONS = [
  { label: 'Av', value: null },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 time', value: 60 },
  { label: '2 timer', value: 120 },
  { label: '1 dag', value: 1440 },
] as const;

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const value = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!value) return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    const parsed = JSON.parse(value) as Partial<NotificationSettings>;
    return {
      reminderMinutes: typeof parsed.reminderMinutes === 'number' || parsed.reminderMinutes === null
        ? parsed.reminderMinutes
        : DEFAULT_NOTIFICATION_SETTINGS.reminderMinutes,
      soundEnabled: typeof parsed.soundEnabled === 'boolean'
        ? parsed.soundEnabled
        : DEFAULT_NOTIFICATION_SETTINGS.soundEnabled,
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function formatReminder(minutes: number | null) {
  if (minutes === null) return 'Varsling er slått av';
  if (minutes < 60) return `${minutes} minutter før avtalen`;
  if (minutes === 60) return '1 time før avtalen';
  if (minutes < 1440) return `${minutes / 60} timer før avtalen`;
  return '1 dag før avtalen';
}
