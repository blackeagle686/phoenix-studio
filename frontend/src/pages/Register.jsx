import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NetworkCanvas from '../components/UI/NetworkCanvas';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, password);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="d-flex w-100 min-vh-100" style={{ backgroundColor: '#050505' }}>
      
      {/* Left Branding Side (Hidden on smaller screens) */}
      <div className="d-none d-lg-flex flex-column w-50 position-relative overflow-hidden justify-content-center px-5" style={{ background: 'linear-gradient(135deg, rgba(8,8,16,1) 0%, rgba(105,48,195,0.1) 50%, rgba(114,239,221,0.05) 100%)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.5, zIndex: 0 }}>
          <NetworkCanvas />
        </div>
        
        <div className="position-relative z-1" style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2 mb-5" style={{ fontSize: '1.5rem', letterSpacing: '1px' }} to="/">
            <i className="bi bi-circle-fill text-mint" style={{ fontSize: '1rem' }}></i> PHOENIX-AI
          </Link>
          <h1 className="hero-text text-white mb-4" style={{ fontSize: '4rem', lineHeight: '1.1' }}>
            JOIN THE<br/>NEXT GEN<br/>OF BUILDERS.
          </h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
            Create an account to build, orchestrate, and deploy advanced multi-agent systems and custom toolchains.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="d-flex flex-column justify-content-center w-50 flex-grow-1 position-relative" style={{ backgroundColor: '#050505' }}>
        
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="d-lg-none position-absolute top-0 w-100 p-4 text-center">
          <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/">
            <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
          </Link>
        </div>

        <div className="w-100" style={{ maxWidth: '420px', margin: '0 auto', padding: '2rem' }}>
          <div className="mb-5">
            <h2 className="fw-bold text-white mb-2" style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem' }}>Create Account</h2>
            <p className="text-muted">Register to start building AI agents.</p>
          </div>

          {error && <div className="alert alert-danger py-2 mb-4" style={{ background: 'rgba(255, 95, 86, 0.1)', border: '1px solid rgba(255, 95, 86, 0.3)', color: '#ff5f56' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Username</label>
              <input 
                type="text" 
                required 
                className="form-control text-white shadow-none" 
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }}
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                onFocus={e => e.target.style.borderColor = 'var(--accent-mint)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <div className="mb-5">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.9rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
              <input 
                type="password" 
                required 
                className="form-control text-white shadow-none" 
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                onFocus={e => e.target.style.borderColor = 'var(--accent-mint)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <button type="submit" className="btn btn-mint w-100 py-3 mb-4 d-flex justify-content-center align-items-center gap-2" style={{ borderRadius: '8px', fontSize: '1.1rem' }}>
              CREATE ACCOUNT <i className="bi bi-person-plus-fill"></i>
            </button>
            
            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-mint text-decoration-none fw-semibold ms-1">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
