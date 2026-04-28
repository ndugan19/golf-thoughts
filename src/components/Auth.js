import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Auth() {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5ECD7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
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
                onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
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
              onClick={() => { setMode('login'); setError(''); setMessage(''); }}
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