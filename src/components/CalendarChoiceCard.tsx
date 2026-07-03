import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';

type Props = {
  title: string;
  accent: string;
  softBackground: string;
  icon: number;
  onPress: () => void;
};

export function CalendarChoiceCard({
  title,
  accent,
  softBackground,
  icon,
  onPress,
}: Props) {
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
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.82}
        numberOfLines={2}
        style={styles.title}
      >
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
    minHeight: 270,
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    height: 76,
    marginBottom: 24,
    resizeMode: 'contain',
    width: 76,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  arrowCircle: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: 'auto',
    width: 48,
  },
  arrow: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 40,
    marginTop: -4,
  },
});
