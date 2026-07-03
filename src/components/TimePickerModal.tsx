import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';

type Props = {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

export function TimePickerModal({ visible, value, onChange, onClose }: Props) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Velg klokkeslett</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Ferdig</Text>
            </Pressable>
          </View>
          <DateTimePicker
            display="spinner"
            locale="nb-NO"
            mode="time"
            minuteInterval={5}
            onChange={(_, date) => date && onChange(date)}
            value={value}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(16, 23, 47, 0.28)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  doneButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  doneText: {
    color: colors.private,
    fontSize: 18,
    fontWeight: '700',
  },
});
