import * as Notifications from 'expo-notifications';

import type { Appointment } from '@/src/models/Appointment';
import { getAppointments, replaceAppointments } from '@/src/services/appointmentStorage';
import { formatReminder, getNotificationSettings, type NotificationSettings } from '@/src/services/notificationSettings';
import { getWorkAppointments, replaceWorkAppointments } from '@/src/services/workAppointmentStorage';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const settings = await getNotificationSettings();
    return {
      shouldPlaySound: settings.soundEnabled,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

async function hasPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function scheduleWithSettings(
  title: string,
  startDate: Date,
  settings: NotificationSettings,
  permissionGranted: boolean,
) {
  if (settings.reminderMinutes === null || !permissionGranted) return undefined;
  const triggerDate = new Date(startDate.getTime() - settings.reminderMinutes * 60_000);
  if (triggerDate.getTime() <= Date.now()) return undefined;

  const reminder = formatReminder(settings.reminderMinutes).replace(' før avtalen', '');
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Avtale om ${reminder}`,
      body: title,
      ...(settings.soundEnabled ? { sound: 'default' as const } : {}),
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
}

export async function scheduleAppointmentNotification(title: string, startDate: Date) {
  const settings = await getNotificationSettings();
  const permissionGranted = settings.reminderMinutes !== null && await hasPermission();
  return scheduleWithSettings(title, startDate, settings, permissionGranted);
}

export async function cancelAppointmentNotification(id?: string) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn('Kunne ikke avbryte varselet', error);
  }
}

async function rescheduleItems(
  items: Appointment[],
  settings: NotificationSettings,
  permissionGranted: boolean,
) {
  const updated: Appointment[] = [];
  for (const item of items) {
    await cancelAppointmentNotification(item.notificationId);
    const notificationId = await scheduleWithSettings(
      item.title,
      new Date(item.startDate),
      settings,
      permissionGranted,
    );
    updated.push({ ...item, notificationId });
  }
  return updated;
}

export async function rescheduleAllAppointmentNotifications() {
  const settings = await getNotificationSettings();
  const permissionGranted = settings.reminderMinutes !== null && await hasPermission();
  const privateItems = await getAppointments();
  const workItems = await getWorkAppointments();
  await replaceAppointments(await rescheduleItems(privateItems, settings, permissionGranted));
  await replaceWorkAppointments(await rescheduleItems(workItems, settings, permissionGranted));
}

export async function sendTestNotification(settings?: NotificationSettings) {
  const activeSettings = settings ?? await getNotificationSettings();
  if (!(await hasPermission())) throw new Error('Varslinger er ikke tillatt på iPhone.');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Testvarsel fra Avtale',
      body: activeSettings.soundEnabled ? 'Standard iPhone-lyd er valgt.' : 'Lydløs varsling er valgt.',
      ...(activeSettings.soundEnabled ? { sound: 'default' as const } : {}),
    },
    trigger: null,
  });
}
