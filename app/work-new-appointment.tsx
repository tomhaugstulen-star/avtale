import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentSuggestions } from '@/src/components/AppointmentSuggestions';
import { TimePickerModal } from '@/src/components/TimePickerModal';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { scheduleAppointmentNotification } from '@/src/services/notificationService';
import { addWorkAppointment, getWorkAppointments } from '@/src/services/workAppointmentStorage';
import { combineDateAndTime } from '@/src/utils/appointments';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

export default function WorkNewAppointmentScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = useMemo(() => new Date(date ?? Date.now()), [date]);
  const initialTime = useMemo(() => {
    const value = new Date(selectedDate);
    value.setHours(12, 0, 0, 0);
    return value;
  }, [selectedDate]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(initialTime);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWorkAppointments().then(setHistory).catch(() => setHistory([]));
  }, []);

  function tap() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async function save() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      const startDate = combineDateAndTime(selectedDate, time);
      const notificationId = await scheduleAppointmentNotification(title.trim(), startDate);
      await addWorkAppointment({ id: `${Date.now()}`, title: title.trim(), startDate: startDate.toISOString(), calendarType: 'work', createdAt: new Date().toISOString(), notificationId });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Kunne ikke lagre', 'Prøv igjen om et øyeblikk.');
    }
  }

  const disabled = !title.trim() || saving;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPressIn={tap} onPress={() => router.back()} style={styles.headerButton}><Text style={styles.closeText}>x</Text></Pressable>
          <Text style={styles.screenTitle}>Ny avtale</Text><View style={styles.headerButton} />
        </View>
        <View style={styles.dateCard}><Text style={styles.dateLabel}>Dato</Text><Text style={styles.dateText}>{formatLongDate(selectedDate)}</Text></View>
        <Text style={styles.label}>Hva skal du gjøre?</Text>
        <View style={styles.inputArea}>
          <TextInput autoFocus value={title} onChangeText={setTitle} placeholder="Skriv avtalen" placeholderTextColor={colors.textSecondary} style={styles.textInput} />
          <AppointmentSuggestions appointments={history} input={title} accentColor={colors.work} onSelect={setTitle} />
        </View>
        <Text style={styles.label}>Klokkeslett</Text>
        <Pressable onPressIn={tap} onPress={() => setShowPicker(true)} style={styles.timeButton}><Text style={styles.timeText}>{formatTime(time)}</Text><Text style={styles.chevron}>v</Text></Pressable>
        <View style={styles.noticeCard}><Text style={styles.noticeTitle}>Du får varsel</Text><Text style={styles.noticeText}>2 timer før avtalen</Text></View>
        <Pressable disabled={disabled} onPressIn={disabled ? undefined : tap} onPress={save} style={[styles.saveButton, disabled && styles.disabled]}><Text style={styles.saveText}>{saving ? 'Lagrer...' : 'Lagre avtale'}</Text></Pressable>
      </View>
      <TimePickerModal visible={showPicker} value={time} onChange={setTime} onClose={() => setShowPicker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flex: 1, padding: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, headerButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  closeText: { color: colors.work, fontSize: 34 }, screenTitle: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  dateCard: { backgroundColor: colors.workSoft, borderRadius: 22, marginTop: 12, padding: 18 }, dateLabel: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  dateText: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 4, textTransform: 'capitalize' }, label: { color: colors.textPrimary, fontSize: 20, fontWeight: '600', marginBottom: 10, marginTop: 20 },
  inputArea: { position: 'relative', zIndex: 20 },
  textInput: { backgroundColor: colors.surface, borderColor: colors.work, borderRadius: 20, borderWidth: 1.5, color: colors.textPrimary, fontSize: 26, minHeight: 72, paddingHorizontal: 18 },
  timeButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.work, borderRadius: 20, borderWidth: 1.5, flexDirection: 'row', minHeight: 72, paddingHorizontal: 18 },
  timeText: { color: colors.textPrimary, flex: 1, fontSize: 28, fontWeight: '600' }, chevron: { color: colors.work, fontSize: 22 },
  noticeCard: { backgroundColor: '#FFF3D8', borderRadius: 20, marginTop: 18, padding: 18 }, noticeTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' }, noticeText: { color: colors.textPrimary, fontSize: 18, marginTop: 2 },
  saveButton: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 22, height: 68, justifyContent: 'center', marginTop: 'auto' }, disabled: { opacity: 0.45 }, saveText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
