import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

export default function Login() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('wallys_auth') === 'true') {
      navigate('/inventory', { replace: true });
    }
  }, [navigate]);

  async function submitPin(fullPin) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('wallys_auth', 'true');
        navigate('/inventory', { replace: true });
      } else {
        setError('Incorrect PIN. Try again.');
        setPin('');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError('Cannot connect to server.');
      setPin('');
    } finally {
      setLoading(false);
    }
  }

  function handleKey(digit) {
    if (loading) return;
    setError('');
    const next = pin + digit;
    if (next.length <= 4) {
      setPin(next);
      if (next.length === 4) {
        submitPin(next);
      }
    }
  }

  function handleClear() {
    setPin(prev => prev.slice(0, -1));
    setError('');
  }

  const keys = ['1','2','3','4','5','6','7','8','9'];

  return (
    <div className="login-page">
      <div className={`login-card${shake ? ' shake' : ''}`}>
        <div className="login-logo">🛞</div>
        <h1 className="login-title">Staff Access</h1>
        <p className="login-sub">Enter your 4-digit PIN to continue</p>

        <div className="pin-display">
          {[0,1,2,3].map(i => (
            <div key={i} className={`pin-dot${i < pin.length ? ' filled' : ''}`} />
          ))}
        </div>

        <div className="pin-error">{error}</div>

        <div className="pin-keypad">
          {keys.map(k => (
            <button key={k} className="key-btn" onClick={() => handleKey(k)} disabled={loading}>
              {k}
            </button>
          ))}
          <button className="key-btn key-btn-clear" onClick={handleClear} disabled={loading}>
            ⌫
          </button>
          <button className="key-btn key-btn-zero" onClick={() => handleKey('0')} disabled={loading}>
            0
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.45s ease; }
      `}</style>
    </div>
  );
}
