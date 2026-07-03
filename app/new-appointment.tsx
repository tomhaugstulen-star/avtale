import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DictationButton } from '@/src/components/DictationButton';
import { TimePickerModal } from '@/src/components/TimePickerModal';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { addAppointment } from '@/src/services/appointmentStorage';
import { cancelAppointmentNotification, scheduleAppointmentNotification } from '@/src/services/notificationService';
import { combineDateAndTime } from '@/src/utils/appointments';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

export default function NewAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const selectedDate = useMemo(() => new Date(params.date ?? Date.now()), [params.date]);
  const initialTime = useMemo(() => {
    const value = new Date(selectedDate);
    value.setHours(12, 0, 0, 0);
    return value;
  }, [selectedDate]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(initialTime);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveAppointment() {
    if (!title.trim() || saving) return;
    setSaving(true);
    const startDate = combineDateAndTime(selectedDate, time);
    let notificationId: string | undefined;

    try {
      notificationId = await scheduleAppointmentNotification(title.trim(), startDate);
      const appointment: Appointment = {
        id: `${Date.now()}`,
        title: title.trim(),
        startDate: startDate.toISOString(),
        calendarType: 'private',
        createdAt: new Date().toISOString(),
        notificationId,
      };
      await addAppointment(appointment);
      router.back();
    } catch {
      await cancelAppointmentNotification(notificationId);
      setSaving(false);
      Alert.alert('Kunne ikke lagre', 'Prøv igjen om et øyeblikk.');
    }
  }

  const disabled = !title.trim() || saving;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Lukk" onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.screenTitle}>Ny avtale</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>Dato</Text>
          <Text style={styles.dateText}>{formatLongDate(selectedDate)}</Text>
        </View>

        <Text style={styles.label}>Hva skal du gjøre?</Text>
        <TextInput autoFocus placeholder="Skriv avtalen" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} style={styles.textInput} />
        <DictationButton accentColor={colors.private} onTranscript={setTitle} />

        <Text style={styles.label}>Klokkeslett</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Velg klokkeslett" onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
          <Text style={styles.timeText}>{formatTime(time)}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Du får varsel</Text>
          <Text style={styles.noticeText}>2 timer før avtalen</Text>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Lagre avtale" disabled={disabled} onPress={saveAppointment} style={[styles.saveButton, disabled && styles.saveDisabled]}>
          <Text style={styles.saveText}>{saving ? 'Lagrer…' : 'Lagre avtale'}</Text>
        </Pressable>
      </KeyboardAvoidingView>
      <TimePickerModal visible={showTimePicker} value={time} onChange={setTime} onClose={() => setShowTimePicker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  container: { flex: 1, paddingBottom: 18, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  headerButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  closeText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  screenTitle: { color: colors.textPrimary, fontSize: 30, fontWeight: '700' },
  dateCard: { backgroundColor: colors.privateSoft, borderRadius: 22, marginTop: 12, padding: 18 },
  dateLabel: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  dateText: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 4, textTransform: 'capitalize' },
  label: { color: colors.textPrimary, fontSize: 20, fontWeight: '600', marginBottom: 10, marginTop: 24 },
  textInput: { backgroundColor: colors.surface, borderColor: colors.private, borderRadius: 20, borderWidth: 1.5, color: colors.textPrimary, fontSize: 26, minHeight: 72, paddingHorizontal: 18 },
  timeButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.private, borderRadius: 20, borderWidth: 1.5, flexDirection: 'row', minHeight: 72, paddingHorizontal: 18 },
  timeText: { color: colors.textPrimary, flex: 1, fontSize: 28, fontWeight: '600' },
  chevron: { color: colors.private, fontSize: 28 },
  noticeCard: { backgroundColor: '#FFF3D8', borderRadius: 20, marginTop: 18, padding: 18 },
  noticeTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  noticeText: { color: colors.textPrimary, fontSize: 18, marginTop: 2 },
  saveButton: { alignItems: 'center', backgroundColor: '#2FB98E', borderRadius: 22, height: 68, justifyContent: 'center', marginTop: 'auto' },
  saveDisabled: { opacity: 0.45 },
  saveText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
