const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwZjwEgFogdELrtcRiKd4bI6ilz_opyzT4qaVAvIyVNS4YG26NU6tHACj62BtulHc3L/exec';

export async function syncToSheet(thought) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thought),
    });
  } catch (err) {
    // Silently fail — never interrupt the app for a backup
    console.warn('Sheet sync failed:', err);
  }
}