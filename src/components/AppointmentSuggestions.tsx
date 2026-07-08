import { StyleSheet, Text, View } from 'react-native';

import { HapticPressable as Pressable } from '@/src/components/HapticPressable';
import { appointmentChoices } from '@/src/constants/appointmentChoices';
import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';
import { confirmFeedback } from '@/src/services/feedback';

type Props = {
  appointments: Appointment[];
  input: string;
  accentColor: string;
  onSelect: (title: string) => void;
};

function getSuggestions(appointments: Appointment[], input: string) {
  const query = input.trim().toLocaleLowerCase('nb-NO');
  if (!query) return [];

  const titles = [
    ...appointmentChoices,
    ...appointments.map((item) => item.title.trim()),
  ].filter(Boolean);

  const unique = [...new Map(
    titles.map((title) => [title.toLocaleLowerCase('nb-NO'), title]),
  ).values()];

  return unique
    .filter((title) => title.toLocaleLowerCase('nb-NO').includes(query))
    .sort((a, b) => {
      const aStarts = a.toLocaleLowerCase('nb-NO').startsWith(query) ? 1 : 0;
      const bStarts = b.toLocaleLowerCase('nb-NO').startsWith(query) ? 1 : 0;
      return bStarts - aStarts || a.localeCompare(b, 'nb-NO');
    })
    .slice(0, 4);
}

export function AppointmentSuggestions({ appointments, input, accentColor, onSelect }: Props) {
  const suggestions = getSuggestions(appointments, input);
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.list}>
      {suggestions.map((title, index) => (
        <Pressable
          accessibilityRole="button"
          key={title.toLocaleLowerCase('nb-NO')}
          onPress={() => {
            void confirmFeedback();
            onSelect(title);
          }}
          style={({ pressed }) => [
            styles.option,
            index < suggestions.length - 1 && styles.divider,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.optionText, { color: accentColor }]}>{title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.surface,
    borderColor: '#D1D5DB',
    borderRadius: 18,
    borderWidth: 1,
    bottom: 80,
    elevation: 16,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    zIndex: 100,
  },
  option: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  divider: { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
  optionText: { fontSize: 19, fontWeight: '700' },
});
