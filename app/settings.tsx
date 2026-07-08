import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  PcSyncSettingsCard,
  ReminderSettingsCard,
  ToggleSettingsCard,
} from '@/src/components/SettingsCards';
import { colors } from '@/src/constants/colors';
import { readAppPreferences, writeAppPreferences } from '@/src/services/appPreferences';
import {
  rescheduleAllAppointmentNotifications,
  sendTestNotification,
} from '@/src/services/notificationService';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  saveNotificationSettings,
} from '@/src/services/notificationSettings';
import {
  disconnectWorkCalendar,
  getWorkSyncConnection,
} from '@/src/services/workCalendarSync';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [vibration, setVibration] = useState(true);
  const [pcConnected, setPcConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    Promise.all([
      getNotificationSettings(),
      readAppPreferences(),
      getWorkSyncConnection(),
    ])
      .then(([notification, preferences, connection]) => {
        setSettings(notification);
        setVibration(preferences.vibration);
        setPcConnected(Boolean(connection));
      })
      .catch(() => {
        Alert.alert('Kunne ikke lese innstillingene', 'Start appen på nytt og prøv igjen.');
      });
  }, []);

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await saveNotificationSettings(settings);
      await writeAppPreferences({ vibration });
      await rescheduleAllAppointmentNotifications();
      Alert.alert('Innstillinger lagret', 'Eksisterende avtaler er planlagt på nytt.');
      router.back();
    } catch {
      Alert.alert('Kunne ikke lagre', 'Prøv igjen om et øyeblikk.');
    } finally {
      setSaving(false);
    }
  }

  async function testNotification() {
    try {
      await sendTestNotification(settings);
    } catch (error) {
      Alert.alert(
        'Kunne ikke sende testvarsel',
        error instanceof Error ? error.message : 'Ukjent feil.',
      );
    }
  }

  async function disconnectPc() {
    if (disconnecting) return;
    setDisconnecting(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Koble fra PC',
        fallbackLabel: 'Bruk kode',
        cancelLabel: 'Avbryt',
      });
      if (!result.success) return;

      await disconnectWorkCalendar();
      setPcConnected(false);
      Alert.alert('PC koblet fra', 'Importerte perioder og paringstoken er fjernet.');
    } catch {
      Alert.alert('Kunne ikke koble fra PC-en', 'Prøv igjen om et øyeblikk.');
    } finally {
      setDisconnecting(false);
    }
  }

  function confirmDisconnect() {
    Alert.alert(
      'Koble fra PC?',
      'Importerte Opptatt-perioder fjernes. Lokale avtaler beholdes.',
      [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Koble fra', style: 'destructive', onPress: () => void disconnectPc() },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Innstillinger</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ReminderSettingsCard settings={settings} onChange={setSettings} />
        <ToggleSettingsCard
          title="Varslingslyd"
          description="Standard iPhone-lyd."
          value={settings.soundEnabled}
          onChange={(soundEnabled) => setSettings({ ...settings, soundEnabled })}
          actionLabel="Send testvarsel"
          onAction={() => void testNotification()}
        />
        <ToggleSettingsCard
          title="Haptikk"
          description="Fysisk respons på trykk og lagring."
          value={vibration}
          onChange={setVibration}
        />
        {pcConnected ? (
          <PcSyncSettingsCard
            disconnecting={disconnecting}
            onDisconnect={confirmDisconnect}
          />
        ) : null}
        <Text style={styles.note}>
          En Ny Dag skjules i appveksleren og låses etter 2 minutter i bakgrunnen.
        </Text>
      </ScrollView>

      <Pressable
        disabled={saving}
        onPress={save}
        style={[styles.saveButton, saving && styles.disabled]}
      >
        <Text style={styles.saveText}>
          {saving ? 'Lagrer …' : 'Lagre innstillinger'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, padding: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 20, paddingTop: 20 },
  note: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  saveButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 20, height: 58, justifyContent: 'center' },
  saveText: { color: colors.white, fontSize: 19, fontWeight: '700' },
  disabled: { opacity: 0.55 },
});
