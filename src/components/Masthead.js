import React from 'react';
import { getTodayString } from '../utils';

const views = [
  { id: 'frontpage', label: 'Front Page' },
  { id: 'catalog',   label: 'Catalog' },
  { id: 'compose',   label: 'Log a Thought' },
  { id: 'map',       label: 'Courses' },
];

export default function Masthead({
  currentView,
  onViewChange,
  userEmail,
  onSignOut,
}) {
  return (
    <div style={{
      borderBottom: '4px double #1a1208',
      background: 'linear-gradient(to bottom, #e8dbb8, #ede3c8)',
      padding: '14px 24px 0',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Sign out */}
      {userEmail && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            fontSize: 10,
            color: '#a89878',
            fontFamily: 'Geist Mono',
            fontStyle: 'italic',
          }}>
            {userEmail}
          </span>
          <button
            onClick={onSignOut}
            style={{
              background: 'none',
              border: '1px solid #c8b88a',
              padding: '3px 10px',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              color: '#8b7355',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Date */}
      <div style={{
        fontSize: 9,
        letterSpacing: '0.3em',
        color: '#6b5a3a',
        marginBottom: 4,
        fontFamily: 'Geist Mono',
      }}>
        {getTodayString()}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: '#1a1208',
        fontFamily: "'Hedvig Letters Serif', 'Geist Mono', serif",
        marginBottom: 12,
      }}>
        Golf Thoughts
      </div>

      {/* Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        borderTop: '1px solid #c8b88a',
        borderBottom: '1px solid #c8b88a',
      }}>
        {views.map((v, i) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            style={{
              padding: '7px 20px',
              background: 'none',
              border: 'none',
              borderLeft: i > 0 ? '1px solid #c8b88a' : 'none',
              color: currentView === v.id ? '#1a1208' : '#8b7355',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              fontWeight: currentView === v.id ? 'bold' : 'normal',
              textDecoration: currentView === v.id ? 'underline' : 'none',
              textUnderlineOffset: 3,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}