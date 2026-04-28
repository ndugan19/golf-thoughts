import React, { useState, useEffect } from 'react';

export default function NoteModal({ thought, onSave, onClose }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(thought?.note || '');
  }, [thought]);

  if (!thought) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,18,8,0.5)',
      display: 'flex',
      alignItems: 'flex-start',        // changed: avoids keyboard push
      justifyContent: 'center',
      zIndex: 1000,
      padding: '60px 16px 24px',       // changed: more top room, less side padding
      overflowY: 'auto',               // added: scroll if keyboard shrinks space
    }}>
      <div style={{
        background: '#ede3c8',
        border: '1px solid #c8b88a',
        padding: 28,
        width: '100%',
        maxWidth: 480,
        boxSizing: 'border-box',       // added
      }}>
        <p style={{
          fontSize: 15,
          fontStyle: 'italic',
          fontFamily: 'Geist Mono',
          marginBottom: 16,
          lineHeight: 1.6,
          color: '#1a1208',
        }}>
          "{thought.text}"
        </p>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={4}
          placeholder="Add a note or elaboration..."
          style={{
            width: '100%',
            boxSizing: 'border-box',   // added: prevents overflow on mobile
            background: '#f5ead8',
            border: '1px solid #c8b88a',
            padding: '10px 12px',
            fontSize: 14,
            fontFamily: 'Geist Mono',
            fontStyle: 'italic',
            color: '#1a1208',
            outline: 'none',
            resize: 'vertical',
            lineHeight: 1.6,
          }}
        />

        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 14,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',    // changed: taller tap target
              background: 'none',
              border: '1px solid #c8b88a',
              color: '#8b7355',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(thought.id, note)}
            style={{
              padding: '10px 18px',    // changed: taller tap target
              background: '#1a1208',
              border: 'none',
              color: '#f2ead8',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: 'pointer',
            }}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}