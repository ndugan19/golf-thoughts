import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import { geocodeCourse } from './geocoding';
import Masthead from './components/Masthead';
import Auth from './components/Auth';
import FrontPage from './pages/FrontPage';
import Catalog from './pages/Catalog';
import Compose from './pages/Compose';
import CourseMap from './pages/CourseMap';
import BirthdayBanner from './components/BirthdayBanner';
import {
  loadThoughts,
  addThoughtToDB,
  updateThoughtInDB,
  deleteThoughtFromDB,
  importThoughtsToDB,
} from './storage';

export default function App() {
  const [session, setSession]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [thoughts, setThoughts]           = useState([]);
  const [view, setView]                   = useState('frontpage');
  const [justAddedId, setJustAddedId]     = useState(null);
  const [randomThought, setRandomThought] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchThoughts = useCallback(async () => {
    const data = await loadThoughts();
    console.log('Loaded thoughts:', data);
    setThoughts(data);
  }, []);

  useEffect(() => {
    if (session) {
      fetchThoughts();
    } else {
      setThoughts([]);
    }
  }, [session, fetchThoughts]);

  const starred = thoughts.filter(t => t.starred);

  async function addThought(text, categories, date, course) {
    let longitude = null;
    let latitude  = null;

    if (course && course.trim()) {
      const coords = await geocodeCourse(course);
      console.log('Geocoding result:', coords);
      if (coords) {
        longitude = coords.longitude;
        latitude  = coords.latitude;
      }
    }

    const newThought = {
      id: uuidv4(),
      text,
      categories,
      timestamp: Date.now(),
      date: date || new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      course:    course || '',
      longitude,
      latitude,
      starred:   false,
      note:      '',
    };

    console.log('Saving thought with coords:', newThought.longitude, newThought.latitude);

    setThoughts(prev => [newThought, ...prev]);
    setJustAddedId(newThought.id);
    setTimeout(() => setJustAddedId(null), 2000);
    setView('catalog');
    await addThoughtToDB(newThought);
  }

  async function toggleStar(id) {
    const thought = thoughts.find(t => t.id === id);
    if (!thought) return;
    if (!thought.starred && starred.length >= 3) return;
    const newStarred = !thought.starred;
    setThoughts(prev =>
      prev.map(t => t.id === id ? { ...t, starred: newStarred } : t)
    );
    await updateThoughtInDB(id, { starred: newStarred });
  }

  async function deleteThought(id) {
    setThoughts(prev => prev.filter(t => t.id !== id));
    await deleteThoughtFromDB(id);
  }

  async function saveNote(id, note) {
    setThoughts(prev =>
      prev.map(t => t.id === id ? { ...t, note } : t)
    );
    await updateThoughtInDB(id, { note });
  }

  function shuffleRandom() {
    const pool = thoughts.filter(t => !t.starred);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setRandomThought(pick);
  }

  async function handleImport(imported) {
    await importThoughtsToDB(imported);
    await fetchThoughts();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setView('frontpage');
    setRandomThought(null);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F5ECD7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia',
        fontStyle: 'italic',
        color: '#8b7355',
        fontSize: 16,
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <BirthdayBanner />
      <Masthead
        currentView={view}
        onViewChange={setView}
        userEmail={session.user.email}
        onSignOut={handleSignOut}
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

      {view === 'map' && (
        <CourseMap thoughts={thoughts} />
      )}
    </div>
  );
}