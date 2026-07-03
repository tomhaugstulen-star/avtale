import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { getAppointments } from '@/src/services/appointmentStorage';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadError, setLoadError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setLoadError('');
      getAppointments()
        .then(setAppointments)
        .catch(() => setLoadError('Kunne ikke hente avtalene.'));
    }, []),
  );

  function openAppointment(item: Appointment) {
    router.push({ pathname: '/edit-appointment', params: { id: item.id } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Mine avtaler</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loadError ? <Text style={styles.errorText}>{loadError}</Text> : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={appointments}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Ingen avtaler ennå</Text>}
          renderItem={({ item }) => {
            const date = new Date(item.startDate);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Rediger ${item.title}`}
                onPress={() => openAppointment(item)}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              >
                <View style={styles.cardText}>
                  <Text style={styles.dateText}>{formatLongDate(date)}</Text>
                  <Text style={styles.timeText}>{formatTime(date)}</Text>
                  <Text style={styles.appointmentTitle}>{item.title}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.private, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  headerSpacer: { width: 44 },
  listContent: { gap: 12, paddingBottom: 24, paddingTop: 14 },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, flexDirection: 'row', padding: 18 },
  pressed: { opacity: 0.72 },
  cardText: { flex: 1 },
  dateText: { color: colors.textSecondary, fontSize: 16, textTransform: 'capitalize' },
  timeText: { color: colors.private, fontSize: 20, fontWeight: '700', marginTop: 5 },
  appointmentTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '600', marginTop: 3 },
  chevron: { color: colors.private, fontSize: 34, marginLeft: 12 },
  emptyText: { color: colors.textSecondary, fontSize: 20, marginTop: 32, textAlign: 'center' },
  errorText: { color: '#A33A3A', fontSize: 18, marginTop: 24, textAlign: 'center' },
});
