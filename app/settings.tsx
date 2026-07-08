import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors } from '@/src/constants/colors';
import {
  readAppPreferences,
  writeAppPreferences,
} from '@/src/services/appPreferences';
import {
  rescheduleAllAppointmentNotifications,
  sendTestNotification,
} from '@/src/services/notificationService';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  REMINDER_OPTIONS,
  saveNotificationSettings,
  type NotificationSettings,
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
        {
          text: 'Koble fra',
          style: 'destructive',
          onPress: () => void disconnectPc(),
        },
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
        <ReminderCard settings={settings} onChange={setSettings} />

        <View style={styles.card}>
          <SettingSwitch
            title="Varslingslyd"
            description="Standard iPhone-lyd."
            value={settings.soundEnabled}
            onChange={(soundEnabled) => setSettings({ ...settings, soundEnabled })}
          />
          <Pressable onPress={testNotification} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Send testvarsel</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <SettingSwitch
            title="Haptikk"
            description="Fysisk respons på trykk og lagring."
            value={vibration}
            onChange={setVibration}
          />
        </View>

        {pcConnected ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>PC-synk</Text>
            <Text style={styles.help}>Telefonen er koblet til en lokal PC.</Text>
            <Pressable
              disabled={disconnecting}
              onPress={confirmDisconnect}
              style={[styles.dangerButton, disconnecting && styles.disabled]}
            >
              <Text style={styles.dangerText}>
                {disconnecting ? 'Kobler fra …' : 'Koble fra PC'}
              </Text>
            </Pressable>
          </View>
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

type SettingsProps = {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
};

function ReminderCard({ settings, onChange }: SettingsProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Varslingstid</Text>
      <Text style={styles.help}>Gjelder både Privat og En Ny Dag.</Text>
      <View style={styles.options}>
        {REMINDER_OPTIONS.map((option) => {
          const selected = settings.reminderMinutes === option.value;
          return (
            <Pressable
              key={option.label}
              onPress={() => onChange({ ...settings, reminderMinutes: option.value })}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type SwitchProps = {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SettingSwitch({ title, description, value, onChange }: SwitchProps) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.help}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, padding: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  content: { gap: 14, paddingBottom: 20, paddingTop: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 20 },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  help: { color: colors.textSecondary, fontSize: 15, marginTop: 4 },
  note: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 16 },
  option: { borderColor: '#C8CED6', borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 15, paddingVertical: 11 },
  optionSelected: { backgroundColor: colors.private, borderColor: colors.private },
  optionText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  optionTextSelected: { color: colors.white },
  switchRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  switchText: { flex: 1, paddingRight: 14 },
  secondaryButton: { alignItems: 'center', borderColor: colors.private, borderRadius: 17, borderWidth: 1.5, height: 50, justifyContent: 'center', marginTop: 18 },
  secondaryText: { color: colors.private, fontSize: 17, fontWeight: '700' },
  dangerButton: { alignItems: 'center', marginTop: 16, padding: 12 },
  dangerText: { color: '#B23636', fontSize: 17, fontWeight: '700' },
  saveButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 20, height: 58, justifyContent: 'center' },
  saveText: { color: colors.white, fontSize: 19, fontWeight: '700' },
  disabled: { opacity: 0.55 },
});
