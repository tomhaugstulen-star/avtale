import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
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
  const selectedAppointments = selectedDay
    ? getAppointmentsForDay(monthAppointments, selectedDay)
    : [];

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setSelectedDay(null);
  }

  function openNewAppointment() {
    if (!selectedDay) return;
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
          <Text numberOfLines={1} style={styles.monthTitle}>{monthTitle}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Forrige måned" onPress={() => changeMonth(-1)} style={[styles.monthButton, styles.previousButton]}>
            <Text style={styles.monthArrow}>‹</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Neste måned" onPress={() => changeMonth(1)} style={[styles.monthButton, styles.nextButton]}>
            <Text style={styles.monthArrow}>›</Text>
          </Pressable>
        </View>
        <MonthGrid month={month} selectedDay={selectedDay} markedDays={markedDays} onSelectDay={setSelectedDay} />
      </View>

      <View style={styles.footer}>
        <View style={styles.daySection}>
          {selectedDay ? (
            <ScrollView contentContainerStyle={styles.appointmentContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.dayTitle}>{selectedDay}. {monthName}</Text>
              {loadError ? <Text style={styles.errorText}>{loadError}</Text> : (
                <AppointmentList appointments={selectedAppointments} onSelect={openAppointment} />
              )}
            </ScrollView>
          ) : <Text style={styles.chooseText}>Velg en dag</Text>}
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Ny avtale" disabled={!selectedDay} onPress={openNewAppointment} style={[styles.primaryButton, !selectedDay && styles.disabledButton]}>
          <Text style={styles.primaryButtonText}>＋ Ny avtale</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 14, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  backButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 44 },
  backText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  headerSpacer: { width: 44 },
  monthCard: { backgroundColor: colors.surface, borderRadius: 28, marginTop: 2, paddingHorizontal: 16, paddingVertical: 18 },
  monthHeader: { alignItems: 'center', height: 42, justifyContent: 'center', marginBottom: 16, position: 'relative' },
  monthButton: { alignItems: 'center', height: 42, justifyContent: 'center', position: 'absolute', top: 0, width: 44, zIndex: 1 },
  previousButton: { left: 0 },
  nextButton: { right: 0 },
  monthArrow: { color: colors.private, fontSize: 36, lineHeight: 38 },
  monthTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '400', paddingHorizontal: 44, textAlign: 'center', textTransform: 'capitalize', width: '100%' },
  footer: { gap: 12, height: 188, marginTop: 'auto' },
  daySection: { backgroundColor: colors.privateSoft, borderRadius: 24, height: 112, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 18 },
  appointmentContent: { paddingVertical: 14 },
  dayTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  chooseText: { color: colors.textSecondary, fontSize: 18, fontWeight: '600' },
  errorText: { color: '#A33A3A', fontSize: 18, marginTop: 6 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 22, height: 64, justifyContent: 'center' },
  disabledButton: { opacity: 0.45 },
  primaryButtonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
