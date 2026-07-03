import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const stats = new Map<string, { title: string; count: number; latest: string }>();

  appointments.forEach((item) => {
    const key = item.title.trim().toLocaleLowerCase('nb-NO');
    const current = stats.get(key);
    stats.set(key, {
      title: item.title.trim(),
      count: (current?.count ?? 0) + 1,
      latest: current && current.latest > item.startDate ? current.latest : item.startDate,
    });
  });

  return [...stats.values()]
    .filter((item) => !query || item.title.toLocaleLowerCase('nb-NO').includes(query))
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest))
    .slice(0, 6);
}

export function AppointmentSuggestions({ appointments, input, accentColor, onSelect }: Props) {
  const suggestions = getSuggestions(appointments, input);
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tidligere avtaler</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {suggestions.map((item) => (
          <Pressable
            key={item.title.toLocaleLowerCase('nb-NO')}
            onPress={() => onSelect(item.title)}
            style={[styles.chip, { borderColor: accentColor }]}
          >
            <Text style={[styles.chipText, { color: accentColor }]}>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  label: { color: colors.textSecondary, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  row: { gap: 8, paddingRight: 18 },
  chip: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 9 },
  chipText: { fontSize: 17, fontWeight: '700' },
});
