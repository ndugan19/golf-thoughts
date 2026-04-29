import React, { useState, useRef } from 'react';
import { CATEGORIES, CAT_COLORS, CAT_BG } from '../constants';
import { exportJSON, importJSONFile } from '../storage';

export default function Compose({ thoughts, onAddThought, onImport }) {
  const [input, setInput]                           = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [date, setDate]                             = useState('');
  const [course, setCourse]                         = useState('');
  const [score, setScore]                           = useState('');
  const [justAdded, setJustAdded]                   = useState(false);
  const [error, setError]                           = useState('');
  const fileRef                                     = useRef(null);

  function toggleCategory(cat) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) { setError('Please write a thought first.'); return; }
    if (selectedCategories.length === 0) { setError('Please select at least one category.'); return; }
    setError('');
    onAddThought(trimmed, selectedCategories, date, course, score === '' ? null : Number(score));
    setInput('');
    setSelectedCategories([]);
    setDate('');
    setCourse('');
    setScore('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleExportCSV() {
    if (thoughts.length === 0) return;
    const headers = ['Date', 'Course', 'Score', 'Thought', 'Categories', 'Note'];
    const rows = thoughts.map(t => {
      const d = new Date(t.timestamp).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });
      return [
        `"${t.date || d}"`,
        `"${(t.course || '').replace(/"/g, '""')}"`,
        `"${t.score ?? ''}"`,
        `"${t.text.replace(/"/g, '""')}"`,
        `"${t.categories.join(', ')}"`,
        `"${(t.note || '').replace(/"/g, '""')}"`,
      ].join(',');
    });
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `golf-thoughts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    background: '#ede3c8',
    border: '1px solid #c8b88a',
    padding: '10px 12px',
    fontSize: 13,
    fontFamily: 'Geist Mono',
    color: '#1a1208',
    outline: 'none',
  };

  return (
    <div style={{ padding: '28px 16px', maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        borderBottom: '2px solid #1a1208',
        marginBottom: 24,
        paddingBottom: 8,
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontFamily: 'Geist Mono',
        }}>
          Log a Thought
        </div>
      </div>

      {/* Date, Course, Score row */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 110px', minWidth: 0 }}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: '2 1 180px', minWidth: 0 }}>
          <label style={labelStyle}>Course (optional)</label>
          <input
            type="text"
            value={course}
            onChange={e => setCourse(e.target.value)}
            placeholder="e.g. Mastick Woods"
            style={{ ...inputStyle, fontStyle: 'italic' }}
          />
        </div>
        <div style={{ flex: '1 1 80px', minWidth: 0 }}>
          <label style={labelStyle}>Score (optional)</label>
          <input
            type="number"
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="e.g. 82"
            min={40}
            max={200}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Thought textarea */}
      <textarea
        value={input}
        onChange={e => { setInput(e.target.value); setError(''); }}
        onKeyDown={handleKeyDown}
        rows={5}
        placeholder="Write your golf thought here..."
        style={{
          ...inputStyle,
          fontSize: 16,
          fontStyle: 'italic',
          resize: 'vertical',
          lineHeight: 1.7,
          padding: '16px 18px',
        }}
      />

      {/* Category selector */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          color: '#8b7355',
          textTransform: 'uppercase',
          fontFamily: 'Geist Mono',
          marginBottom: 10,
        }}>
          Select Categories
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map(cat => {
            const selected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: '8px 14px',
                  background: selected ? CAT_COLORS[cat] : CAT_BG[cat],
                  border: `1px solid ${CAT_COLORS[cat]}`,
                  color: selected ? '#f5ead8' : CAT_COLORS[cat],
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Geist Mono',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Geist Mono',
          fontStyle: 'italic',
        }}>
          {selectedCategories.length === 0
            ? 'No categories selected'
            : `Selected: ${selectedCategories.join(', ')}`}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#f5e4e4',
          borderLeft: '3px solid #c87a7a',
          fontSize: 13,
          fontFamily: 'Geist Mono',
          color: '#c87a7a',
          fontStyle: 'italic',
        }}>
          {error}
        </div>
      )}

      {/* Submit row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
      }}>
        <div style={{
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Geist Mono',
        }}>
          Enter to submit · Shift+Enter for new line
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 28px',
            background: '#1a1208',
            border: 'none',
            color: '#f2ead8',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'Geist Mono',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Submit →
        </button>
      </div>

      {/* Success */}
      {justAdded && (
        <div style={{
          marginTop: 20,
          padding: '14px 18px',
          background: '#e8dbb8',
          borderLeft: '3px solid #2F5233',
          fontSize: 13,
          fontFamily: 'Geist Mono',
          color: '#2F5233',
          fontStyle: 'italic',
        }}>
          Thought logged successfully.
        </div>
      )}

      {/* Export / Import */}
      <div style={{
        marginTop: 40,
        paddingTop: 20,
        borderTop: '1px solid #d4c49a',
      }}>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: '#8b7355',
          textTransform: 'uppercase',
          fontFamily: 'Geist Mono',
          marginBottom: 12,
        }}>
          Export & Backup
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            style={{
              padding: '10px 20px',
              background: '#1a1208',
              border: 'none',
              color: '#f2ead8',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: 'pointer',
            }}
          >
            Download CSV ↓
          </button>
          <button
            onClick={() => exportJSON(thoughts)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: '1px solid #8b7355',
              color: '#6b5a3a',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: 'pointer',
            }}
          >
            Export Backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: '1px solid #8b7355',
              color: '#6b5a3a',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: 'pointer',
            }}
          >
            Import Backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) importJSONFile(file, onImport);
              e.target.value = '';
            }}
          />
        </div>
        <div style={{
          marginTop: 10,
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Geist Mono',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          Download CSV opens in Excel or Google Sheets with all your thoughts,
          categories, courses and notes. Export Backup saves a JSON file you
          can restore later.
        </div>
      </div>
    </div>
  );
}