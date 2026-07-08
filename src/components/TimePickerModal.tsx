import { Modal, StyleSheet, Text, View } from 'react-native';

import { HapticPressable as Pressable } from '@/src/components/HapticPressable';
import { colors } from '@/src/constants/colors';
import { confirmFeedback } from '@/src/services/feedback';

type Props = {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

function changeTime(value: Date, hours: number, minutes: number) {
  const next = new Date(value);
  next.setHours((next.getHours() + hours + 24) % 24);
  next.setMinutes((next.getMinutes() + minutes + 60) % 60);
  return next;
}

export function TimePickerModal({ visible, value, onChange, onClose }: Props) {
  const hour = value.getHours().toString().padStart(2, '0');
  const minute = value.getMinutes().toString().padStart(2, '0');

  function close() {
    void confirmFeedback();
    onClose();
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Velg klokkeslett</Text>
            <Pressable accessibilityRole="button" onPress={close} style={styles.doneButton}>
              <Text style={styles.doneText}>Ferdig</Text>
            </Pressable>
          </View>
          <View style={styles.pickerRow}>
            <TimeColumn label="Timer" value={hour} onUp={() => onChange(changeTime(value, 1, 0))} onDown={() => onChange(changeTime(value, -1, 0))} />
            <Text style={styles.separator}>:</Text>
            <TimeColumn label="Minutter" value={minute} onUp={() => onChange(changeTime(value, 0, 5))} onDown={() => onChange(changeTime(value, 0, -5))} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

type TimeColumnProps = { label: string; value: string; onUp: () => void; onDown: () => void };

function TimeColumn({ label, value, onUp, onDown }: TimeColumnProps) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={onUp} style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}><Text style={styles.adjustText}>＋</Text></Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable accessibilityRole="button" onPress={onDown} style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}><Text style={styles.adjustText}>−</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(16, 23, 47, 0.28)', flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, paddingBottom: 30 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  doneButton: { paddingHorizontal: 10, paddingVertical: 10 },
  doneText: { color: colors.private, fontSize: 18, fontWeight: '700' },
  pickerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  column: { alignItems: 'center', minWidth: 120 },
  columnLabel: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  adjustButton: { alignItems: 'center', height: 52, justifyContent: 'center', width: 72 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.94 }] },
  adjustText: { color: colors.private, fontSize: 36, fontWeight: '600' },
  value: { color: colors.textPrimary, fontSize: 44, fontWeight: '700', marginVertical: 4 },
  separator: { color: colors.textPrimary, fontSize: 44, fontWeight: '700', marginHorizontal: 4, marginTop: 26 },
});
