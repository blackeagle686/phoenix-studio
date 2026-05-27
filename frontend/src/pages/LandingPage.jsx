import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 min-vh-100 position-relative text-white text-center">
      <div className="ambient-bg"></div>
      <div className="glass-panel p-5 position-relative z-1" style={{ maxWidth: '800px', borderRadius: '24px' }}>
        <i className="bi bi-fire text-info mb-3 glow-cyan" style={{ fontSize: '4rem' }}></i>
        <h1 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-title)', fontSize: '3.5rem', letterSpacing: '2px' }}>
          PHOENIX <span className="text-info glow-cyan">STUDIO</span>
        </h1>
        <p className="lead mb-5 text-light opacity-75" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
          The ultimate visual builder for creating, managing, and running intelligent AI agents directly in your browser. Design complex flows without writing a single line of code.
        </p>
        <div className="d-flex gap-4 justify-content-center">
          <Link to="/register" className="btn btn-lg btn-info px-5 fw-bold" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)', border: 'none', color: '#080810', boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-lg btn-outline-light px-5 fw-bold" style={{ borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
