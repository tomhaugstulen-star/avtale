import { Pressable, type PressableProps } from 'react-native';

import { tapFeedback } from '@/src/services/feedback';

export function HapticPressable({ onPress, ...props }: PressableProps) {
  const handlePress: PressableProps['onPress'] = (event) => {
    void tapFeedback().catch(() => undefined);
    onPress?.(event);
  };

  return <Pressable {...props} onPress={handlePress} />;
}
