import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarChoiceCard } from '@/src/components/CalendarChoiceCard';
import { colors } from '@/src/constants/colors';

const background = require('@/assets/images/welcome-background.webp');
const privateIcon = require('@/assets/images/private-icon.png');
const workIcon = require('@/assets/images/en-ny-dag-icon.png');

function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'God morgen!';
  if (hour >= 12 && hour < 17) return 'God dag!';
  return 'God kveld!';
}

export default function WelcomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const timer = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text accessibilityElementsHidden style={styles.sun}>☀︎</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
            {greeting}
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
            onPress={() => router.push('/calendar')}
          />
          <CalendarChoiceCard
            title="En Ny Dag"
            accent={colors.work}
            softBackground={colors.workSoft}
            icon={workIcon}
            onPress={() => router.push('/work-lock')}
          />
        </View>

        <Text style={styles.privacy}>Valget ditt lagres lokalt på telefonen</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 18, paddingVertical: 14 },
  header: { alignItems: 'center', marginTop: 18 },
  sun: { color: '#F1B542', fontSize: 52, lineHeight: 56, marginBottom: 12 },
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
  cards: { flexDirection: 'row', gap: 14, marginTop: 36 },
  privacy: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 'auto',
    paddingBottom: 18,
    textAlign: 'center',
  },
});
