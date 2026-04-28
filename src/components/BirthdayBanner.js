import React, { useState, useEffect } from 'react';

const BIRTHDAY_MONTH = 3;
const BIRTHDAY_DAY   = 29;

function isBirthday() {
  const today = new Date();
  return (
    today.getMonth() === BIRTHDAY_MONTH &&
    today.getDate() === BIRTHDAY_DAY
  );
}

function Balloon({ color, x, delay, duration, size, releasing }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      bottom: '-120px',
      animation: releasing
        ? `floatAway 2.5s ease-in forwards`           // fast release on close
        : `floatUp ${duration}s ${delay}s ease-in infinite`,
      animationDelay: releasing ? `${Math.random() * 0.4}s` : `${delay}s`,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: size,
        height: size * 1.2,
        background: `radial-gradient(circle at 35% 35%, ${lighten(color)}, ${color})`,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        position: 'relative',
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
      }}>
        <div style={{
          position: 'absolute',
          top: '15%', left: '20%',
          width: '25%', height: '20%',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '50%',
          transform: 'rotate(-30deg)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -6, left: '50%',
          transform: 'translateX(-50%)',
          width: 8, height: 8,
          background: color,
          borderRadius: '50%',
        }} />
      </div>
      <div style={{
        width: 1, height: 60,
        background: 'rgba(100,80,50,0.4)',
        margin: '0 auto', marginTop: 4,
      }} />
    </div>
  );
}

function lighten(hex) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 60);
  const g = Math.min(255, ((num >> 8)  & 0xff) + 60);
  const b = Math.min(255, (num & 0xff) + 60);
  return `rgb(${r},${g},${b})`;
}

function ConfettiPiece({ left, delay, duration, color, size, shape }) {
  return (
    <div style={{
      position: 'absolute',
      top: '-20px', left,
      width: shape === 'circle' ? size : size * 1.5,
      height: size,
      background: color,
      borderRadius: shape === 'circle' ? '50%' : '2px',
      animation: `confettiFall ${duration}s ${delay}s ease-in forwards`,
      opacity: 0.9,
    }} />
  );
}

