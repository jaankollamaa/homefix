// Storage layer: the only file that talks to LocalStorage.
// It knows nothing about appliances, only how to load and save one data object.

const STORAGE_KEY = 'homefix-data';
const BACKUP_KEY = 'homefix-data-corrupted-backup';
const DATA_VERSION = 1;

function createEmptyData() {
  return { version: DATA_VERSION, appliances: [], tasks: [], repairs: [] };
}

function hasValidShape(data) {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.appliances) &&
    Array.isArray(data.tasks) &&
    Array.isArray(data.repairs)
  );
}

// If saved data cannot be read, keep a copy of it before the next save overwrites it.
function backUpUnreadableData(rawText) {
  if (rawText === null) return;
  try {
    localStorage.setItem(BACKUP_KEY, rawText);
  } catch {
    // Nothing more we can do.
  }
}

export function loadData() {
  let rawText = null;

  try {
    rawText = localStorage.getItem(STORAGE_KEY);
    if (rawText === null) {
      return createEmptyData(); // first visit: nothing saved yet
    }

    const parsed = JSON.parse(rawText); // throws an error if the text is not valid JSON
    if (hasValidShape(parsed)) {
      return parsed;
    }
    console.warn('HomeFix: saved data has an unexpected shape. Starting empty.');
  } catch (error) {
    console.error('HomeFix: could not read saved data.', error);
  }

  backUpUnreadableData(rawText);
  return createEmptyData();
}

// Returns true if the data was saved, false if something went wrong
// (for example storage is full or blocked by the browser).
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('HomeFix: could not save data.', error);
    return false;
  }
}