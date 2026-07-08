import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import {
  normalizeLocalBaseUrl,
  normalizePairingToken,
} from '@/src/services/workCalendarSyncValidation';

const ADDRESS_KEY = 'workCalendarSyncBaseUrl';
const TOKEN_KEY = 'workCalendarSyncToken';
const LEGACY_CONNECTION_KEY = 'workCalendarSyncConnection';

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type SyncConnection = {
  baseUrl: string;
  token: string;
};

export async function saveSyncConnection(connection: SyncConnection) {
  const normalized = {
    baseUrl: normalizeLocalBaseUrl(connection.baseUrl),
    token: normalizePairingToken(connection.token),
  };

  await Promise.all([
    AsyncStorage.setItem(ADDRESS_KEY, normalized.baseUrl),
    SecureStore.setItemAsync(TOKEN_KEY, normalized.token, secureStoreOptions),
  ]);
  await AsyncStorage.removeItem(LEGACY_CONNECTION_KEY);
  return normalized;
}

async function migrateLegacyConnection() {
  const value = await AsyncStorage.getItem(LEGACY_CONNECTION_KEY);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<SyncConnection>;
    if (!parsed.baseUrl || !parsed.token) return null;
    return await saveSyncConnection({ baseUrl: parsed.baseUrl, token: parsed.token });
  } catch {
    await AsyncStorage.removeItem(LEGACY_CONNECTION_KEY);
    return null;
  }
}

export async function getSyncConnection(): Promise<SyncConnection | null> {
  const [baseUrl, token] = await Promise.all([
    AsyncStorage.getItem(ADDRESS_KEY),
    SecureStore.getItemAsync(TOKEN_KEY, secureStoreOptions),
  ]);

  if (baseUrl && token) {
    try {
      return {
        baseUrl: normalizeLocalBaseUrl(baseUrl),
        token: normalizePairingToken(token),
      };
    } catch {
      await clearSyncConnection();
      return null;
    }
  }

  return migrateLegacyConnection();
}

export async function clearSyncConnection() {
  await Promise.all([
    AsyncStorage.multiRemove([ADDRESS_KEY, LEGACY_CONNECTION_KEY]),
    SecureStore.deleteItemAsync(TOKEN_KEY, secureStoreOptions),
  ]);
}
