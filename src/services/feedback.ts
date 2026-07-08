import * as Haptics from 'expo-haptics';
import { readAppPreferences } from '@/src/services/appPreferences';

export async function tapFeedback() {
  const preferences = await readAppPreferences();
  if (preferences.vibration) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export async function confirmFeedback() {
  const preferences = await readAppPreferences();
  if (preferences.vibration) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
