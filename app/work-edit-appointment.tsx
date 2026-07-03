import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TimePickerModal } from '@/src/components/TimePickerModal';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { cancelAppointmentNotification, scheduleAppointmentNotification } from '@/src/services/notificationService';
import { deleteWorkAppointment, getWorkAppointment, updateWorkAppointment } from '@/src/services/workAppointmentStorage';
import { combineDateAndTime } from '@/src/utils/appointments';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

export default function WorkEditAppointmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<Appointment>();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getWorkAppointment(id).then((value) => {
      if (!value) return;
      setItem(value);
      setTitle(value.title);
      setTime(new Date(value.startDate));
    });
  }, [id]);

  async function save() {
    if (!item || !title.trim() || saving) return;
    setSaving(true);
    const date = combineDateAndTime(new Date(item.startDate), time);
    let notificationId: string | undefined;
    try {
      notificationId = await scheduleAppointmentNotification(title.trim(), date);
      await updateWorkAppointment({ ...item, title: title.trim(), startDate: date.toISOString(), notificationId });
      await cancelAppointmentNotification(item.notificationId);
      router.back();
    } catch {
      await cancelAppointmentNotification(notificationId);
      setSaving(false);
      Alert.alert('Kunne ikke lagre', 'Prøv igjen om et øyeblikk.');
    }
  }

  function confirmDelete() {
    if (!item) return;
    Alert.alert('Slette avtalen?', item.title, [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Slett', style: 'destructive', onPress: async () => {
        await deleteWorkAppointment(item.id);
        await cancelAppointmentNotification(item.notificationId);
        router.back();
      } },
    ]);
  }

  if (!item) return <SafeAreaView style={styles.safeArea}><Text style={styles.loading}>Henter avtalen...</Text></SafeAreaView>;
  const date = new Date(item.startDate);
  const disabled = !title.trim() || saving;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}><Text style={styles.closeText}>x</Text></Pressable>
          <Text style={styles.screenTitle}>Rediger avtale</Text><View style={styles.headerButton} />
        </View>
        <View style={styles.dateCard}><Text style={styles.dateLabel}>Dato</Text><Text style={styles.dateText}>{formatLongDate(date)}</Text></View>
        <Text style={styles.label}>Hva skal du gjøre?</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.textInput} />
        <Text style={styles.label}>Klokkeslett</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.timeButton}><Text style={styles.timeText}>{formatTime(time)}</Text><Text style={styles.chevron}>v</Text></Pressable>
        <Pressable onPress={confirmDelete} style={styles.deleteButton}><Text style={styles.deleteText}>Slett avtale</Text></Pressable>
        <Pressable disabled={disabled} onPress={save} style={[styles.saveButton, disabled && styles.disabled]}><Text style={styles.saveText}>{saving ? 'Lagrer...' : 'Lagre endringer'}</Text></Pressable>
      </View>
      <TimePickerModal visible={showPicker} value={time} onChange={setTime} onClose={() => setShowPicker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 }, container: { flex: 1, padding: 18 }, loading: { color: colors.textPrimary, fontSize: 20, margin: 24 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, headerButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  closeText: { color: colors.work, fontSize: 34 }, screenTitle: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  dateCard: { backgroundColor: colors.workSoft, borderRadius: 22, marginTop: 12, padding: 18 }, dateLabel: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  dateText: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 4, textTransform: 'capitalize' }, label: { color: colors.textPrimary, fontSize: 20, fontWeight: '600', marginBottom: 10, marginTop: 24 },
  textInput: { backgroundColor: colors.surface, borderColor: colors.work, borderRadius: 20, borderWidth: 1.5, color: colors.textPrimary, fontSize: 26, minHeight: 72, paddingHorizontal: 18 },
  timeButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.work, borderRadius: 20, borderWidth: 1.5, flexDirection: 'row', minHeight: 72, paddingHorizontal: 18 },
  timeText: { color: colors.textPrimary, flex: 1, fontSize: 28, fontWeight: '600' }, chevron: { color: colors.work, fontSize: 22 },
  deleteButton: { alignItems: 'center', marginTop: 28, padding: 14 }, deleteText: { color: '#B23636', fontSize: 19, fontWeight: '700' },
  saveButton: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 22, height: 68, justifyContent: 'center', marginTop: 'auto' }, disabled: { opacity: 0.45 }, saveText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
