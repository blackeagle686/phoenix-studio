import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-5" style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
        <div className="row gy-5">
          <div className="col-lg-4 col-md-12">
            <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2 mb-4" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/">
              <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
            </Link>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '300px' }}>
              Building the next generation of multi-agent systems and custom toolchains. Empowering developers to deploy autonomous intelligence.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6 className="text-white fw-bold mb-4" style={{ letterSpacing: '1px' }}>Platform</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/guide" className="text-muted text-decoration-none nav-link-custom">Use Cases</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none nav-link-custom">The Lab</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none nav-link-custom">Studio Login</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6 className="text-white fw-bold mb-4" style={{ letterSpacing: '1px' }}>Solutions</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/" className="text-muted text-decoration-none nav-link-custom">AI Agents</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none nav-link-custom">Multi-Agent Systems</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none nav-link-custom">RAG Pipelines</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none nav-link-custom">Computer Vision</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6 className="text-white fw-bold mb-4" style={{ letterSpacing: '1px' }}>Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><a href="#" className="text-muted text-decoration-none nav-link-custom">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none nav-link-custom">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-12 text-lg-end mt-5 mt-lg-0">
            <h6 className="text-white fw-bold mb-4" style={{ letterSpacing: '1px' }}>Connect</h6>
            <div className="d-flex gap-4 justify-content-lg-end">
              <a href="#" className="text-muted nav-link-custom fs-5"><i className="bi bi-github"></i></a>
              <a href="#" className="text-muted nav-link-custom fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-muted nav-link-custom fs-5"><i className="bi bi-discord"></i></a>
            </div>
          </div>
        </div>
        
        <div className="row mt-5 pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">
            <p className="text-muted small m-0">&copy; {new Date().getFullYear()} Phoenix-AI. All rights reserved.</p>
            <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
              <span className="text-muted small">Status:</span>
              <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-1"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.4rem', verticalAlign: 'middle' }}></i> All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
