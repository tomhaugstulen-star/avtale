import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayAppointmentsView } from '@/src/components/DayAppointmentsView';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getAppointments } from '@/src/services/appointmentStorage';

function parseDate(value?: string) {
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function isToday(date: Date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
}

export default function DayAppointmentsScreen() {
  const router = useRouter();
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
  const date = useMemo(() => parseDate(dateParam), [dateParam]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAppointments().then(setAppointments).catch(() => setAppointments([]));
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isToday(date) ? 'Dagens avtaler' : 'Avtaler'}
        </Text>
        <View style={styles.spacer} />
      </View>

      <DayAppointmentsView
        accentColor={colors.private}
        appointments={appointments}
        date={date}
        onNewAppointment={() => router.push({
          pathname: '/new-appointment',
          params: { date: date.toISOString() },
        })}
        onOpenMonth={() => router.push({
          pathname: '/appointments',
          params: {
            month: String(date.getMonth()),
            year: String(date.getFullYear()),
          },
        })}
        onPressAppointment={(appointment) => router.push({
          pathname: '/edit-appointment',
          params: { id: appointment.id },
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 14, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  headerTitle: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  spacer: { width: 44 },
});
