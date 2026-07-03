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
          <Text style={styles.title}>God morgen!</Text>
          <Text style={styles.subtitle}>Hvilken kalender vil du se i dag?</Text>
        </View>

        <View style={styles.cards}>
          <CalendarChoiceCard
            title="Privat"
            subtitle="Din personlige kalender"
            accent={colors.private}
            softBackground={colors.privateSoft}
            icon={privateIcon}
            onPress={openPrivate}
          />
          <CalendarChoiceCard
            title="En Ny Dag"
            subtitle="Din arbeidskalender"
            accent={colors.work}
            softBackground={colors.workSoft}
            icon={workIcon}
            onPress={openWork}
          />
        </View>

        <Text style={styles.privacy}>⌾ Valget ditt er privat og lagres lokalt</Text>
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
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  header: {
    alignItems: 'center',
    marginTop: 34,
  },
  sun: {
    color: '#F1B542',
    fontSize: 64,
    lineHeight: 68,
    marginBottom: 18,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: '500',
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 22,
    lineHeight: 30,
    marginTop: 12,
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 62,
  },
  privacy: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 'auto',
    paddingBottom: 8,
    textAlign: 'center',
  },
});
