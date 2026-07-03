import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentList } from '@/src/components/AppointmentList';
import { MonthGrid } from '@/src/components/MonthGrid';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getAppointments } from '@/src/services/appointmentStorage';
import {
  getAppointmentsForDay,
  getAppointmentsForMonth,
  getMarkedDays,
} from '@/src/utils/appointments';
import { getMonthTitle } from '@/src/utils/calendar';

export default function CalendarScreen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadError, setLoadError] = useState('');
  const monthTitle = getMonthTitle(month);
  const monthName = monthTitle.split(' ')[0].toLowerCase();

  useFocusEffect(
    useCallback(() => {
      setLoadError('');
      getAppointments()
        .then(setAppointments)
        .catch(() => setLoadError('Kunne ikke hente avtalene.'));
    }, []),
  );

  const monthAppointments = getAppointmentsForMonth(appointments, month);
  const markedDays = getMarkedDays(monthAppointments);
  const selectedAppointments = getAppointmentsForDay(monthAppointments, selectedDay);

  function changeMonth(offset: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    const isCurrentMonth =
      next.getFullYear() === today.getFullYear() &&
      next.getMonth() === today.getMonth();
    setMonth(next);
    setSelectedDay(isCurrentMonth ? today.getDate() : 1);
  }

  function openNewAppointment() {
    const date = new Date(month.getFullYear(), month.getMonth(), selectedDay, 12);
    router.push({ pathname: '/new-appointment', params: { date: date.toISOString() } });
  }

  function openAppointment(appointment: Appointment) {
    router.push({ pathname: '/edit-appointment', params: { id: appointment.id } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Privat</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.monthCard}>
        <View style={styles.monthHeader}>
          <Pressable accessibilityRole="button" accessibilityLabel="Forrige måned" onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Text style={styles.monthArrow}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{monthTitle}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Neste måned" onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Text style={styles.monthArrow}>›</Text>
          </Pressable>
        </View>
        <MonthGrid month={month} selectedDay={selectedDay} markedDays={markedDays} onSelectDay={setSelectedDay} />
      </View>

      <View style={styles.daySection}>
        <Text style={styles.dayTitle}>{selectedDay}. {monthName}</Text>
        {loadError ? <Text style={styles.errorText}>{loadError}</Text> : (
          <AppointmentList appointments={selectedAppointments} onSelect={openAppointment} />
        )}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Ny avtale" onPress={openNewAppointment} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>＋ Ny avtale</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 18, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  backButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  backText: { color: colors.private, fontSize: 44, lineHeight: 46 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '700' },
  headerSpacer: { width: 48 },
  monthCard: { backgroundColor: colors.surface, borderRadius: 28, marginTop: 8, paddingHorizontal: 16, paddingVertical: 20 },
  monthHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  monthButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  monthArrow: { color: colors.private, fontSize: 38, lineHeight: 40 },
  monthTitle: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', textTransform: 'capitalize' },
  daySection: { backgroundColor: colors.privateSoft, borderRadius: 24, marginTop: 18, padding: 20 },
  dayTitle: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  errorText: { color: '#A33A3A', fontSize: 18, marginTop: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 22, height: 68, justifyContent: 'center', marginTop: 'auto' },
  primaryButtonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
