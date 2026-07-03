import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';

export default function WorkCalendarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={() => router.replace('/')} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>En Ny Dag</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}><Text style={styles.icon}>✓</Text></View>
        <Text style={styles.heading}>Låst opp</Text>
        <Text style={styles.text}>Arbeidskalenderen er klar for neste byggetrinn.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  headerSpacer: { width: 44 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 70 },
  iconCircle: { alignItems: 'center', backgroundColor: colors.workSoft, borderRadius: 48, height: 96, justifyContent: 'center', width: 96 },
  icon: { color: colors.work, fontSize: 50, fontWeight: '700' },
  heading: { color: colors.textPrimary, fontSize: 30, fontWeight: '700', marginTop: 24 },
  text: { color: colors.textSecondary, fontSize: 19, lineHeight: 27, marginTop: 10, maxWidth: 310, textAlign: 'center' },
});
