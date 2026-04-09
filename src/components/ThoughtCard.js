import React from 'react';
import CategoryBadge from './CategoryBadge';
import { formatDateShort } from '../utils';

export default function ThoughtCard({
  thought,
  canStar,
  onToggleStar,
  onDelete,
  onOpenNote,
  isHighlighted,
}) {
  return (
    <div style={{
      borderBottom: '1px solid #d4c49a',
      padding: '18px 0',
      background: isHighlighted ? '#e8dbb8' : 'transparent',
      transition: 'background 0.4s',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* Star */}
        <button
          onClick={() => onToggleStar(thought.id)}
          disabled={!thought.starred && !canStar}
          title={thought.starred ? 'Unstar' : !canStar ? '3 starred (max)' : 'Star'}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: thought.starred ? '#c8860a' : '#d4c49a',
            padding: '2px 0',
            lineHeight: 1,
            flexShrink: 0,
            opacity: !canStar && !thought.starred ? 0.35 : 1,
            transition: 'color 0.15s',
          }}
        >
          ★
        </button>

        <div style={{ flex: 1 }}>
          {/* Thought text */}
          <p style={{
            margin: '0 0 8px',
            fontSize: 16,
            lineHeight: 1.7,
            fontStyle: 'italic',
            fontFamily: 'Georgia',
          }}>
            {thought.text}
          </p>

          {/* Note */}
          {thought.note && (
            <p style={{
              margin: '0 0 8px',
              fontSize: 13,
              color: '#6b5a3a',
              lineHeight: 1.6,
              fontFamily: 'Georgia',
              fontStyle: 'italic',
              borderLeft: '2px solid #d4c49a',
              paddingLeft: 10,
            }}>
              {thought.note}
            </p>
          )}

          {/* Meta row */}
          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {thought.categories.map(cat => (
              <CategoryBadge key={cat} category={cat} />
            ))}
            <span style={{
              fontSize: 10,
              color: '#a89878',
              fontFamily: 'Georgia',
            }}>
              {formatDateShort(thought.timestamp)}
            </span>
            <button
              onClick={() => onOpenNote(thought)}
              style={{
                fontSize: 10,
                color: '#8b7355',
                background: 'none',
                border: 'none',
                fontFamily: 'Georgia',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              }}
            >
              {thought.note ? 'Edit note' : 'Add note'}
            </button>
            <button
              onClick={() => onDelete(thought.id)}
              style={{
                fontSize: 10,
                color: '#c87a7a',
                background: 'none',
                border: 'none',
                fontFamily: 'Georgia',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}