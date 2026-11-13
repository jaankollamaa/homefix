import { CATEGORIES, OTHER_CATEGORY_VALUE } from '../constants.js';
import {
  getAppliances,
  addAppliance,
  updateAppliance,
  deleteAppliance,
} from '../store.js';
import { validateAppliance } from '../validation.js';
import { el, formatDate, getTodayString } from '../utils.js';

// ---------- View state ----------
let pageContainer = null;
let editingId = null; // id of the appliance being edited, or null when adding a new one
let formOpen = false;
let message = null; // { type: 'success' | 'error', text } shown above the list

// Maps validation error names to form field ids.
const FIELD_IDS = {
  name: 'appliance-name',
  category: 'appliance-category',
  brand: 'appliance-brand',
  model: 'appliance-model',
  purchaseDate: 'appliance-purchase-date',
};

export function render(container) {
  pageContainer = container;
  editingId = null;
  formOpen = false;
  message = null;
  draw();
}

// Rebuilds the whole page from the current data and state.
function draw() {
  const parts = [buildHeader()];
  if (message) parts.push(buildMessage());
  if (formOpen) parts.push(buildForm());
  parts.push(buildList());
  pageContainer.replaceChildren(...parts);
}

function focusElement(selector) {
  const node = pageContainer.querySelector(selector);
  if (node) node.focus();
}

function openForm(id = null) {
  editingId = id;
  formOpen = true;
  message = null;
  draw();
  focusElement('#appliance-name');
}

function closeForm() {
  editingId = null;
  formOpen = false;
  draw();
  focusElement('#add-appliance-button');
}

// ---------- Header and messages ----------

function buildHeader() {
  const header = el('header', 'page-header page-header-row');

  const titleBlock = el('div');
  titleBlock.append(
    el('h1', '', 'My Appliances'),
    el('p', 'page-subtitle', 'Everything you own, in one place.')
  );

  const addButton = el('button', 'btn btn-primary', 'Add appliance');
  addButton.type = 'button';
  addButton.id = 'add-appliance-button';
  addButton.addEventListener('click', () => openForm());

  header.append(titleBlock, addButton);
  return header;
}

function buildMessage() {
  const box = el('div', `message message-${message.type}`, message.text);
  box.setAttribute('role', message.type === 'error' ? 'alert' : 'status');
  return box;
}

// ---------- Form ----------

// A label, an input and a hidden error line, grouped together.
// "extra" is an optional second control placed under the input.
function createField(id, labelText, input, extra) {
  input.id = id;

  const wrapper = el('div', 'field');
  const label = el('label', '', labelText);
  label.htmlFor = id;

  const error = el('p', 'field-error');
  error.id = `${id}-error`;
  error.hidden = true;
  input.setAttribute('aria-describedby', error.id);

  wrapper.append(label, input);
  if (extra) wrapper.append(extra);
  wrapper.append(error);
  return wrapper;
}

function createTextInput(value, maxLength) {
  const input = el('input');
  input.type = 'text';
  input.value = value ?? '';
  input.maxLength = maxLength;
  return input;
}

function buildCategorySelect() {
  const select = el('select');
  select.append(new Option('Select a category (optional)', ''));
  CATEGORIES.forEach((category) => select.append(new Option(category, category)));
  select.append(new Option('Other (type your own)', OTHER_CATEGORY_VALUE));
  return select;
}

// The category is the dropdown value, or the typed text when "Other" is chosen.
function readCategory(select, customInput) {
  if (select.value !== OTHER_CATEGORY_VALUE) return select.value;
  return customInput.value.trim() || 'Other';
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach((error) => {
    error.hidden = true;
    error.textContent = '';
  });
  form.querySelectorAll('[aria-invalid]').forEach((input) => {
    input.removeAttribute('aria-invalid');
  });
}

function showErrors(form, errors) {
  let firstInvalid = null;

  for (const [field, text] of Object.entries(errors)) {
    const input = form.querySelector(`#${FIELD_IDS[field]}`);
    const error = form.querySelector(`#${FIELD_IDS[field]}-error`);

    error.textContent = text;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');

    if (!firstInvalid) firstInvalid = input;
  }

  if (firstInvalid) firstInvalid.focus();
}

