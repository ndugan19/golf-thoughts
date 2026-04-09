import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Masthead from './components/Masthead';
import FrontPage from './pages/FrontPage';
import Catalog from './pages/Catalog';
import Compose from './pages/Compose';
import { loadThoughts, saveThoughts } from './storage';

export default function App() {
  const [thoughts, setThoughts]         = useState([]);
  const [view, setView]                 = useState('frontpage');
  const [justAddedId, setJustAddedId]   = useState(null);
  const [randomThought, setRandomThought] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    setThoughts(loadThoughts());
  }, []);

  // Save to localStorage whenever thoughts change
  useEffect(() => {
    if (thoughts.length > 0) saveThoughts(thoughts);
  }, [thoughts]);

  const starred = thoughts.filter(t => t.starred);

  function addThought(text, categories) {
    const newThought = {
      id: uuidv4(),
      text,
      categories,
      timestamp: Date.now(),
      starred: false,
      note: '',
    };
    const updated = [newThought, ...thoughts];
    setThoughts(updated);
    saveThoughts(updated);
    setJustAddedId(newThought.id);
    setTimeout(() => setJustAddedId(null), 2000);
    // Switch to catalog so they can see it was added
    setView('catalog');
  }

  function toggleStar(id) {
    const thought = thoughts.find(t => t.id === id);
    if (!thought) return;
    if (!thought.starred && starred.length >= 3) return;
    const updated = thoughts.map(t =>
      t.id === id ? { ...t, starred: !t.starred } : t
    );
    setThoughts(updated);
    saveThoughts(updated);
  }

  function deleteThought(id) {
    const updated = thoughts.filter(t => t.id !== id);
    setThoughts(updated);
    saveThoughts(updated);
  }

  function saveNote(id, note) {
    const updated = thoughts.map(t =>
      t.id === id ? { ...t, note } : t
    );
    setThoughts(updated);
    saveThoughts(updated);
  }

  function shuffleRandom() {
    const pool = thoughts.filter(t => !t.starred);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setRandomThought(pick);
  }

  function handleImport(imported) {
    setThoughts(imported);
    saveThoughts(imported);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Masthead
        currentView={view}
        onViewChange={setView}
      />

      {view === 'frontpage' && (
        <FrontPage
          thoughts={thoughts}
          randomThought={randomThought}
          onShuffle={shuffleRandom}
          onToggleStar={toggleStar}
          onGoToCatalog={() => setView('catalog')}
        />
      )}

      {view === 'catalog' && (
        <Catalog
          thoughts={thoughts}
          justAddedId={justAddedId}
          onToggleStar={toggleStar}
          onDelete={deleteThought}
          onSaveNote={saveNote}
        />
      )}

      {view === 'compose' && (
        <Compose
          thoughts={thoughts}
          onAddThought={addThought}
          onImport={handleImport}
        />
      )}
    </div>
  );
}