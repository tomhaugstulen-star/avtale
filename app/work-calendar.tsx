import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WorkCalendarView } from '@/src/components/WorkCalendarView';
import { colors } from '@/src/constants/colors';

export default function WorkCalendarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>En Ny Dag</Text>
        <View style={styles.headerSpacer} />
      </View>
      <WorkCalendarView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1, paddingBottom: 14, paddingHorizontal: 18 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  backButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 44 },
  backText: { color: colors.work, fontSize: 40, lineHeight: 42 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '700' },
  headerSpacer: { width: 44 },
});
