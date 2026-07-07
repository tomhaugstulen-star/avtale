import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getWorkAppointments } from '@/src/services/workAppointmentStorage';
import { getWorkSyncConnection, syncWorkCalendar } from '@/src/services/workCalendarSync';
import { getAppointmentsForMonth, getMarkedDays } from '@/src/utils/appointments';
import { getMonthTitle } from '@/src/utils/calendar';
import { MonthGrid } from './MonthGrid';

export function WorkCalendarView() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [syncText, setSyncText] = useState('');

  const loadAppointments = useCallback(async () => {
    const connection = await getWorkSyncConnection();
    if (connection) {
      setSyncText('Oppdaterer fra PC …');
      try {
        const result = await syncWorkCalendar();
        setSyncText(`${result.count} tidspunkt hentet fra PC`);
      } catch {
        setSyncText('PC ikke tilgjengelig – viser sist lagrede kalender');
      }
    }
    getWorkAppointments().then(setAppointments).catch(() => setAppointments([]));
  }, []);

  useFocusEffect(useCallback(() => { loadAppointments(); }, [loadAppointments]));

  const markedDays = getMarkedDays(getAppointmentsForMonth(appointments, month));

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setSelectedDay(null);
  }

  function openNewAppointment() {
    if (!selectedDay) return;
    const date = new Date(month.getFullYear(), month.getMonth(), selectedDay, 12);
    router.push({ pathname: '/work-new-appointment', params: { date: date.toISOString() } });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.arrowButton}><Text style={styles.arrowText}>{'<'}</Text></Pressable>
          <Text style={styles.monthTitle}>{getMonthTitle(month)}</Text>
          <Pressable onPress={() => changeMonth(1)} style={styles.arrowButton}><Text style={styles.arrowText}>{'>'}</Text></Pressable>
        </View>
        <MonthGrid month={month} selectedDay={selectedDay} markedDays={markedDays} accentColor={colors.work} onSelectDay={setSelectedDay} />
      </View>
      {!!syncText && <Text style={styles.syncText}>{syncText}</Text>}
      <View style={styles.actions}>
        <Pressable disabled={!selectedDay} onPress={openNewAppointment} style={[styles.button, !selectedDay && styles.disabled]}><Text style={styles.buttonText}>Ny avtale</Text></Pressable>
        <Pressable onPress={() => router.push('/work-appointments')} style={styles.secondaryButton}><Text style={styles.secondaryText}>Mine avtaler</Text></Pressable>
        <Pressable onPress={() => router.push('/work-sync')} style={styles.syncButton}><Text style={styles.syncButtonText}>PC-synk</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { backgroundColor: colors.surface, borderRadius: 28, padding: 16 },
  monthHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  arrowButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 44 },
  arrowText: { color: colors.work, fontSize: 30 },
  monthTitle: { color: colors.textPrimary, fontSize: 20, textTransform: 'capitalize' },
  syncText: { color: colors.textSecondary, fontSize: 13, marginTop: 8, textAlign: 'center' },
  actions: { gap: 10, marginTop: 'auto' },
  button: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 22, height: 64, justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  buttonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderColor: colors.work, borderRadius: 18, borderWidth: 1.5, height: 48, justifyContent: 'center' },
  secondaryText: { color: colors.work, fontSize: 18, fontWeight: '700' },
  syncButton: { alignItems: 'center', height: 40, justifyContent: 'center' },
  syncButtonText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
});
