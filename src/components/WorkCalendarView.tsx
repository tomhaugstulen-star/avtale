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

  useFocusEffect(useCallback(() => { void loadAppointments(); }, [loadAppointments]));

  const markedDays = getMarkedDays(getAppointmentsForMonth(appointments, month));

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setSelectedDay(null);
  }

  function openDay(day: number) {
    setSelectedDay(day);
    const date = new Date(month.getFullYear(), month.getMonth(), day, 12);
    router.push({
      pathname: '/work-day-appointments',
      params: { date: date.toISOString() },
    });
  }

  function openToday() {
    router.push({
      pathname: '/work-day-appointments',
      params: { date: today.toISOString() },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.monthHeader}>
          <Pressable accessibilityRole="button" accessibilityLabel="Forrige måned" onPress={() => changeMonth(-1)} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </Pressable>
          <Text numberOfLines={1} style={styles.monthTitle}>{getMonthTitle(month)}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Neste måned" onPress={() => changeMonth(1)} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </Pressable>
        </View>
        <MonthGrid
          month={month}
          selectedDay={selectedDay}
          markedDays={markedDays}
          accentColor={colors.work}
          onSelectDay={openDay}
        />
      </View>

      <Text style={styles.helpText}>Trykk på en dato for å se avtalene.</Text>
      {!!syncText && <Text numberOfLines={2} style={styles.syncText}>{syncText}</Text>}

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={openToday} style={styles.button}>
          <Text numberOfLines={1} style={styles.buttonText}>Dagens avtaler</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/work-appointments')} style={styles.secondaryButton}>
          <Text numberOfLines={1} style={styles.secondaryText}>Alle avtaler</Text>
        </Pressable>
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
  monthTitle: { color: colors.textPrimary, flex: 1, fontSize: 20, textAlign: 'center', textTransform: 'capitalize' },
  helpText: { color: colors.textSecondary, fontSize: 14, marginTop: 10, textAlign: 'center' },
  syncText: { color: colors.textSecondary, fontSize: 13, marginTop: 5, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  button: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 18, flex: 1, height: 52, justifyContent: 'center', paddingHorizontal: 8 },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderColor: colors.work, borderRadius: 18, borderWidth: 1.5, flex: 1, height: 52, justifyContent: 'center', paddingHorizontal: 8 },
  secondaryText: { color: colors.work, fontSize: 17, fontWeight: '700' },
});
