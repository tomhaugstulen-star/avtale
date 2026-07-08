import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import {
  REMINDER_OPTIONS,
  type NotificationSettings,
} from '@/src/services/notificationSettings';

type ReminderProps = {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
};

export function ReminderSettingsCard({ settings, onChange }: ReminderProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Varslingstid</Text>
      <Text style={styles.help}>Gjelder både Privat og En Ny Dag.</Text>
      <View style={styles.options}>
        {REMINDER_OPTIONS.map((option) => {
          const selected = settings.reminderMinutes === option.value;
          return (
            <Pressable
              key={option.label}
              onPress={() => onChange({ ...settings, reminderMinutes: option.value })}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type ToggleProps = {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  actionLabel?: string;
  onAction?: () => void;
};

export function ToggleSettingsCard({
  title,
  description,
  value,
  onChange,
  actionLabel,
  onAction,
}: ToggleProps) {
  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.help}>{description}</Text>
        </View>
        <Switch value={value} onValueChange={onChange} />
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type PcSyncProps = {
  disconnecting: boolean;
  onDisconnect: () => void;
};

export function PcSyncSettingsCard({ disconnecting, onDisconnect }: PcSyncProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>PC-synk</Text>
      <Text style={styles.help}>Telefonen er koblet til en lokal PC.</Text>
      <Pressable
        disabled={disconnecting}
        onPress={onDisconnect}
        style={[styles.dangerButton, disconnecting && styles.disabled]}
      >
        <Text style={styles.dangerText}>
          {disconnecting ? 'Kobler fra …' : 'Koble fra PC'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  help: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 16,
  },
  option: {
    borderColor: '#C8CED6',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  optionSelected: {
    backgroundColor: colors.private,
    borderColor: colors.private,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextSelected: { color: colors.white },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchText: { flex: 1, paddingRight: 14 },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.private,
    borderRadius: 17,
    borderWidth: 1.5,
    height: 50,
    justifyContent: 'center',
    marginTop: 18,
  },
  secondaryText: {
    color: colors.private,
    fontSize: 17,
    fontWeight: '700',
  },
  dangerButton: { alignItems: 'center', marginTop: 16, padding: 12 },
  dangerText: { color: '#B23636', fontSize: 17, fontWeight: '700' },
  disabled: { opacity: 0.55 },
});
