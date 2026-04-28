import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Auth() {
  const [mode, setMode]               = useState('login');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);

    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }

    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://golf-thoughts.vercel.app',
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent. Check your inbox.');
      }
    }

    setLoading(false);
  }

  // Eye icons
  const EyeOpen = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeClosed = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const passwordInputWrapper = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const passwordInput = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#f5ead8',
    border: '1px solid #c8b88a',
    padding: '10px 40px 10px 12px',
    fontSize: 14,
    fontFamily: 'Geist Mono',
    color: '#1a1208',
    outline: 'none',
  };

  const eyeButton = {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={{
      minHeight: 'max(100vh, 100dvh)',
      background: '#F5ECD7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 'max(40px, 8vh)',
      paddingBottom: '24px',
      paddingLeft: '16px',
      paddingRight: '16px',
    }}>
      {/* Masthead */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#6b5a3a',
          marginBottom: 6,
          fontFamily: 'Geist Mono',
        }}>
          YOUR GOLF JOURNAL
        </div>
        <div style={{
          fontSize: 'clamp(32px, 8vw, 52px)',
          fontWeight: 900,
          color: '#1a1208',
          fontFamily: "'Hedvig Letters Serif', 'Geist Mono', serif",
          lineHeight: 1,
        }}>
          Golf Thoughts
        </div>
        <div style={{
          marginTop: 8,
          width: '100%',
          height: 1,
          background: '#c8b88a',
        }} />
      </div>

      {/* Form card */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#ede3c8',
        border: '1px solid #c8b88a',
        padding: 32,
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontFamily: 'Geist Mono',
          marginBottom: 24,
          color: '#1a1208',
          textAlign: 'center',
        }}>
          {mode === 'login'  && 'Sign In'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset'  && 'Reset Password'}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8b7355',
              fontFamily: 'Geist Mono',
              marginBottom: 6,
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#f5ead8',
                border: '1px solid #c8b88a',
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'Geist Mono',
                color: '#1a1208',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div style={{ marginBottom: mode === 'signup' ? 16 : 24 }}>
              <label style={{
                display: 'block',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#8b7355',
                fontFamily: 'Geist Mono',
                marginBottom: 6,
              }}>
                Password
              </label>
              <div style={passwordInputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={eyeButton}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password — signup only */}
          {mode === 'signup' && (
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#8b7355',
                fontFamily: 'Geist Mono',
                marginBottom: 6,
              }}>
                Confirm Password
              </label>
              <div style={passwordInputWrapper}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    ...passwordInput,
                    borderColor: confirm && confirm !== password ? '#c87a7a' : '#c8b88a',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  style={eyeButton}
                >
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {/* Inline mismatch hint */}
              {confirm && confirm !== password && (
                <div style={{
                  fontSize: 10,
                  fontFamily: 'Geist Mono',
                  color: '#c87a7a',
                  fontStyle: 'italic',
                  marginTop: 4,
                }}>
                  Passwords don't match
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 16,
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

          {/* Success */}
          {message && (
            <div style={{
              marginBottom: 16,
              padding: '10px 14px',
              background: '#e8dbb8',
              borderLeft: '3px solid #2F5233',
              fontSize: 13,
              fontFamily: 'Geist Mono',
              color: '#2F5233',
              fontStyle: 'italic',
            }}>
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#c8b88a' : '#1a1208',
              border: 'none',
              color: '#f2ead8',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Geist Mono',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Please wait...' : (
              mode === 'login'  ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              'Send Reset Email'
            )}
          </button>
        </form>

        {/* Mode switchers */}
        <div style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
        }}>
          {mode === 'login' && (
            <>
              <button
                onClick={() => { setMode('signup'); setError(''); setMessage(''); setConfirm(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  fontFamily: 'Geist Mono',
                  color: '#8b7355',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                  cursor: 'pointer',
                }}
              >
                Don't have an account? Sign up
              </button>
              <button
                onClick={() => { setMode('reset'); setError(''); setMessage(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  fontFamily: 'Geist Mono',
                  color: '#8b7355',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </>
          )}
          {(mode === 'signup' || mode === 'reset') && (
            <button
              onClick={() => { setMode('login'); setError(''); setMessage(''); setConfirm(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontFamily: 'Geist Mono',
                color: '#8b7355',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                cursor: 'pointer',
              }}
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}