import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center w-100 min-vh-100 position-relative text-white">
      <div className="ambient-bg"></div>
      <div className="glass-panel p-5 position-relative z-1" style={{ width: '400px', borderRadius: '16px' }}>
        <h2 className="fw-bold mb-4 text-center" style={{ fontFamily: 'var(--font-title)' }}>Login</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Username</label>
            <input type="text" required className="form-control bg-dark border-secondary text-white" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="form-label text-light fw-semibold">Password</label>
            <input type="password" required className="form-control bg-dark border-secondary text-white" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-info w-100 fw-bold mb-3" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)', border: 'none', color: '#080810' }}>
            Login
          </button>
          <div className="text-center text-light" style={{ fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" className="text-info text-decoration-none fw-semibold glow-cyan">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
