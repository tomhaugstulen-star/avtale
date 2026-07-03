import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarChoiceCard } from '@/src/components/CalendarChoiceCard';
import { colors } from '@/src/constants/colors';

const background = require('@/assets/images/welcome-background.webp');
const privateIcon = require('@/assets/images/private-icon.png');
const workIcon = require('@/assets/images/en-ny-dag-icon.png');

export default function WelcomeScreen() {
  const openPrivate = () => {};
  const openWork = () => {};

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text accessibilityElementsHidden style={styles.sun}>☀︎</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
            God morgen!
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            Hvilken kalender vil du se i dag?
          </Text>
        </View>

        <View style={styles.cards}>
          <CalendarChoiceCard
            title="Privat"
            accent={colors.private}
            softBackground={colors.privateSoft}
            icon={privateIcon}
            onPress={openPrivate}
          />
          <CalendarChoiceCard
            title="En Ny Dag"
            accent={colors.work}
            softBackground={colors.workSoft}
            icon={workIcon}
            onPress={openWork}
          />
        </View>

        <Text style={styles.privacy}>Valget ditt lagres lokalt på telefonen</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
  },
  sun: {
    color: '#F1B542',
    fontSize: 52,
    lineHeight: 56,
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: '600',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 20,
    lineHeight: 27,
    marginTop: 10,
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 40,
  },
  privacy: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 'auto',
    paddingBottom: 4,
    textAlign: 'center',
  },
});
