import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';

type Props = {
  title: string;
  subtitle: string;
  accent: string;
  softBackground: string;
  icon: number;
  onPress: () => void;
};

export function CalendarChoiceCard({
  title,
  subtitle,
  accent,
  softBackground,
  icon,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: accent, backgroundColor: softBackground },
        pressed && styles.pressed,
      ]}
    >
      <Image source={icon} style={[styles.icon, { tintColor: accent }]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={[styles.arrowCircle, { backgroundColor: accent }]}> 
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1.5,
    flex: 1,
    minHeight: 340,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    height: 92,
    marginBottom: 26,
    resizeMode: 'contain',
    width: 92,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 20,
    lineHeight: 28,
    minHeight: 56,
    textAlign: 'center',
  },
  arrowCircle: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginTop: 'auto',
    width: 56,
  },
  arrow: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '300',
    lineHeight: 46,
    marginTop: -4,
  },
});
