import * as Notifications from 'expo-notifications';

const TWO_HOURS = 2 * 60 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function hasPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleAppointmentNotification(
  title: string,
  startDate: Date,
) {
  const triggerDate = new Date(startDate.getTime() - TWO_HOURS);
  if (triggerDate.getTime() <= Date.now()) return undefined;
  if (!(await hasPermission())) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Avtale om 2 timer',
      body: title,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function cancelAppointmentNotification(id?: string) {
  if (!id) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn('Kunne ikke avbryte varselet', error);
  }
}
