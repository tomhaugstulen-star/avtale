import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthGrid } from '@/src/components/MonthGrid';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getAppointments } from '@/src/services/appointmentStorage';
import { getAppointmentsForMonth, getMarkedDays } from '@/src/utils/appointments';
import { getMonthTitle } from '@/src/utils/calendar';

export default function CalendarScreen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const monthTitle = getMonthTitle(month);

  useFocusEffect(
    useCallback(() => {
      getAppointments().then(setAppointments).catch(() => setAppointments([]));
    }, []),
  );

  const monthAppointments = getAppointmentsForMonth(appointments, month);
  const markedDays = getMarkedDays(monthAppointments);

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setSelectedDay(null);
  }

  function openDay(day: number) {
    setSelectedDay(day);
    const date = new Date(month.getFullYear(), month.getMonth(), day, 12);
    router.push({ pathname: '/day-appointments', params: { date: date.toISOString() } });
  }

  function openToday() {
    router.push({ pathname: '/day-appointments', params: { date: today.toISOString() } });
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
        <MonthGrid
          month={month}
          selectedDay={selectedDay}
          markedDays={markedDays}
          onSelectDay={openDay}
        />
      </View>

      <Text style={styles.helpText}>Trykk på en dato for å se avtalene.</Text>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={openToday} style={styles.primaryButton}>
          <Text numberOfLines={1} style={styles.primaryButtonText}>Dagens avtaler</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/appointments')} style={styles.secondaryButton}>
          <Text numberOfLines={1} style={styles.secondaryButtonText}>Alle avtaler</Text>
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
  helpText: { color: colors.textSecondary, fontSize: 14, marginTop: 10, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 18, flex: 1, height: 52, justifyContent: 'center', paddingHorizontal: 8 },
  primaryButtonText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderColor: colors.private, borderRadius: 18, borderWidth: 1.5, flex: 1, height: 52, justifyContent: 'center', paddingHorizontal: 8 },
  secondaryButtonText: { color: colors.private, fontSize: 17, fontWeight: '700' },
});
