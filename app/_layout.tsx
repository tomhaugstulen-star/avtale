import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import {
  isWorkSessionUnlocked,
  lockWorkSession,
} from '@/src/services/workSession';

const WORK_LOCK_DELAY_MS = 2 * 60 * 1000;

function isProtectedWorkRoute(route: string) {
  return route.startsWith('work-') && route !== 'work-lock';
}

function WorkSecurityGuard() {
  const segments = useSegments();
  const route = segments[0] ?? '';
  const protectedRoute = isProtectedWorkRoute(route);
  const backgroundAt = useRef<number | null>(null);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const sessionLocked = protectedRoute && !isWorkSessionUnlocked();

  useEffect(() => {
    if (sessionLocked) router.replace('/work-lock');
  }, [sessionLocked]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        if (protectedRoute) {
          setPrivacyVisible(true);
          backgroundAt.current ??= Date.now();
        }
        return;
      }

      if (state !== 'active') return;

      const elapsed = backgroundAt.current === null
        ? 0
        : Date.now() - backgroundAt.current;
      backgroundAt.current = null;

      if (protectedRoute && elapsed >= WORK_LOCK_DELAY_MS) {
        lockWorkSession();
        router.replace('/work-lock');
      }
      setPrivacyVisible(false);
    });

    return () => subscription.remove();
  }, [protectedRoute]);

  if (!protectedRoute || (!privacyVisible && !sessionLocked)) return null;

  return (
    <View style={styles.privacyOverlay}>
      <Text style={styles.privacyTitle}>En Ny Dag er skjult</Text>
      <Text style={styles.privacyText}>Åpne appen for å fortsette.</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      <WorkSecurityGuard />
    </>
  );
}

const styles = StyleSheet.create({
  privacyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
    zIndex: 1000,
  },
  privacyTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  privacyText: {
    color: colors.textSecondary,
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
  },
});