export default function BirthdayBanner() {
  const [visible, setVisible]       = useState(false);
  const [releasing, setReleasing]   = useState(false);   // balloon release state
  const [elements, setElements]     = useState({ balloons: [], confetti: [] });

  useEffect(() => {
    if (!isBirthday()) return;
    const dismissed = localStorage.getItem('birthday_dismissed');
    const today = new Date().toDateString();
    if (dismissed === today) return;

    const timer = setTimeout(() => {
      setVisible(true);
      setElements({
        balloons: generateBalloons(),
        confetti: generateConfetti(),
      });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  function generateBalloons() {
    const colors = [
      '#e74c3c','#e67e22','#f1c40f',
      '#2ecc71','#3498db','#9b59b6',
      '#e91e63','#00bcd4','#8B4513',
    ];
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      x: `${3 + i * 5.5}%`,
      delay: (i * 0.3) % 4,
      duration: 6 + (i % 4),
      size: 36 + (i % 3) * 10,
    }));
  }

  function generateConfetti() {
    const colors = [
      '#e74c3c','#f39c12','#2ecc71',
      '#3498db','#9b59b6','#f1c40f',
      '#e91e63','#1abc9c','#c8860a',
    ];
    const shapes = ['rect','circle','rect'];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
  }

  function handleClose() {
        setReleasing(true);                                  // trigger balloon release
    localStorage.setItem('birthday_dismissed', new Date().toDateString());
    setTimeout(() => setVisible(false), 2500);           // wait for balloons to float away
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(-3deg); opacity: 1; }
          50%  { transform: translateY(-60vh) rotate(3deg); opacity: 0.9; }
          100% { transform: translateY(-110vh) rotate(-2deg); opacity: 0; }
        }
        @keyframes floatAway {
          0%   { transform: translateY(0) rotate(-3deg); opacity: 1; }
          100% { transform: translateY(-130vh) rotate(8deg); opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg) scale(0.5); opacity: 0; }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes popIn {
          0%   { transform: scale(0.5) rotate(-5deg); opacity: 0; }
          70%  { transform: scale(1.05) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes popOut {
          from { transform: scale(1); opacity: 1; }
          to   { transform: scale(0.5); opacity: 0; }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-2deg); }
          50%     { transform: rotate(2deg); }
        }
        @keyframes rainbow {
          0%   { color: #e74c3c; }
          16%  { color: #e67e22; }
          33%  { color: #f1c40f; }
          50%  { color: #2ecc71; }
          66%  { color: #3498db; }
          83%  { color: #9b59b6; }
          100% { color: #e74c3c; }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        .birthday-btn:hover {
          transform: scale(1.05) !important;
          background: #2d1f0a !important;
        }
      `}</style>

      {/* Balloons — stay visible during release */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 997, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {elements.balloons.map(b => (
          <Balloon key={b.id} {...b} releasing={releasing} />
        ))}
      </div>

      {/* Confetti */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 998, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {elements.confetti.map(c => <ConfettiPiece key={c.id} {...c} />)}
      </div>

      {/* Overlay — fades out on close */}
      {!releasing && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,6,2,0.72)',
            zIndex: 999,
            animation: 'fadeIn 0.4s ease forwards',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Card */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(160deg, #fff9f0 0%, #ede3c8 50%, #e8dbb8 100%)',
              border: '4px double #1a1208',
              borderRadius: 4,
              padding: 'clamp(24px, 6vw, 44px) clamp(20px, 6vw, 52px)',
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
              animation: 'popIn 0.5s ease forwards',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Corner stars */}
            {['top:10px;left:14px','top:10px;right:14px',
              'bottom:10px;left:14px','bottom:10px;right:14px'].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute',
                ...Object.fromEntries(pos.split(';').map(p => p.split(':'))),
                fontSize: 16, color: '#c8b88a',
                animation: `wiggle ${2 + i * 0.3}s ease-in-out infinite`,
              }}>✦</div>
            ))}

            {/* Party emoji */}
            <div style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              marginBottom: 12,
              animation: 'bounce 1s ease-in-out infinite',
              letterSpacing: '0.15em',
            }}>
              🎉 🎂 🎉
            </div>

            {/* Special edition label */}
            <div style={{
              fontSize: 9,
              letterSpacing: '0.35em',
              color: '#8b7355',
              fontFamily: 'Georgia',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              ✦ Special Birthday Edition ✦
            </div>

            {/* Double rule */}
            <div style={{ borderTop: '3px double #c8b88a', margin: '0 0 18px' }} />

            {/* Happy Birthday */}
            <div style={{
              fontFamily: "'UnifrakturMaguntia', 'Georgia', serif",
              fontSize: 'clamp(24px, 7vw, 50px)',
              color: '#1a1208',
              lineHeight: 1.1,
              marginBottom: 6,
              textShadow: '1px 1px 0 rgba(200,184,138,0.6)',
            }}>
              Happy Birthday
            </div>

            {/* Name */}
            <div style={{
              fontFamily: 'Georgia',
              fontSize: 'clamp(18px, 5vw, 34px)',
              fontStyle: 'italic',
              fontWeight: 'bold',
              animation: 'rainbow 3s linear infinite',
              marginBottom: 18,
            }}>
              Colin!
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 10, justifyContent: 'center', marginBottom: 18,
            }}>
              <div style={{ flex: 1, height: 1, background: '#c8b88a' }} />
              <span style={{ fontSize: 18 }}>🏌️</span>
              <div style={{ flex: 1, height: 1, background: '#c8b88a' }} />
            </div>

            {/* Message — slightly smaller */}
            <p style={{
              fontFamily: 'Georgia',
              fontSize: 'clamp(11px, 3vw, 13px)',    // reduced from 13-15px
              fontStyle: 'italic',
              color: '#6b5a3a',
              lineHeight: 1.9,
              marginBottom: 10,
            }}>
              Happy birthday my love! Have fun filling this journal.
              Here are some thoughts to get you started:
              <br />1. Everyone sucks at golf.
              <br />2. Pistachios and turkey wraps are your friend.
              <br />3. 18 holes is a long time to go without kissing your girlfriend!
            </p>

            <p style={{
              fontFamily: 'Georgia',
              fontSize: 'clamp(10px, 2.5vw, 12px)',  // reduced
              color: '#a89878',
              fontStyle: 'italic',
              marginBottom: 20,
            }}>
              A golf-themed gift really screams "I'm turning 28" doesn't it?
            </p>

            {/* Golf row */}
            <div style={{
              fontSize: 'clamp(16px, 5vw, 22px)',
              marginBottom: 20,
              letterSpacing: '0.3em',
              animation: 'bounce 1.4s ease-in-out infinite',
            }}>
              ⛳ 🏌️ ⛳
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="birthday-btn"
              style={{
                padding: '12px 36px',
                background: '#1a1208',
                border: 'none',
                color: '#f2ead8',
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'Georgia',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: 280,
              }}
            >
              Open Your Journal →
            </button>

            <div style={{
              marginTop: 14,
              fontSize: 9,
              color: '#a89878',
              fontFamily: 'Georgia',
              fontStyle: 'italic',
            }}>
              · click anywhere to dismiss ·
            </div>
          </div>
        </div>
      )}
    </>
  );
}