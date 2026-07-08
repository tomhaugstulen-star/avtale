import { StyleSheet, Text, View } from 'react-native';

import { HapticPressable as Pressable } from '@/src/components/HapticPressable';
import { colors } from '@/src/constants/colors';
import { getCalendarDays, weekDays } from '@/src/utils/calendar';

type Props = {
  month: Date;
  selectedDay: number | null;
  markedDays?: number[];
  accentColor?: string;
  onSelectDay: (day: number) => void;
};

export function MonthGrid({
  month,
  selectedDay,
  markedDays = [],
  accentColor = colors.private,
  onSelectDay,
}: Props) {
  const days = getCalendarDays(month);
  const compact = days.length === 42;
  const today = new Date();
  const showingCurrentMonth =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth();

  return (
    <View>
      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => {
          const selected = day !== null && day === selectedDay;
          const isToday = showingCurrentMonth && day === today.getDate();
          const marked = day ? markedDays.includes(day) : false;

          return (
            <View key={`${day ?? 'empty'}-${index}`} style={[styles.cell, compact && styles.compactCell]}>
              {day ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Velg ${day}.`}
                  onPress={() => onSelectDay(day)}
                  style={[
                    styles.dayButton,
                    isToday && !selected && { borderColor: accentColor, borderWidth: 2 },
                    selected && { backgroundColor: accentColor },
                  ]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedText]}>{day}</Text>
                  {marked ? (
                    <View style={[styles.dot, { backgroundColor: selected ? colors.white : accentColor }]} />
                  ) : null}
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', marginBottom: 12 },
  weekDay: { color: colors.textSecondary, flex: 1, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { alignItems: 'center', height: 54, justifyContent: 'center', width: '14.2857%' },
  compactCell: { height: 48 },
  dayButton: { alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  dayText: { color: colors.textPrimary, fontSize: 20, fontWeight: '500' },
  selectedText: { color: colors.white, fontWeight: '700' },
  dot: { borderRadius: 3, bottom: 4, height: 6, position: 'absolute', width: 6 },
});
