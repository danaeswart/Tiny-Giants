import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'tg.onboarding.skippedChild';

/** Remember that the parent chose to add a child later, so the app stops nudging them back to onboarding. */
export async function skipAddChild() {
  try {
    await AsyncStorage.setItem(KEY, '1');
  } catch {
    // Not remembering is harmless: they'll just see the step again next launch.
  }
}

export async function hasSkippedAddChild() {
  try {
    return (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    return false;
  }
}
