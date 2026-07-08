import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WorkCalendarView } from '@/src/components/WorkCalendarView';
import { colors } from '@/src/constants/colors';
import { lockWorkSession } from '@/src/services/workSession';

export default function WorkCalendarScreen() {
  const router = useRouter();

  function closeWorkCalendar() {
    lockWorkSession();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tilbake" onPress={closeWorkCalendar} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>En Ny Dag</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Åpne PC-synk" onPress={() => router.push('/work-sync')} style={styles.syncButton}>
          <Text style={styles.syncText}>PC-synk</Text>
        </Pressable>
      </View>
      <WorkCalendarView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 14, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', height: 46, justifyContent: 'center', position: 'relative' },
  backButton: { alignItems: 'flex-start', height: 42, justifyContent: 'center', left: 0, position: 'absolute', width: 72 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  syncButton: { alignItems: 'flex-end', height: 42, justifyContent: 'center', position: 'absolute', right: 0, width: 72 },
  syncText: { color: colors.work, fontSize: 15, fontWeight: '700' },
});
