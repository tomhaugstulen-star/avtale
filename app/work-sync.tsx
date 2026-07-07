import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors } from '@/src/constants/colors';
import { getWorkSyncConnection, saveWorkSyncConnection, syncWorkCalendar } from '@/src/services/workCalendarSync';

export default function WorkSyncScreen() {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getWorkSyncConnection().then((connection) => {
      if (!connection) return;
      setBaseUrl(connection.baseUrl);
      setToken(connection.token);
    });
  }, []);

  async function saveAndTest() {
    if (!baseUrl.trim() || !token.trim()) {
      Alert.alert('Mangler informasjon', 'Fyll inn PC-adresse og token fra KALENDER-PARING.txt.');
      return;
    }
    setBusy(true);
    try {
      await saveWorkSyncConnection({ baseUrl, token });
      const result = await syncWorkCalendar();
      Alert.alert('Synkronisert', `${result.count} tidspunkt ble hentet fra PC-en.`);
      router.back();
    } catch (error) {
      Alert.alert('Kunne ikke koble til PC-en', error instanceof Error ? error.message : 'Ukjent feil.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable>
        <Text style={styles.title}>PC-synk</Text>
        <View style={styles.spacer} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>PC-adresse</Text>
        <TextInput autoCapitalize="none" autoCorrect={false} keyboardType="url" onChangeText={setBaseUrl} placeholder="http://192.168.1.50:8787" style={styles.input} value={baseUrl} />
        <Text style={styles.label}>Token</Text>
        <TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setToken} placeholder="Token fra KALENDER-PARING.txt" secureTextEntry style={styles.input} value={token} />
        <Text style={styles.help}>PC og iPhone må være på samme private nettverk. Nettsiden og kalenderbroen må kjøre på PC-en.</Text>
      </View>
      <Pressable disabled={busy} onPress={saveAndTest} style={[styles.button, busy && styles.disabled]}><Text style={styles.buttonText}>{busy ? 'Kobler til …' : 'Lagre og synkroniser'}</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, padding: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  spacer: { width: 44 },
  card: { backgroundColor: colors.surface, borderRadius: 24, gap: 10, marginTop: 24, padding: 20 },
  label: { color: colors.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 4 },
  input: { backgroundColor: colors.background, borderRadius: 14, color: colors.textPrimary, fontSize: 16, minHeight: 52, paddingHorizontal: 14 },
  help: { color: colors.textSecondary, fontSize: 15, lineHeight: 21, marginTop: 8 },
  button: { alignItems: 'center', backgroundColor: colors.work, borderRadius: 20, height: 58, justifyContent: 'center', marginTop: 'auto' },
  buttonText: { color: colors.white, fontSize: 19, fontWeight: '700' },
  disabled: { opacity: 0.55 },
});
