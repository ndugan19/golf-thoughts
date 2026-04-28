import React from 'react';
import CategoryBadge from '../components/CategoryBadge';
import { formatDateLong } from '../utils';

export default function FrontPage({
  thoughts,
  randomThought,
  onShuffle,
  onToggleStar,
  onGoToCatalog,
}) {
  const starred = thoughts.filter(t => t.starred);

  return (
    <div style={{ padding: '28px 16px', maxWidth: 780, margin: '0 auto' }}>

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
          Focused Thoughts
        </div>
      </div>

      {/* Starred thoughts */}
      {starred.length === 0 ? (
        <div
          onClick={onGoToCatalog}
          style={{
            border: '1px dashed #c8b88a',
            padding: '40px 24px',
            textAlign: 'center',
            color: '#8b7355',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.8,
            fontFamily: 'Geist Mono',
            cursor: 'pointer',
          }}
        >
          No thoughts starred yet.
          <br />
          <span style={{ fontSize: 13 }}>
            Head to the Catalog and star up to three thoughts to feature them here.
          </span>
        </div>
      ) : (
        starred.map((t, i) => (
          <div key={t.id} style={{
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: i < starred.length - 1 ? '1px solid #d4c49a' : 'none',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

              {/* Number glyph — smaller on mobile */}
              <div style={{
                fontSize: 'clamp(28px, 8vw, 48px)',   // scales with screen
                fontWeight: 900,
                color: '#d4c49a',
                lineHeight: 0.8,
                marginTop: 4,
                fontStyle: 'italic',
                fontFamily: 'Geist Mono',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 8px',
                  fontSize: 'clamp(15px, 4vw, 19px)',  // scales with screen
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  fontFamily: 'Geist Mono',
                  wordBreak: 'break-word',
                }}>
                  {t.text}
                </p>
                {t.note && (
                  <p style={{
                    margin: '0 0 8px',
                    fontSize: 13,
                    color: '#6b5a3a',
                    lineHeight: 1.6,
                    fontFamily: 'Geist Mono',
                    wordBreak: 'break-word',
                  }}>
                    {t.note}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                  {t.categories.map(cat => (
                    <CategoryBadge key={cat} category={cat} />
                  ))}
                  <span style={{
                    fontSize: 10,
                    color: '#a89878',
                    fontFamily: 'Geist Mono',
                  }}>
                    {formatDateLong(t.timestamp)}
                  </span>
                  <button
                    onClick={() => onToggleStar(t.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 11,
                      color: '#8b7355',
                      fontFamily: 'Geist Mono',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '4px 0',          // taller tap target
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                      cursor: 'pointer',
                    }}
                  >
                    Unstar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Remaining slots */}
      {starred.length > 0 && starred.length < 3 && (
        <div style={{
          border: '1px dashed #c8b88a',
          padding: '14px 20px',
          color: '#8b7355',
          fontStyle: 'italic',
          fontSize: 13,
          fontFamily: 'Geist Mono',
          marginTop: 8,
        }}>
          {3 - starred.length} slot{3 - starred.length > 1 ? 's' : ''} remaining
          — visit the Catalog to star more thoughts.
        </div>
      )}

      {/* From the Archives */}
      <div style={{
        marginTop: 36,
        borderTop: '2px solid #1a1208',
        paddingTop: 20,
      }}>
        {/* Section header — wraps on mobile */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontFamily: 'Geist Mono',
          }}>
            From the Archives
          </div>
          <button
            onClick={onShuffle}
            style={{
              background: 'none',
              border: '1px solid #8b7355',
              padding: '6px 14px',       // taller tap target
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              color: '#6b5a3a',
              cursor: 'pointer',
            }}
          >
            Shuffle ↻
          </button>
        </div>

        {!randomThought ? (
          <div style={{
            color: '#a89878',
            fontStyle: 'italic',
            fontSize: 14,
            fontFamily: 'Geist Mono',
          }}>
            Press Shuffle to surface a thought from your catalog.
          </div>
        ) : (
          <div style={{
            background: '#e8dbb8',
            padding: '20px 20px',
            borderLeft: '4px solid #8B4513',
          }}>
            <p style={{
              margin: '0 0 10px',
              fontSize: 'clamp(14px, 4vw, 17px)',   // scales with screen
              lineHeight: 1.7,
              fontStyle: 'italic',
              fontFamily: 'Geist Mono',
              wordBreak: 'break-word',
            }}>
              {randomThought.text}
            </p>
            {randomThought.note && (
              <p style={{
                margin: '0 0 8px',
                fontSize: 13,
                color: '#6b5a3a',
                lineHeight: 1.6,
                fontFamily: 'Geist Mono',
                wordBreak: 'break-word',
              }}>
                {randomThought.note}
              </p>
            )}
            <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              {randomThought.categories.map(cat => (
                <CategoryBadge key={cat} category={cat} />
              ))}
              <span style={{
                fontSize: 10,
                color: '#a89878',
                fontFamily: 'Geist Mono',
              }}>
                {formatDateLong(randomThought.timestamp)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}