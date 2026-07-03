import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getWorkAppointments } from '@/src/services/workAppointmentStorage';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

export default function WorkAppointmentsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Appointment[]>([]);

  useFocusEffect(useCallback(() => {
    getWorkAppointments().then(setItems).catch(() => setItems([]));
  }, []));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>{'<'}</Text></Pressable>
        <Text style={styles.title}>Mine avtaler</Text><View style={styles.spacer} />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Ingen avtaler ennå</Text>}
        renderItem={({ item }) => {
          const date = new Date(item.startDate);
          return (
            <Pressable onPress={() => router.push({ pathname: '/work-edit-appointment', params: { id: item.id } })} style={styles.card}>
              <View style={styles.cardText}>
                <Text style={styles.date}>{formatLongDate(date)}</Text>
                <Text style={styles.time}>{formatTime(date)}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <Text style={styles.chevron}>{'>'}</Text>
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
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 }, backText: { color: colors.work, fontSize: 30 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' }, spacer: { width: 44 }, list: { gap: 12, paddingBottom: 24, paddingTop: 14 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, flexDirection: 'row', padding: 18 }, cardText: { flex: 1 },
  date: { color: colors.textSecondary, fontSize: 16, textTransform: 'capitalize' }, time: { color: colors.work, fontSize: 20, fontWeight: '700', marginTop: 5 },
  itemTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 3 }, chevron: { color: colors.work, fontSize: 26, marginLeft: 12 },
  empty: { color: colors.textSecondary, fontSize: 20, marginTop: 32, textAlign: 'center' },
});
