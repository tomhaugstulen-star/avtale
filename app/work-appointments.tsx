import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HapticPressable as Pressable } from '@/src/components/HapticPressable';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getWorkAppointments } from '@/src/services/workAppointmentStorage';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

function getYearFilter(value?: string) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100
    ? year
    : new Date().getFullYear();
}

export default function WorkAppointmentsScreen() {
  const router = useRouter();
  const { year } = useLocalSearchParams<{ year?: string }>();
  const selectedYear = useMemo(() => getYearFilter(year), [year]);
  const [items, setItems] = useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      getWorkAppointments().then(setItems).catch(() => setItems([]));
    }, []),
  );

  const visibleItems = items
    .filter((item) => new Date(item.startDate).getFullYear() === selectedYear)
    .sort((first, second) => first.startDate.localeCompare(second.startDate));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>Alle avtaler {selectedYear}</Text>
        <View style={styles.spacer} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={visibleItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Ingen avtaler i {selectedYear}</Text>}
        renderItem={({ item }) => {
          const date = new Date(item.startDate);
          const imported = item.source === 'website';
          const appointmentTitle = imported ? item.initials || 'Opptatt' : item.title;
          return (
            <Pressable
              accessibilityRole={imported ? undefined : 'button'}
              disabled={imported}
              onPress={() => router.push({
                pathname: '/work-edit-appointment',
                params: { id: item.id },
              })}
              style={({ pressed }) => [styles.card, pressed && !imported && styles.pressed]}
            >
              <View style={styles.cardText}>
                <Text style={styles.date}>{formatLongDate(date)}</Text>
                <Text style={styles.time}>{formatTime(date)}</Text>
                <Text style={styles.itemTitle}>{appointmentTitle}</Text>
                {imported ? <Text style={styles.imported}>Importert fra PC</Text> : null}
              </View>
              {!imported ? <Text style={styles.chevron}>›</Text> : null}
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({
          pathname: '/work-new-appointment',
          params: { date: new Date().toISOString() },
        })}
        style={styles.newButton}
      >
        <Text style={styles.newButtonText}>＋ Ny avtale</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 14, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  headerTitle: { color: colors.textPrimary, flex: 1, fontSize: 25, fontWeight: '700', textAlign: 'center' },
  spacer: { width: 44 },
  list: { flex: 1 },
  listContent: { gap: 12, paddingBottom: 18, paddingTop: 14 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, flexDirection: 'row', padding: 18 },
  cardText: { flex: 1 },
  pressed: { opacity: 0.7 },
  date: { color: colors.textSecondary, fontSize: 16, textTransform: 'capitalize' },
  time: { color: colors.work, fontSize: 20, fontWeight: '700', marginTop: 5 },
  itemTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 3 },
  imported: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  chevron: { color: colors.work, fontSize: 26, marginLeft: 12 },
  empty: { color: colors.textSecondary, fontSize: 20, marginTop: 32, textAlign: 'center' },
  newButton: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 20, height: 58, justifyContent: 'center' },
  newButtonText: { color: colors.white, fontSize: 20, fontWeight: '700' },
});
