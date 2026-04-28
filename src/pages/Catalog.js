import React, { useState } from 'react';
import { CATEGORIES, CAT_COLORS } from '../constants';
import ThoughtCard from '../components/ThoughtCard';
import NoteModal from '../components/NoteModal';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Catalog({
  thoughts,
  justAddedId,
  onToggleStar,
  onDelete,
  onSaveNote,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]                 = useState('');
  const [noteThought, setNoteThought]       = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const { isMobile }                        = useWindowSize();

  const starred  = thoughts.filter(t => t.starred);

  const filtered = thoughts.filter(t => {
    const matchCat =
      activeCategory === 'All' || t.categories.includes(activeCategory);
    const matchSearch =
      !search || t.text.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleSaveNote(id, note) {
    onSaveNote(id, note);
    setNoteThought(null);
  }

  const SidebarContent = () => (
    <>
      <div style={{
        fontSize: 9,
        letterSpacing: '0.2em',
        color: '#8b7355',
        textTransform: 'uppercase',
        padding: '0 20px 10px',
        fontFamily: 'Geist Mono',
      }}>
        Filter
      </div>

      {['All', ...CATEGORIES].map(cat => {
        const count = cat === 'All'
          ? thoughts.length
          : thoughts.filter(t => t.categories.includes(cat)).length;
        const active      = activeCategory === cat;
        const borderColor = cat === 'All' ? '#1a1208' : CAT_COLORS[cat];

        return (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              padding: '9px 20px',
              background: active ? '#e8dbb8' : 'transparent',
              border: 'none',
              borderLeft: active
                ? `3px solid ${borderColor}`
                : '3px solid transparent',
              color: active ? '#1a1208' : '#8b7355',
              fontSize: 13,
              fontFamily: 'Geist Mono',
              fontStyle: active ? 'italic' : 'normal',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span>{cat}</span>
            <span style={{ fontSize: 10, color: '#a89878', fontFamily: 'Geist Mono' }}>
              {count || ''}
            </span>
          </button>
        );
      })}

      {/* Search */}
      <div style={{
        padding: '20px 20px 8px',
        marginTop: 8,
        borderTop: '1px solid #d4c49a',
      }}>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          color: '#8b7355',
          textTransform: 'uppercase',
          fontFamily: 'Geist Mono',
          marginBottom: 8,
        }}>
          Search
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Keyword..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#f2ead8',
            border: '1px solid #c8b88a',
            padding: '6px 8px',
            fontSize: 12,
            fontFamily: 'Geist Mono',
            color: '#1a1208',
            outline: 'none',
          }}
        />
      </div>

      {/* Starred count */}
      <div style={{
        padding: '16px 20px 0',
        fontSize: 10,
        color: '#a89878',
        fontFamily: 'Geist Mono',
        fontStyle: 'italic',
      }}>
        ★ {starred.length}/3 starred
      </div>
    </>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>

      {/* Mobile filter bar — only on mobile */}
      {isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: '#ede3c8',
          borderBottom: '1px solid #d4c49a',
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none',
              border: '1px solid #c8b88a',
              padding: '5px 10px',
              fontFamily: 'Geist Mono',
              fontSize: 12,
              color: '#8b7355',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ☰ Filter
          </button>

          <span style={{
            fontSize: 11,
            fontFamily: 'Geist Mono',
            color: '#1a1208',
            fontStyle: 'italic',
          }}>
            {activeCategory}
          </span>

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              flex: 1,
              background: '#f2ead8',
              border: '1px solid #c8b88a',
              padding: '5px 8px',
              fontSize: 12,
              fontFamily: 'Geist Mono',
              color: '#1a1208',
              outline: 'none',
              minWidth: 0,
            }}
          />
        </div>
      )}

      {/* Mobile drawer overlay — only on mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 110,                    // above masthead (100)
          }}
        />
      )}

      {/* Mobile drawer panel — only on mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-260px',
          width: 240,
          height: '100%',
          background: '#ede3c8',
          borderRight: '1px solid #d4c49a',
          paddingTop: 80,                   // clears the masthead height
          paddingBottom: 24,
          zIndex: 120,                      // above overlay
          overflowY: 'auto',
          transition: 'left 0.25s ease',
        }}>
          <SidebarContent />
        </div>
      )}

      {/* Desktop layout — only on desktop */}
      {!isMobile && (
        <div style={{ display: 'flex' }}>
          <div style={{
            width: 190,
            borderRight: '1px solid #d4c49a',
            background: '#ede3c8',
            padding: '24px 0',
            flexShrink: 0,
          }}>
            <SidebarContent />
          </div>

          <div style={{
            flex: 1,
            padding: '24px 32px',
            overflowY: 'auto',
          }}>
            {filtered.length === 0 ? (
              <div style={{
                color: '#a89878',
                fontStyle: 'italic',
                fontSize: 15,
                paddingTop: 40,
                textAlign: 'center',
                fontFamily: 'Geist Mono',
              }}>
                No thoughts found.
              </div>
            ) : (
              filtered.map(t => (
                <ThoughtCard
                  key={t.id}
                  thought={t}
                  isHighlighted={justAddedId === t.id}
                  canStar={starred.length < 3}
                  onToggleStar={onToggleStar}
                  onDelete={onDelete}
                  onOpenNote={setNoteThought}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile thought list — only on mobile */}
      {isMobile && (
        <div style={{
          padding: '16px 16px',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              color: '#a89878',
              fontStyle: 'italic',
              fontSize: 15,
              paddingTop: 40,
              textAlign: 'center',
              fontFamily: 'Geist Mono',
            }}>
              No thoughts found.
            </div>
          ) : (
            filtered.map(t => (
              <ThoughtCard
                key={t.id}
                thought={t}
                isHighlighted={justAddedId === t.id}
                canStar={starred.length < 3}
                onToggleStar={onToggleStar}
                onDelete={onDelete}
                onOpenNote={setNoteThought}
              />
            ))
          )}
        </div>
      )}

      <NoteModal
        thought={noteThought}
        onSave={handleSaveNote}
        onClose={() => setNoteThought(null)}
      />
    </div>
  );
}