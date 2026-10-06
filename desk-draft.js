/* Keep an unfinished verdict across the two looks, in this browser tab only. */
(function () {
  'use strict';
  var key = 'pizzababy-desk-session-v1';
  var ids = ['f-spot', 'f-kind', 'f-line', 'r-crust', 'r-sauce', 'r-cheese', 'r-vibe'];
  var fields = ids.map(function (id) { return document.getElementById(id); });
  var status = document.getElementById('draft-status');
  if (!status || fields.some(function (field) { return !field; })) return;
  var defaults = fields.map(function (field) { return field.value; });
  var storageOK = true;
  function unavailable() {
    storageOK = false;
    status.textContent = 'Draft storage is unavailable. Download or copy your verdict before leaving this page.';
  }
  function valid(field, value) {
    if (typeof value !== 'string') return false;
    if (field.type === 'range') return /^[1-8]$/.test(value);
    if (field.tagName === 'SELECT') return Array.prototype.some.call(field.options, function (option) { return option.value === value; });
    return value.length <= (field.maxLength > 0 ? field.maxLength : 140);
  }
  try {
    var raw = sessionStorage.getItem(key);
    var saved = null;
    try { saved = JSON.parse(raw || 'null'); } catch (error) { /* Ignore a damaged tab copy; writing still works. */ }
    if (saved && saved.version === 1 && saved.values && fields.every(function (field) { return valid(field, saved.values[field.id]); })) {
      fields.forEach(function (field) { field.value = saved.values[field.id]; });
      fields[0].dispatchEvent(new Event('input', { bubbles: true }));
      status.textContent = 'Draft restored in this tab. Download it to keep it after closing the tab.';
    }
  } catch (error) { unavailable(); }
  function save() {
    if (!storageOK) return;
    var values = {};
    fields.forEach(function (field) { values[field.id] = field.value; });
    try {
      sessionStorage.setItem(key, JSON.stringify({ version: 1, values: values }));
      status.textContent = 'Draft kept in this tab, across both looks. Nothing is published or sent.';
    } catch (error) { unavailable(); }
  }
  fields.forEach(function (field) { field.addEventListener('input', save); });
  document.getElementById('clear-draft').addEventListener('click', function () {
    if (!window.confirm('Clear this draft and reset the critic’s desk? Download your verdict first if you want to keep it.')) return;
    fields.forEach(function (field, index) { field.value = defaults[index]; });
    // Refresh the scorecard before removing the tab copy written by the input event.
    fields[0].dispatchEvent(new Event('input', { bubbles: true }));
    try { sessionStorage.removeItem(key); } catch (error) { unavailable(); }
    if (storageOK) status.textContent = 'Draft cleared. A fresh verdict is yours to write.';
    fields[0].focus();
  });
})();
