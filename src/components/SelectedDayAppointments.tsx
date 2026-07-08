import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { formatLongDate, formatTime } from '@/src/utils/dateFormat';

type Props = {
  date: Date | null;
  appointments: Appointment[];
  accentColor: string;
  onPressAppointment?: (appointment: Appointment) => void;
};

function sameDay(value: string, date: Date) {
  const appointmentDate = new Date(value);
  return appointmentDate.getFullYear() === date.getFullYear()
    && appointmentDate.getMonth() === date.getMonth()
    && appointmentDate.getDate() === date.getDate();
}

export function SelectedDayAppointments({ date, appointments, accentColor, onPressAppointment }: Props) {
  if (!date) return null;

  const items = appointments
    .filter((appointment) => sameDay(appointment.startDate, date))
    .sort((first, second) => first.startDate.localeCompare(second.startDate));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{formatLongDate(date)}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>Ingen avtaler denne dagen</Text>
      ) : (
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={items.length > 3} style={styles.list}>
          {items.map((appointment) => {
            const canOpen = appointment.source !== 'website' && Boolean(onPressAppointment);
            const title = appointment.source === 'website'
              ? appointment.initials || 'Opptatt'
              : appointment.title;

            return (
              <Pressable
                disabled={!canOpen}
                key={appointment.id}
                onPress={() => onPressAppointment?.(appointment)}
                style={({ pressed }) => [styles.row, pressed && canOpen && styles.pressed]}
              >
                <Text style={[styles.time, { color: accentColor }]}>{formatTime(new Date(appointment.startDate))}</Text>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                {canOpen ? <Text style={[styles.arrow, { color: accentColor }]}>›</Text> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: 20, marginTop: 12, padding: 14 },
  heading: { color: colors.textSecondary, fontSize: 15, fontWeight: '700', marginBottom: 8, textTransform: 'capitalize' },
  empty: { color: colors.textSecondary, fontSize: 16, paddingVertical: 8 },
  list: { maxHeight: 152 },
  row: { alignItems: 'center', borderTopColor: '#E5E7EB', borderTopWidth: 1, flexDirection: 'row', minHeight: 48 },
  pressed: { opacity: 0.65 },
  time: { fontSize: 16, fontWeight: '700', width: 58 },
  title: { color: colors.textPrimary, flex: 1, fontSize: 17, fontWeight: '600' },
  arrow: { fontSize: 26, marginLeft: 8 },
});
