import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { formatTime } from '@/src/utils/dateFormat';

type Props = {
  appointments: Appointment[];
};

export function AppointmentList({ appointments }: Props) {
  if (appointments.length === 0) {
    return <Text style={styles.emptyText}>Ingen avtaler denne dagen</Text>;
  }

  return (
    <View style={styles.list}>
      {appointments.map((appointment) => (
        <View key={appointment.id} style={styles.card}>
          <Text style={styles.time}>{formatTime(new Date(appointment.startDate))}</Text>
          <Text style={styles.title}>{appointment.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 10,
  },
  list: {
    gap: 10,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
  },
  time: {
    color: colors.private,
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 4,
  },
});
