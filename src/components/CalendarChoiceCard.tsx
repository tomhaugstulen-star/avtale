import { Image, StyleSheet, Text, View } from 'react-native';

import { HapticPressable as Pressable } from '@/src/components/HapticPressable';
import { colors } from '@/src/constants/colors';

type Props = {
  title: string;
  accent: string;
  softBackground: string;
  icon: number;
  onPress: () => void;
};

export function CalendarChoiceCard({ title, accent, softBackground, icon, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: accent, backgroundColor: softBackground },
        pressed && styles.pressed,
      ]}
    >
      <Image source={icon} style={styles.icon} />
      <Text adjustsFontSizeToFit minimumFontScale={0.8} numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      <View style={[styles.arrowCircle, { backgroundColor: accent }]}> 
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 1.5,
    flex: 1,
    minHeight: 240,
    paddingHorizontal: 12,
    paddingVertical: 22,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  icon: { height: 68, marginBottom: 22, resizeMode: 'contain', width: 68 },
  title: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  arrowCircle: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginTop: 'auto',
    width: 44,
  },
  arrow: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 36,
    marginTop: -3,
  },
});
