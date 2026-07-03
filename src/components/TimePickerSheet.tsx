import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';

type Props = {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

export function TimePickerSheet({ visible, value, onChange, onClose }: Props) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Velg klokkeslett</Text>
            <Pressable onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Ferdig</Text>
            </Pressable>
          </View>
          <DateTimePicker
            display="spinner"
            locale="nb-NO"
            minuteInterval={5}
            mode="time"
            onChange={(_, date) => date && onChange(date)}
            style={styles.picker}
            value={value}
          />
        </View>
      </View>
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
    minHeight: 330,
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
  picker: {
    alignSelf: 'stretch',
    height: 220,
    marginTop: 8,
  },
});
