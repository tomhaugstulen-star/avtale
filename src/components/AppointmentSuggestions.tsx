import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import type { Appointment } from '@/src/models/Appointment';

type Props = {
  appointments: Appointment[];
  input: string;
  accentColor: string;
  onSelect: (title: string) => void;
};

type Suggestion = { title: string; count: number; latest: string };

function getSuggestions(appointments: Appointment[], input: string) {
  const query = input.trim().toLocaleLowerCase('nb-NO');
  if (!query) return [];

  const stats = new Map<string, Suggestion>();
  appointments.forEach((item) => {
    const title = item.title.trim();
    if (!title) return;
    const key = title.toLocaleLowerCase('nb-NO');
    const current = stats.get(key);
    stats.set(key, {
      title,
      count: (current?.count ?? 0) + 1,
      latest: current && current.latest > item.startDate ? current.latest : item.startDate,
    });
  });

  const ranked = [...stats.values()].sort((a, b) =>
    b.count - a.count || b.latest.localeCompare(a.latest),
  );
  const startsWith = ranked.filter((item) =>
    item.title.toLocaleLowerCase('nb-NO').startsWith(query),
  );
  const contains = ranked.filter((item) => {
    const title = item.title.toLocaleLowerCase('nb-NO');
    return title.includes(query) && !title.startsWith(query);
  });

  return [...startsWith, ...contains].slice(0, 4);
}

export function AppointmentSuggestions({ appointments, input, accentColor, onSelect }: Props) {
  const suggestions = getSuggestions(appointments, input);
  if (suggestions.length === 0) return null;

  function pressFeedback() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function select(title: string) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSelect(title);
  }

  return (
    <View style={styles.dropdown}>
      {suggestions.map((item, index) => (
        <Pressable
          accessibilityRole="button"
          key={item.title.toLocaleLowerCase('nb-NO')}
          onPressIn={pressFeedback}
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
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 12,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    top: 78,
    zIndex: 50,
  },
  option: { backgroundColor: colors.surface, justifyContent: 'center', minHeight: 54, paddingHorizontal: 16 },
  divider: { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  pressed: { backgroundColor: '#F3F4F6', opacity: 0.78, transform: [{ scale: 0.985 }] },
  optionText: { fontSize: 19, fontWeight: '700' },
});
