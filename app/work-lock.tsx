import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';

export default function WorkLockScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function unlock() {
    if (busy) return;
    setBusy(true);
    setMessage('');

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setMessage('Face ID eller kode er ikke satt opp på telefonen.');
      setBusy(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Åpne En Ny Dag',
      fallbackLabel: 'Bruk kode',
      cancelLabel: 'Avbryt',
    });

    setBusy(false);
    if (result.success) {
      router.replace('/work-calendar');
      return;
    }

    if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
      setMessage('Kunne ikke låse opp. Prøv igjen.');
    }
  }

  useEffect(() => {
    void unlock();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>En Ny Dag</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.lockCircle}><Text style={styles.lockIcon}>🔒</Text></View>
        <Text style={styles.title}>Kalenderen er låst</Text>
        <Text style={styles.subtitle}>Bruk Face ID eller telefonens kode for å fortsette.</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable accessibilityRole="button" disabled={busy} onPress={unlock} style={[styles.button, busy && styles.disabled]}>
          <Text style={styles.buttonText}>{busy ? 'Kontrollerer …' : 'Lås opp'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  headerTitle: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  headerSpacer: { width: 44 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 70 },
  lockCircle: { alignItems: 'center', backgroundColor: colors.workSoft, borderRadius: 48, height: 96, justifyContent: 'center', width: 96 },
  lockIcon: { fontSize: 42 },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', marginTop: 24 },
  subtitle: { color: colors.textSecondary, fontSize: 19, lineHeight: 27, marginTop: 10, maxWidth: 310, textAlign: 'center' },
  message: { color: '#A33A3A', fontSize: 17, marginTop: 16, textAlign: 'center' },
  button: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 22, height: 62, justifyContent: 'center', marginTop: 28, width: '100%' },
  disabled: { opacity: 0.55 },
  buttonText: { color: colors.white, fontSize: 22, fontWeight: '700' },
});
