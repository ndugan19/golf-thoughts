import React from 'react';
import CategoryBadge from './CategoryBadge';
import { formatDateShort } from '../utils';

export default function ThoughtCard({
  thought,
  canStar,
  onToggleStar,
  onDelete,
  onOpenNote,
  onOpenEdit,
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

        {/* Star button */}
        <button
          onClick={() => onToggleStar(thought.id)}
          disabled={!thought.starred && !canStar}
          title={thought.starred ? 'Unstar' : !canStar ? '3 starred (max)' : 'Star'}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 25,
            color: thought.starred ? '#c8860a' : '#d4c49a',
            padding: '4px 6px',
            lineHeight: 1,
            flexShrink: 0,
            opacity: !canStar && !thought.starred ? 0.35 : 1,
            transition: 'color 0.15s',
            cursor: !canStar && !thought.starred ? 'not-allowed' : 'pointer',
          }}
        >
          &#9733;
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Thought text */}
          <p style={{
            margin: '0 0 8px',
            fontSize: 16,
            lineHeight: 1.7,
            fontStyle: 'italic',
            fontFamily: 'Geist Mono',
            color: '#1a1208',
            wordBreak: 'break-word',
          }}>
            {thought.text}
          </p>

          {/* Course, date, score */}
          {(thought.course || thought.score != null) && (
            <p style={{
              margin: '0 0 6px',
              fontSize: 12,
              color: '#8b7355',
              fontFamily: 'Geist Mono',
              fontStyle: 'italic',
              wordBreak: 'break-word',
            }}>
              {thought.course && <>&#9971; {thought.course}</>}
              {thought.date && (
                <span style={{ color: '#a89878', marginLeft: 8 }}>
                  &middot; {thought.date}
                </span>
              )}
              {thought.score != null && (
                <span style={{ color: '#6b5a3a', marginLeft: 8 }}>
                  &middot; Score: {thought.score}
                </span>
              )}
            </p>
          )}

          {/* Note */}
          {thought.note && (
            <p style={{
              margin: '0 0 8px',
              fontSize: 13,
              color: '#6b5a3a',
              lineHeight: 1.6,
              fontFamily: 'Geist Mono',
              fontStyle: 'italic',
              borderLeft: '2px solid #d4c49a',
              paddingLeft: 10,
              wordBreak: 'break-word',
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
              fontFamily: 'Geist Mono',
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
                fontFamily: 'Geist Mono',
                padding: '4px 0',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                cursor: 'pointer',
              }}
            >
              {thought.note ? 'Edit note' : 'Add note'}
            </button>
            <button
              onClick={() => onOpenEdit(thought)}
              style={{
                fontSize: 10,
                color: '#8b7355',
                background: 'none',
                border: 'none',
                fontFamily: 'Geist Mono',
                padding: '4px 0',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(thought.id)}
              style={{
                fontSize: 10,
                color: '#c87a7a',
                background: 'none',
                border: 'none',
                fontFamily: 'Geist Mono',
                padding: '4px 0',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                cursor: 'pointer',
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