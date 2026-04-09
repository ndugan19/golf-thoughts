import React, { useState, useRef } from 'react';
import { CATEGORIES, CAT_COLORS, CAT_BG } from '../constants';
import { exportJSON, importJSON } from '../storage';

export default function Compose({ thoughts, onAddThought, onImport }) {
  const [input, setInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function toggleCategory(cat) {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  }

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please write a thought first.');
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    setError('');
    onAddThought(trimmed, selectedCategories);
    setInput('');
    setSelectedCategories([]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={{
      padding: '28px 24px',
      maxWidth: 680,
      margin: '0 auto',
    }}>

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
          fontFamily: 'Georgia',
        }}>
          Log a Thought
        </div>
      </div>

      {/* Text input */}
      <textarea
        value={input}
        onChange={e => {
          setInput(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyDown}
        rows={5}
        placeholder="Write your golf thought here..."
        style={{
          width: '100%',
          background: '#ede3c8',
          border: '1px solid #c8b88a',
          padding: '16px 18px',
          fontSize: 16,
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          color: '#1a1208',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.7,
        }}
      />

      {/* Category selector */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: '#8b7355',
          textTransform: 'uppercase',
          fontFamily: 'Georgia',
          marginBottom: 10,
        }}>
          Select Categories
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {CATEGORIES.map(cat => {
            const selected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: '6px 14px',
                  background: selected ? CAT_COLORS[cat] : CAT_BG[cat],
                  border: `1px solid ${CAT_COLORS[cat]}`,
                  color: selected ? '#f5ead8' : CAT_COLORS[cat],
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Georgia',
                  transition: 'all 0.15s',
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
          fontFamily: 'Georgia',
          fontStyle: 'italic',
        }}>
          {selectedCategories.length === 0
            ? 'No categories selected'
            : `Selected: ${selectedCategories.join(', ')}`}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#f5e4e4',
          borderLeft: '3px solid #c87a7a',
          fontSize: 13,
          fontFamily: 'Georgia',
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
        marginTop: 16,
      }}>
        <div style={{
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Georgia',
        }}>
          Enter to submit · Shift+Enter for new line
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 28px',
            background: '#1a1208',
            border: 'none',
            color: '#f2ead8',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'Georgia',
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
          fontFamily: 'Georgia',
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
          fontFamily: 'Georgia',
          marginBottom: 12,
        }}>
          Backup
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => exportJSON(thoughts)}
            style={{
              padding: '8px 20px',
              background: 'none',
              border: '1px solid #8b7355',
              color: '#6b5a3a',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Georgia',
            }}
          >
            Export Backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '8px 20px',
              background: 'none',
              border: '1px solid #8b7355',
              color: '#6b5a3a',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Georgia',
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
              if (file) importJSON(file, onImport);
              e.target.value = '';
            }}
          />
        </div>
        <div style={{
          marginTop: 10,
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          Export regularly to back up your catalog. Import restores a previous
          backup including dates and starred thoughts.
        </div>
      </div>
    </div>
  );
}