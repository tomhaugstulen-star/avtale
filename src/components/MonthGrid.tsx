import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { getCalendarDays, weekDays } from '@/src/utils/calendar';

type Props = {
  month: Date;
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

export function MonthGrid({ month, selectedDay, onSelectDay }: Props) {
  const days = getCalendarDays(month);

  return (
    <View>
      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => {
          const selected = day === selectedDay;

          return (
            <View key={`${day ?? 'empty'}-${index}`} style={styles.cell}>
              {day ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Velg ${day}.`}
                  onPress={() => onSelectDay(day)}
                  style={[styles.dayButton, selected && styles.selectedDay]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedText]}>
                    {day}
                  </Text>
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
  weekRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    width: '14.2857%',
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  selectedDay: {
    backgroundColor: colors.private,
  },
  dayText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '700',
  },
});
