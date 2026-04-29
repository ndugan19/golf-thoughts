import React, { useState, useEffect } from 'react';
import { CATEGORIES, CAT_COLORS, CAT_BG } from '../constants';

export default function EditModal({ thought, onSave, onClose }) {
  const [text, setText]             = useState('');
  const [course, setCourse]         = useState('');
  const [date, setDate]             = useState('');
  const [score, setScore]           = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!thought) return;
    setText(thought.text || '');
    setCourse(thought.course || '');
    setDate(thought.date || '');
    setScore(thought.score ?? '');
    setCategories(thought.categories || []);
  }, [thought]);

  if (!thought) return null;

  function toggleCategory(cat) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  function handleSave() {
    if (!text.trim()) return;
    if (categories.length === 0) return;
    onSave(thought.id, {
      text: text.trim(),
      course,
      date,
      score: score === '' ? null : Number(score),
      categories,
    });
  }

  const labelStyle = {
    display: 'block',
    fontSize: 9,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#8b7355',
    fontFamily: 'Geist Mono',
    marginBottom: 6,
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#f5ead8',
    border: '1px solid #c8b88a',
    padding: '10px 12px',
    fontSize: 13,
    fontFamily: 'Geist Mono',
    color: '#1a1208',
    outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26,18,8,0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '60px 16px 24px',
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#ede3c8',
        border: '1px solid #c8b88a',
        padding: 28,
        width: '100%',
        maxWidth: 480,
        boxSizing: 'border-box',
      }}>

        {/* Title */}
        <div style={{
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontFamily: 'Geist Mono',
          color: '#8b7355',
          marginBottom: 20,
        }}>
          Edit Thought
        </div>

        {/* Text */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Thought</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            style={{
              ...inputStyle,
              fontStyle: 'italic',
              resize: 'vertical',
              lineHeight: 1.7,
              padding: '10px 12px',
            }}
          />
        </div>

        {/* Date + Course row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 120px', minWidth: 0 }}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: '2 1 180px', minWidth: 0 }}>
            <label style={labelStyle}>Course</label>
            <input
              type="text"
              value={course}
              onChange={e => setCourse(e.target.value)}
              placeholder="e.g. Mastick Woods"
              style={{ ...inputStyle, fontStyle: 'italic' }}
            />
          </div>
        </div>

        {/* Score */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Score (optional)</label>
          <input
            type="number"
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="e.g. 82"
            min={40}
            max={200}
            style={{ ...inputStyle, width: 120 }}
          />
        </div>

        {/* Categories */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Categories</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => {
              const selected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  style={{
                    padding: '7px 13px',
                    background: selected ? CAT_COLORS[cat] : CAT_BG[cat],
                    border: `1px solid ${CAT_COLORS[cat]}`,
                    color: selected ? '#f5ead8' : CAT_COLORS[cat],
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: 'Geist Mono',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
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
            onClick={handleSave}
            style={{
              padding: '10px 18px',
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}