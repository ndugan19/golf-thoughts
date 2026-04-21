import { supabase } from './supabase';

export async function loadThoughts() {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error loading thoughts:', error);
    return [];
  }
  return data || [];
}

export async function addThoughtToDB(thought) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('thoughts')
    .insert({
      id: thought.id,
      user_id: user.id,
      text: thought.text,
      categories: thought.categories,
      starred: thought.starred,
      note: thought.note,
      timestamp: thought.timestamp,
      date: thought.date || '',
      course: thought.course || '',
      longitude: thought.longitude || null,
      latitude: thought.latitude || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding thought:', error);
    return null;
  }
  return data;
}

export async function updateThoughtInDB(id, updates) {
  const { error } = await supabase
    .from('thoughts')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating thought:', error);
  }
}

export async function deleteThoughtFromDB(id) {
  const { error } = await supabase
    .from('thoughts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting thought:', error);
  }
}

export async function importThoughtsToDB(thoughts) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('thoughts')
    .delete()
    .eq('user_id', user.id);

  const toInsert = thoughts.map(t => ({
    id: t.id,
    user_id: user.id,
    text: t.text,
    categories: t.categories,
    starred: t.starred,
    note: t.note || '',
    timestamp: t.timestamp,
  }));

  const { error } = await supabase
    .from('thoughts')
    .insert(toInsert);

  if (error) {
    console.error('Error importing thoughts:', error);
  }
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

export function importJSONFile(file, onSuccess) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) onSuccess(imported);
    } catch {}
  };
  reader.readAsText(file);
}

