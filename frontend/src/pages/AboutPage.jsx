import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NetworkCanvas from '../components/UI/NetworkCanvas';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg py-4 px-5 fixed-top" style={{ background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-4">
            <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/">
              <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
            </Link>
            <div className="d-none d-lg-flex gap-4 ms-4 align-items-center">
              <Link className="nav-link-custom" to="/">Home</Link>
              
              <div className="dropdown">
                <a className="nav-link-custom dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Platform
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <li><Link className="dropdown-item text-light" to="/">Build AI Agent</Link></li>
                  <li><Link className="dropdown-item text-light" to="/">Build Multi Agent System</Link></li>
                  <li><Link className="dropdown-item text-light" to="/">Build Chatbots</Link></li>
                  <li><Link className="dropdown-item text-light" to="/">Build RAG System</Link></li>
                  <li><Link className="dropdown-item text-light" to="/">Build Computer Vision Models</Link></li>
                </ul>
              </div>

              <Link className="nav-link-custom" to="/guide">Use Case</Link>
              <Link className="nav-link-custom active" to="/about">Labs</Link>
            </div>
          </div>
          <div className="ms-auto">
            <button className="btn btn-light rounded-1 px-4 py-2 fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }} onClick={() => navigate('/login')}>
              LAUNCH AGENT <i className="bi bi-arrow-up-right ms-2"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative d-flex flex-column justify-content-center" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, zIndex: 0 }}>
          <NetworkCanvas />
        </div>
        <div className="container-fluid px-5 position-relative z-1" style={{ maxWidth: '1400px' }}>
          <div className="row">
            <div className="col-12 col-lg-9">
              <p className="text-mint text-uppercase fw-bold mb-3" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>OUR MISSION</p>
              <h1 className="manifesto-text mb-4 text-white" style={{ fontSize: '4.5rem' }}>
                Democratizing advanced <br />AI engineering.
              </h1>
              <p className="text-light opacity-75 mb-5" style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                We believe Artificial Intelligence shouldn't be locked behind complex API calls and spaghetti code. The Phoenix AI team is dedicated to building robust, accessible tooling for the next generation of software engineers.
              </p>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 w-100" style={{ height: '150px', background: 'linear-gradient(to bottom, transparent, #050505)' }}></div>
      </section>

      {/* Philosophy Section */}
      <section className="py-5 bg-deep">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <div className="row g-5">
            <div className="col-12 col-lg-4">
              <div className="feature-card h-100 d-flex flex-column">
                <i className="bi bi-code-slash text-mint mb-4" style={{ fontSize: '3rem' }}></i>
                <h3 className="text-white mb-3">No Spaghetti Code</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  Traditional AI frameworks force developers to write deeply nested, difficult-to-maintain procedural code. Phoenix Studio replaces this with intuitive visual graph programming, abstracting the complexity without limiting the power.
                </p>
              </div>
            </div>
            
            <div className="col-12 col-lg-4">
              <div className="feature-card h-100 d-flex flex-column">
                <i className="bi bi-cpu text-mint mb-4" style={{ fontSize: '3rem' }}></i>
                <h3 className="text-white mb-3">Symbolic Logic</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  LLMs hallucinate. By combining raw model intelligence with strict, verifiable symbolic steering engines, Phoenix agents operate reliably, consistently, and predictably in production environments.
                </p>
              </div>
            </div>
            
            <div className="col-12 col-lg-4">
              <div className="feature-card h-100 d-flex flex-column">
                <i className="bi bi-rocket-takeoff text-mint mb-4" style={{ fontSize: '3rem' }}></i>
                <h3 className="text-white mb-3">Open Ecosystem</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  We don't lock you into proprietary hosting. Phoenix Studio compiles your visual nodes directly into standard, portable Python packages that you can deploy on your own bare-metal servers or cloud providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Labs Section */}
      <section className="py-5 my-5">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-5 mb-lg-0">
              <h2 className="manifesto-text mb-4">The Synthora Labs</h2>
              <p className="text-light mb-4" style={{ fontSize: '1.2rem', lineHeight: '1.7' }}>
                Synthora is our flagship research initiative—a testing ground that proves the <span className="text-mint">Phoenix Core SDK</span> can be deployed reliably and efficiently in edge and enterprise environments.
              </p>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                We are continuously exploring new paradigms in Hybrid Memory architectures, multi-agent consensus algorithms, and localized RAG pipelines that operate without external dependencies.
              </p>
              <button className="btn btn-outline-mint mt-4 px-4 py-2" onClick={() => navigate('/login')}>EXPLORE THE PLATFORM</button>
            </div>
            <div className="col-12 col-lg-5 offset-lg-1">
              <div className="position-relative" style={{ width: '100%', paddingBottom: '100%' }}>
                <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-circle" style={{ border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                  <div className="position-absolute w-75 h-75 d-flex align-items-center justify-content-center rounded-circle" style={{ border: '1px dashed rgba(74, 222, 128, 0.3)', animation: 'spin 60s linear infinite' }}>
                    <div className="position-absolute w-50 h-50 d-flex align-items-center justify-content-center rounded-circle" style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, transparent 70%)' }}>
                      <i className="bi bi-hexagon-fill text-mint glow-cyan" style={{ fontSize: '4rem' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center" style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-muted m-0 small">&copy; 2026 PHOENIX-AI LABS. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AboutPage;
