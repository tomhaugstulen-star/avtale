let workSessionUnlocked = false;

export function unlockWorkSession() {
  workSessionUnlocked = true;
}

export function lockWorkSession() {
  workSessionUnlocked = false;
}

export function isWorkSessionUnlocked() {
  return workSessionUnlocked;
}
