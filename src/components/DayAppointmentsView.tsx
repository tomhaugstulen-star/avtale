import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';
import { getMonthTitle } from '@/src/utils/calendar';

type Props = {
  date: Date;
  appointments: Appointment[];
  accentColor: string;
  onNewAppointment: () => void;
  onOpenMonth: () => void;
  onPressAppointment?: (appointment: Appointment) => void;
};

function isSameDay(value: string, date: Date) {
  const itemDate = new Date(value);
  return itemDate.getFullYear() === date.getFullYear()
    && itemDate.getMonth() === date.getMonth()
    && itemDate.getDate() === date.getDate();
}

export function DayAppointmentsView({
  date,
  appointments,
  accentColor,
  onNewAppointment,
  onOpenMonth,
  onPressAppointment,
}: Props) {
  const items = appointments
    .filter((item) => isSameDay(item.startDate, date))
    .sort((first, second) => first.startDate.localeCompare(second.startDate));

  return (
    <View style={styles.container}>
      <View style={styles.dateCard}>
        <Text style={styles.dateLabel}>Valgt dag</Text>
        <Text style={styles.dateText}>{formatLongDate(date)}</Text>
        <Text style={styles.countText}>
          {items.length === 1 ? '1 avtale' : `${items.length} avtaler`}
        </Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={(
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Ingen avtaler denne dagen</Text>
            <Text style={styles.emptyText}>Du kan opprette en ny avtale med knappen under.</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const imported = item.source === 'website';
          const title = imported ? item.initials || 'Opptatt' : item.title;
          const canOpen = !imported && Boolean(onPressAppointment);

          return (
            <Pressable
              accessibilityRole={canOpen ? 'button' : undefined}
              disabled={!canOpen}
              onPress={() => onPressAppointment?.(item)}
              style={({ pressed }) => [
                styles.appointmentCard,
                pressed && canOpen && styles.pressed,
              ]}
            >
              <Text style={[styles.time, { color: accentColor }]}>
                {formatTime(new Date(item.startDate))}
              </Text>
              <View style={styles.appointmentText}>
                <Text numberOfLines={2} style={styles.title}>{title}</Text>
                {imported ? <Text style={styles.source}>Importert fra PC</Text> : null}
              </View>
              {canOpen ? <Text style={[styles.chevron, { color: accentColor }]}>›</Text> : null}
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actions}>
        <Pressable
          onPress={onNewAppointment}
          style={[styles.primaryButton, { backgroundColor: accentColor }]}
        >
          <Text style={styles.primaryText}>＋ Ny avtale</Text>
        </Pressable>
        <Pressable
          onPress={onOpenMonth}
          style={[styles.secondaryButton, { borderColor: accentColor }]}
        >
          <Text style={[styles.secondaryText, { color: accentColor }]}>
            Alle avtaler i {getMonthTitle(date)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dateCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 18 },
  dateLabel: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
  dateText: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 4, textTransform: 'capitalize' },
  countText: { color: colors.textSecondary, fontSize: 15, marginTop: 5 },
  list: { gap: 10, paddingBottom: 16, paddingTop: 14 },
  emptyCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, padding: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 19, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 15, lineHeight: 21, marginTop: 6, textAlign: 'center' },
  appointmentCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, flexDirection: 'row', minHeight: 72, padding: 16 },
  pressed: { opacity: 0.7 },
  time: { fontSize: 18, fontWeight: '700', width: 62 },
  appointmentText: { flex: 1 },
  title: { color: colors.textPrimary, fontSize: 19, fontWeight: '600' },
  source: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  chevron: { fontSize: 30, marginLeft: 8 },
  actions: { gap: 10, paddingTop: 4 },
  primaryButton: { alignItems: 'center', borderRadius: 20, height: 58, justifyContent: 'center' },
  primaryText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderRadius: 18, borderWidth: 1.5, minHeight: 52, justifyContent: 'center', paddingHorizontal: 12 },
  secondaryText: { fontSize: 17, fontWeight: '700', textAlign: 'center', textTransform: 'capitalize' },
});
