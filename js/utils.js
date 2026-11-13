// Small helpers used across the app.

// Creates a unique ID for a record.
// crypto.randomUUID() only exists in secure contexts (https or localhost),
// so there is a simple fallback for other cases.
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Today's date in the user's own time zone, as "YYYY-MM-DD"
// (the same format <input type="date"> uses).
export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Turns "2024-05-03" into a readable date like "3 May 2024" (format depends on the browser's language).
// We build the date from its parts so it is never shifted by a time zone.
export function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Creates an element, optionally with a CSS class and text.
// Text is set with textContent, so anything the user typed is shown as plain
// text and never interpreted as HTML. Use this for all user-provided text.
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}