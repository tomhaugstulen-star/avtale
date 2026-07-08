import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const WORK_LOCK_DELAY_MS = 2 * 60 * 1000;

function useWorkAutoLock() {
  const segments = useSegments();
  const route = segments[0] ?? '';
  const backgroundAt = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      const isProtectedRoute = route.startsWith('work-') && route !== 'work-lock';

      if (state === 'inactive' || state === 'background') {
        if (isProtectedRoute && backgroundAt.current === null) {
          backgroundAt.current = Date.now();
        }
        return;
      }

      if (state === 'active') {
        const elapsed = backgroundAt.current === null
          ? 0
          : Date.now() - backgroundAt.current;
        backgroundAt.current = null;

        if (isProtectedRoute && elapsed >= WORK_LOCK_DELAY_MS) {
          router.replace('/work-lock');
        }
      }
    });

    return () => subscription.remove();
  }, [route]);
}

export default function RootLayout() {
  useWorkAutoLock();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
