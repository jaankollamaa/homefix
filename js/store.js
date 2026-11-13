// Data layer: the one place where appliances are added, changed and removed.
// Views never touch LocalStorage directly; they call these functions.

import { loadData, saveData } from './storage.js';
import { generateId } from './utils.js';

let data = loadData(); // loaded once, when the app starts

// Saves a new version of the data. If saving fails we throw an error and keep
// the old data, so the screen never shows something that was not really saved.
function commit(newData) {
  if (!saveData(newData)) {
    throw new Error(
      'Could not save your data. Your browser’s storage may be full or blocked.'
    );
  }
  data = newData;
}

// Returns the saved appliances. Treat the result as read-only.
export function getAppliances() {
  return data.appliances;
}

// "fields" must already be validated (see validation.js).
export function addAppliance(fields) {
  const appliance = {
    id: generateId(),
    ...fields,
    createdAt: new Date().toISOString(),
  };
  commit({ ...data, appliances: [...data.appliances, appliance] });
  return appliance;
}

export function updateAppliance(id, fields) {
  const appliances = data.appliances.map((appliance) =>
    appliance.id === id ? { ...appliance, ...fields } : appliance
  );
  commit({ ...data, appliances });
}

// Removes the appliance together with its maintenance tasks and repairs,
// so no record is left pointing at an appliance that no longer exists.
export function deleteAppliance(id) {
  commit({
    ...data,
    appliances: data.appliances.filter((appliance) => appliance.id !== id),
    tasks: data.tasks.filter((task) => task.applianceId !== id),
    repairs: data.repairs.filter((repair) => repair.applianceId !== id),
  });
}