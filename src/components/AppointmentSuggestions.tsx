import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';

type Props = {
  appointments: Appointment[];
  input: string;
  accentColor: string;
  onSelect: (title: string) => void;
};

function getSuggestions(appointments: Appointment[], input: string) {
  const query = input.trim().toLocaleLowerCase('nb-NO');
  if (!query) return [];

  const stats = new Map<string, { title: string; count: number; latest: string }>();
  appointments.forEach((item) => {
    const title = item.title.trim();
    const key = title.toLocaleLowerCase('nb-NO');
    const current = stats.get(key);
    stats.set(key, {
      title,
      count: (current?.count ?? 0) + 1,
      latest: current && current.latest > item.startDate ? current.latest : item.startDate,
    });
  });

  return [...stats.values()]
    .filter((item) => {
      const title = item.title.toLocaleLowerCase('nb-NO');
      return title.startsWith(query) && title !== query;
    })
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest))
    .slice(0, 4);
}

export function AppointmentSuggestions({ appointments, input, accentColor, onSelect }: Props) {
  const suggestions = getSuggestions(appointments, input);
  if (suggestions.length === 0) return null;

  function select(title: string) {
    Vibration.vibrate(10);
    onSelect(title);
  }

  return (
    <View style={styles.dropdown}>
      {suggestions.map((item, index) => (
        <Pressable
          accessibilityRole="button"
          key={item.title.toLocaleLowerCase('nb-NO')}
          onPress={() => select(item.title)}
          style={({ pressed }) => [
            styles.option,
            index < suggestions.length - 1 && styles.divider,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.optionText, { color: accentColor }]}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    elevation: 8,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    top: 78,
    zIndex: 20,
  },
  option: { justifyContent: 'center', minHeight: 50, paddingHorizontal: 16 },
  divider: { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  pressed: { opacity: 0.62, transform: [{ scale: 0.99 }] },
  optionText: { fontSize: 19, fontWeight: '700' },
});
