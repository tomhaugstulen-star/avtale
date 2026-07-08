import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors } from '@/src/constants/colors';
import { rescheduleAllAppointmentNotifications, sendTestNotification } from '@/src/services/notificationService';
import { DEFAULT_NOTIFICATION_SETTINGS, getNotificationSettings, REMINDER_OPTIONS, saveNotificationSettings, type NotificationSettings } from '@/src/services/notificationSettings';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getNotificationSettings().then(setSettings); }, []);

  async function save() {
    setSaving(true);
    try {
      await saveNotificationSettings(settings);
      await rescheduleAllAppointmentNotifications();
      Alert.alert('Innstillinger lagret', 'Eksisterende avtaler er planlagt på nytt.');
      router.back();
    } catch {
      Alert.alert('Kunne ikke lagre', 'Prøv igjen om et øyeblikk.');
    } finally { setSaving(false); }
  }

  async function testNotification() {
    try {
      await saveNotificationSettings(settings);
      await sendTestNotification();
    } catch (error) {
      Alert.alert('Kunne ikke sende testvarsel', error instanceof Error ? error.message : 'Ukjent feil.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}><Text style={styles.backText}>‹</Text></Pressable>
        <Text style={styles.title}>Innstillinger</Text><View style={styles.headerButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Varslingstid</Text>
          <Text style={styles.help}>Gjelder både Privat og En Ny Dag.</Text>
          <View style={styles.options}>
            {REMINDER_OPTIONS.map((option) => {
              const selected = settings.reminderMinutes === option.value;
              return <Pressable key={option.label} onPress={() => setSettings({ ...settings, reminderMinutes: option.value })} style={[styles.option, selected && styles.optionSelected]}><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text></Pressable>;
            })}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchText}><Text style={styles.sectionTitle}>Varslingslyd</Text><Text style={styles.help}>Standard iPhone-lyd.</Text></View>
            <Switch value={settings.soundEnabled} onValueChange={(soundEnabled) => setSettings({ ...settings, soundEnabled })} />
          </View>
          <Text style={styles.note}>iOS styrer systemtone, volum, Fokus og lydløs bryter.</Text>
          <Pressable onPress={testNotification} style={styles.secondaryButton}><Text style={styles.secondaryText}>Send testvarsel</Text></Pressable>
          <Pressable onPress={() => Linking.openSettings()} style={styles.linkButton}><Text style={styles.linkText}>Åpne iPhone-varsler</Text></Pressable>
        </View>
      </ScrollView>
      <Pressable disabled={saving} onPress={save} style={[styles.saveButton, saving && styles.disabled]}><Text style={styles.saveText}>{saving ? 'Lagrer …' : 'Lagre innstillinger'}</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, padding: 18 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 }, backText: { color: colors.private, fontSize: 40, lineHeight: 42 }, title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 20, paddingTop: 20 }, card: { backgroundColor: colors.surface, borderRadius: 24, padding: 20 }, sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' }, help: { color: colors.textSecondary, fontSize: 15, marginTop: 4 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 16 }, option: { borderColor: '#C8CED6', borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 15, paddingVertical: 11 }, optionSelected: { backgroundColor: colors.private, borderColor: colors.private }, optionText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' }, optionTextSelected: { color: colors.white },
  switchRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, switchText: { flex: 1, paddingRight: 14 }, note: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 14 },
  secondaryButton: { alignItems: 'center', borderColor: colors.private, borderRadius: 17, borderWidth: 1.5, height: 50, justifyContent: 'center', marginTop: 18 }, secondaryText: { color: colors.private, fontSize: 17, fontWeight: '700' }, linkButton: { alignItems: 'center', paddingTop: 18 }, linkText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  saveButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 20, height: 58, justifyContent: 'center' }, saveText: { color: colors.white, fontSize: 19, fontWeight: '700' }, disabled: { opacity: 0.55 },
});
