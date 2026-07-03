import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthGrid } from '@/src/components/MonthGrid';
import { colors } from '@/src/constants/colors';
import { getMonthTitle } from '@/src/utils/calendar';

export default function CalendarScreen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const monthTitle = getMonthTitle(today);

  function openNewAppointment() {
    const date = new Date(today.getFullYear(), today.getMonth(), selectedDay, 12);
    router.push({ pathname: '/new-appointment', params: { date: date.toISOString() } });
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
        <Text style={styles.monthTitle}>{monthTitle}</Text>
        <MonthGrid month={today} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </View>

      <View style={styles.daySection}>
        <Text style={styles.dayTitle}>{selectedDay}. {monthTitle.split(' ')[0]}</Text>
        <Text style={styles.emptyText}>Ingen avtaler denne dagen</Text>
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
  monthTitle: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', marginBottom: 20, textTransform: 'capitalize' },
  daySection: { backgroundColor: colors.privateSoft, borderRadius: 24, marginTop: 18, padding: 20 },
  dayTitle: { color: colors.textPrimary, fontSize: 25, fontWeight: '700', textTransform: 'capitalize' },
  emptyText: { color: colors.textSecondary, fontSize: 18, marginTop: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.private, borderRadius: 22, height: 68, justifyContent: 'center', marginTop: 'auto' },
  primaryButtonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