function buildForm() {
  // When adding, editingId is null and nothing matches, so "existing" is null.
  const existing = getAppliances().find((a) => a.id === editingId) ?? null;

  const form = el('form', 'card form-card');
  form.noValidate = true; // we show our own, clearer error messages
  form.setAttribute('aria-labelledby', 'form-title');

  const title = el('h2', '', existing ? 'Edit appliance' : 'Add appliance');
  title.id = 'form-title';

  // Inputs
  const nameInput = createTextInput(existing?.name, 60);
  const brandInput = createTextInput(existing?.brand, 60);
  const modelInput = createTextInput(existing?.model, 60);

  const dateInput = el('input');
  dateInput.type = 'date';
  dateInput.value = existing?.purchaseDate ?? '';
  dateInput.max = getTodayString();

  // Category: dropdown plus a text box that appears for "Other"
  const categorySelect = buildCategorySelect();
  const customInput = createTextInput('', 40);
  customInput.id = 'appliance-category-custom';
  customInput.placeholder = 'e.g. Vinyl player';
  customInput.setAttribute('aria-label', 'Custom category');

  const savedCategory = existing?.category ?? '';
  if (savedCategory === '' || CATEGORIES.includes(savedCategory)) {
    categorySelect.value = savedCategory;
  } else {
    categorySelect.value = OTHER_CATEGORY_VALUE;
    customInput.value = savedCategory === 'Other' ? '' : savedCategory;
  }

  const syncCustomVisibility = () => {
    customInput.hidden = categorySelect.value !== OTHER_CATEGORY_VALUE;
  };
  categorySelect.addEventListener('change', () => {
    syncCustomVisibility();
    if (!customInput.hidden) customInput.focus();
  });
  syncCustomVisibility();

  // Layout
  const grid = el('div', 'form-grid');
  grid.append(
    createField('appliance-name', 'Name *', nameInput),
    createField('appliance-category', 'Category', categorySelect, customInput),
    createField('appliance-brand', 'Brand', brandInput),
    createField('appliance-model', 'Model', modelInput),
    createField('appliance-purchase-date', 'Purchase date', dateInput)
  );

  const hint = el('p', 'form-hint', '* required. Everything else is optional.');

  const formError = el('p', 'message message-error');
  formError.setAttribute('role', 'alert');
  formError.hidden = true;

  const actions = el('div', 'form-actions');
  const saveButton = el(
    'button',
    'btn btn-primary',
    existing ? 'Save changes' : 'Save appliance'
  );
  saveButton.type = 'submit';
  const cancelButton = el('button', 'btn btn-secondary', 'Cancel');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', closeForm);
  actions.append(saveButton, cancelButton);

  form.append(title, grid, hint, formError, actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    clearErrors(form);
    formError.hidden = true;

    const result = validateAppliance({
      name: nameInput.value,
      category: readCategory(categorySelect, customInput),
      brand: brandInput.value,
      model: modelInput.value,
      purchaseDate: dateInput.value,
    });

    if (!result.isValid) {
      showErrors(form, result.errors);
      return;
    }

    try {
      if (existing) {
        updateAppliance(existing.id, result.values);
        message = { type: 'success', text: `Updated “${result.values.name}”.` };
      } else {
        addAppliance(result.values);
        message = { type: 'success', text: `Added “${result.values.name}”.` };
      }
    } catch (error) {
      // Keep the form open (and the typed input) so nothing is lost.
      formError.textContent = error.message;
      formError.hidden = false;
      return;
    }

    editingId = null;
    formOpen = false;
    draw();
    focusElement('#add-appliance-button');
  });

  return form;
}

// ---------- Appliance list ----------

function buildList() {
  const appliances = [...getAppliances()].sort((a, b) => a.name.localeCompare(b.name));

  if (appliances.length === 0) {
    const card = el('section', 'card');
    card.append(
      el(
        'p',
        'empty-state',
        'No appliances registered yet. Choose “Add appliance” to register your first one.'
      )
    );
    return card;
  }

  const grid = el('section', 'appliance-grid');
  grid.setAttribute('aria-label', 'Registered appliances');
  appliances.forEach((appliance) => grid.append(buildCard(appliance)));
  return grid;
}

function buildCard(appliance) {
  const card = el('article', 'appliance-card');

  card.append(el('h2', 'appliance-name', appliance.name));
  if (appliance.category) {
    card.append(el('span', 'badge', appliance.category));
  }

  // Only show details that were actually filled in.
  const details = [
    { label: 'Brand', value: appliance.brand },
    { label: 'Model', value: appliance.model },
    {
      label: 'Purchased',
      value: appliance.purchaseDate ? formatDate(appliance.purchaseDate) : '',
    },
  ].filter((detail) => detail.value);

  if (details.length === 0) {
    card.append(el('p', 'empty-state', 'No further details.'));
  } else {
    const list = el('dl', 'details');
    details.forEach((detail) => {
      list.append(el('dt', '', detail.label), el('dd', '', detail.value));
    });
    card.append(list);
  }

  const actions = el('div', 'card-actions');

  const editButton = el('button', 'btn btn-secondary', 'Edit');
  editButton.type = 'button';
  editButton.setAttribute('aria-label', `Edit ${appliance.name}`);
  editButton.addEventListener('click', () => openForm(appliance.id));

  const deleteButton = el('button', 'btn btn-outline-danger', 'Delete');
  deleteButton.type = 'button';
  deleteButton.setAttribute('aria-label', `Delete ${appliance.name}`);
  deleteButton.addEventListener('click', () => openDeleteDialog(appliance));

  actions.append(editButton, deleteButton);
  card.append(actions);
  return card;
}

// ---------- Delete confirmation ----------

function openDeleteDialog(appliance) {
  const dialog = el('dialog', 'confirm-dialog');
  dialog.setAttribute('aria-labelledby', 'delete-title');

  const title = el('h2', '', 'Have you got rid of this appliance?');
  title.id = 'delete-title';

  const name = el('p', 'confirm-name', appliance.name);
  const text = el(
    'p',
    '',
    'Only delete it once it is gone. This also permanently removes all of its maintenance tasks and repair history, and it can’t be undone.'
  );

  // "No, keep it" comes first, so it is the button focused by default.
  const keepButton = el('button', 'btn btn-secondary', 'No, keep it');
  keepButton.type = 'button';
  keepButton.addEventListener('click', () => dialog.close());

  const deleteButton = el('button', 'btn btn-danger', 'Yes, delete it');
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => {
    dialog.close();

    try {
      deleteAppliance(appliance.id);
      message = { type: 'success', text: `Deleted “${appliance.name}”.` };
      if (editingId === appliance.id) {
        editingId = null;
        formOpen = false;
      }
    } catch (error) {
      message = { type: 'error', text: error.message };
    }

    draw();
    focusElement('#add-appliance-button');
  });

  const actions = el('div', 'form-actions');
  actions.append(keepButton, deleteButton);

  dialog.append(title, name, text, actions);
  dialog.addEventListener('close', () => dialog.remove());

  pageContainer.append(dialog);
  dialog.showModal();
}