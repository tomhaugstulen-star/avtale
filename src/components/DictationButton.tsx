import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';

type Props = {
  accentColor: string;
  onTranscript: (text: string) => void;
};

export function DictationButton({ accentColor, onTranscript }: Props) {
  const [recognizing, setRecognizing] = useState(false);
  const [status, setStatus] = useState('');

  useSpeechRecognitionEvent('start', () => {
    setRecognizing(true);
    setStatus('Lytter...');
  });

  useSpeechRecognitionEvent('end', () => {
    setRecognizing(false);
    setStatus('');
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript?.trim();
    if (text) onTranscript(text);
  });

  useSpeechRecognitionEvent('error', () => {
    setRecognizing(false);
    setStatus('');
    Alert.alert('Diktering stoppet', 'Prøv igjen og snakk tydelig.');
  });

  async function toggleDictation() {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Tillatelse mangler', 'Mikrofon og talegjenkjenning må være tillatt i Innstillinger.');
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: 'nb-NO',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
      iosTaskHint: 'dictation',
    });
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={recognizing ? 'Stopp diktering' : 'Start diktering'}
        onPress={toggleDictation}
        style={[styles.button, { borderColor: accentColor }, recognizing && { backgroundColor: accentColor }]}
      >
        <Text style={[styles.icon, { color: recognizing ? colors.white : accentColor }]}>🎤</Text>
        <Text style={[styles.text, { color: recognizing ? colors.white : accentColor }]}>
          {recognizing ? 'Stopp' : 'Dikter avtalen'}
        </Text>
      </Pressable>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: { fontSize: 20, marginRight: 8 },
  text: { fontSize: 18, fontWeight: '700' },
  status: { color: colors.textSecondary, fontSize: 15, marginTop: 6, textAlign: 'center' },
});
