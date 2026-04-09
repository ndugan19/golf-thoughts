import { STORAGE_KEY } from './constants';

export function loadThoughts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveThoughts(thoughts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  } catch {}
}

export function exportJSON(thoughts) {
  const blob = new Blob(
    [JSON.stringify(thoughts, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `golf-thoughts-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file, onSuccess) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        onSuccess(imported);
      }
    } catch {}
  };
  reader.readAsText(file);
}