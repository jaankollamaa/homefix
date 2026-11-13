// Checks form input before it is saved.
// Only the name is required. Everything else may be left empty.

import { getTodayString } from './utils.js';

const MAX_LENGTH = { name: 60, category: 40, brand: 60, model: 60 };
const EARLIEST_PURCHASE_DATE = '1900-01-01';
const OPTIONAL_TEXT_LABELS = { category: 'Category', brand: 'Brand', model: 'Model' };

// "2024-02-30" has the right shape but is not a real date, so we check both.
function isRealDate(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Returns { isValid, errors, values }.
// "values" holds the cleaned-up (trimmed) input, ready to be saved.
export function validateAppliance(input) {
  const values = {
    name: input.name.trim(),
    category: input.category.trim(),
    brand: input.brand.trim(),
    model: input.model.trim(),
    purchaseDate: input.purchaseDate.trim(),
  };

  const errors = {};

  if (values.name === '') {
    errors.name = 'Please give the appliance a name.';
  } else if (values.name.length > MAX_LENGTH.name) {
    errors.name = `The name must be ${MAX_LENGTH.name} characters or fewer.`;
  }

  for (const field of Object.keys(OPTIONAL_TEXT_LABELS)) {
    if (values[field].length > MAX_LENGTH[field]) {
      errors[field] = `${OPTIONAL_TEXT_LABELS[field]} must be ${MAX_LENGTH[field]} characters or fewer.`;
    }
  }

  if (values.purchaseDate !== '') {
    if (!isRealDate(values.purchaseDate)) {
      errors.purchaseDate = 'Please enter a valid date.';
    } else if (values.purchaseDate > getTodayString()) {
      // "YYYY-MM-DD" strings compare correctly as plain text.
      errors.purchaseDate = 'The purchase date cannot be in the future.';
    } else if (values.purchaseDate < EARLIEST_PURCHASE_DATE) {
      errors.purchaseDate = 'That date looks too far in the past.';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors, values };
}