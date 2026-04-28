import React from 'react';
import { getTodayString } from '../utils';
import { useWindowSize } from '../hooks/useWindowSize';

const views = [
  { id: 'frontpage', label: 'Front Page' },
  { id: 'catalog',   label: 'Catalog' },
  { id: 'compose',   label: 'Log a Thought' },
  { id: 'map',       label: 'Courses' },
];

const mobileIcons = {
  frontpage: '📰',
  catalog:   '📋',
  compose:   '✏️',
  map:       '🗺️',
};

export default function Masthead({
  currentView,
  onViewChange,
  userEmail,
  onSignOut,
}) {
  const { isMobile } = useWindowSize();

  return (
    <div style={{
      borderBottom: '4px double #1a1208',
      background: 'linear-gradient(to bottom, #e8dbb8, #ede3c8)',
      padding: isMobile ? '10px 16px 0' : '14px 24px 0',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Sign out */}
      {userEmail && (
        <div style={{
          position: 'absolute',
          top: isMobile ? 8 : 12,
          right: isMobile ? 12 : 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {/* Hide email on mobile to save space */}
          {!isMobile && (
            <span style={{
              fontSize: 10,
              color: '#a89878',
              fontFamily: 'Geist Mono',
              fontStyle: 'italic',
            }}>
              {userEmail}
            </span>
          )}
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

      {/* Date — hidden on mobile */}
      {!isMobile && (
        <div style={{
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#6b5a3a',
          marginBottom: 4,
          fontFamily: 'Geist Mono',
        }}>
          {getTodayString()}
        </div>
      )}

      {/* Title */}
      <div style={{
        fontSize: isMobile ? 28 : 'clamp(32px, 6vw, 56px)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: '#1a1208',
        fontFamily: "'Hedvig Letters Serif', 'Geist Mono', serif",
        marginBottom: isMobile ? 8 : 12,
        marginTop: isMobile ? 2 : 0,
      }}>
        Golf Thoughts
      </div>

      {/* Desktop nav */}
      {!isMobile && (
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
                cursor: 'pointer',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile nav — icon tab bar */}
      {isMobile && (
        <div style={{
          display: 'flex',
          borderTop: '1px solid #c8b88a',
          marginLeft: -16,
          marginRight: -16,
        }}>
          {views.map((v, i) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              style={{
                flex: 1,
                padding: '7px 2px',
                background: currentView === v.id ? '#e0d4b0' : 'none',
                border: 'none',
                borderLeft: i > 0 ? '1px solid #c8b88a' : 'none',
                color: currentView === v.id ? '#1a1208' : '#8b7355',
                fontSize: 8,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'Geist Mono',
                fontWeight: currentView === v.id ? 'bold' : 'normal',
                cursor: 'pointer',
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontSize: 15, marginBottom: 2 }}>
                {mobileIcons[v.id]}
              </div>
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}