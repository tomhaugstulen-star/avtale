import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getWorkAppointments } from '@/src/services/workAppointmentStorage';
import { getAppointmentsForMonth } from '@/src/utils/appointments';
import { getMonthTitle } from '@/src/utils/calendar';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

function getMonthFilter(yearValue?: string, monthValue?: string) {
  const year = Number(yearValue);
  const month = Number(monthValue);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
    return null;
  }
  return new Date(year, month, 1);
}

export default function WorkAppointmentsScreen() {
  const router = useRouter();
  const { month, year } = useLocalSearchParams<{ month?: string; year?: string }>();
  const monthFilter = useMemo(() => getMonthFilter(year, month), [month, year]);
  const [items, setItems] = useState<Appointment[]>([]);

  useFocusEffect(
    useCallback(() => {
      getWorkAppointments().then(setItems).catch(() => setItems([]));
    }, []),
  );

  const visibleItems = monthFilter ? getAppointmentsForMonth(items, monthFilter) : items;
  const title = monthFilter ? getMonthTitle(monthFilter) : 'Mine avtaler';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
        <View style={styles.spacer} />
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={visibleItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={(
          <Text style={styles.empty}>
            {monthFilter ? 'Ingen avtaler denne måneden' : 'Ingen avtaler ennå'}
          </Text>
        )}
        renderItem={({ item }) => {
          const date = new Date(item.startDate);
          const imported = item.source === 'website';
          const appointmentTitle = imported ? item.initials || 'Opptatt' : item.title;
          return (
            <Pressable
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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  headerTitle: { color: colors.textPrimary, flex: 1, fontSize: 25, fontWeight: '700', textAlign: 'center', textTransform: 'capitalize' },
  spacer: { width: 44 },
  list: { gap: 12, paddingBottom: 24, paddingTop: 14 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, flexDirection: 'row', padding: 18 },
  cardText: { flex: 1 },
  pressed: { opacity: 0.7 },
  date: { color: colors.textSecondary, fontSize: 16, textTransform: 'capitalize' },
  time: { color: colors.work, fontSize: 20, fontWeight: '700', marginTop: 5 },
  itemTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 3 },
  imported: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  chevron: { color: colors.work, fontSize: 26, marginLeft: 12 },
  empty: { color: colors.textSecondary, fontSize: 20, marginTop: 32, textAlign: 'center' },
});
