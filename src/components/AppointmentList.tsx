import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { formatTime } from '@/src/utils/dateFormat';

type Props = {
  appointments: Appointment[];
  onSelect: (appointment: Appointment) => void;
};

export function AppointmentList({ appointments, onSelect }: Props) {
  if (appointments.length === 0) {
    return <Text style={styles.emptyText}>Ingen avtaler denne dagen</Text>;
  }

  return (
    <View style={styles.list}>
      {appointments.map((appointment) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Rediger ${appointment.title}`}
          key={appointment.id}
          onPress={() => onSelect(appointment)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.textWrap}>
            <Text style={styles.time}>{formatTime(new Date(appointment.startDate))}</Text>
            <Text style={styles.title}>{appointment.title}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: { color: colors.textSecondary, fontSize: 18, marginTop: 10 },
  list: { gap: 10, marginTop: 12 },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    padding: 16,
  },
  pressed: { opacity: 0.72 },
  textWrap: { flex: 1 },
  time: { color: colors.private, fontSize: 20, fontWeight: '700' },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 4,
  },
  chevron: { color: colors.private, fontSize: 34, marginLeft: 12 },
});
