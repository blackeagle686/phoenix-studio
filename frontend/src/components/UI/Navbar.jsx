import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-4 px-lg-5 position-relative z-1" style={{ background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container-fluid" style={{ maxWidth: '1400px' }}>
        <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/">
          <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
        </Link>
        
        <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <div className="navbar-nav ms-auto align-items-lg-center gap-4 mt-4 mt-lg-0">
            <Link className={`nav-link-custom text-decoration-none ${location.pathname === '/' ? 'active text-mint' : ''}`} to="/">Home</Link>
            
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle nav-link-custom text-decoration-none" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Platform
              </a>
              <ul className="dropdown-menu dropdown-menu-dark border-0 mt-2" style={{ backgroundColor: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.1) !important' }}>
                <li><Link className="dropdown-item py-2 text-light" to="/">Build AI Agent</Link></li>
                <li><Link className="dropdown-item py-2 text-light" to="/">Build Multi Agent System</Link></li>
                <li><Link className="dropdown-item py-2 text-light" to="/">Build Chatbots</Link></li>
                <li><Link className="dropdown-item py-2 text-light" to="/">Build RAG System</Link></li>
                <li><Link className="dropdown-item py-2 text-light" to="/">Build Computer Vision Models</Link></li>
              </ul>
            </li>

            <Link className={`nav-link-custom text-decoration-none ${location.pathname === '/guide' ? 'active text-mint' : ''}`} to="/guide">Use Case</Link>
            <Link className={`nav-link-custom text-decoration-none ${location.pathname === '/about' ? 'active text-mint' : ''}`} to="/about">Labs</Link>
            
            <div className="d-flex align-items-center gap-3 ms-lg-4 mt-4 mt-lg-0">
              <button className="btn btn-light rounded-1 px-4 py-2 fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }} onClick={() => navigate('/login')}>
                LAUNCH AGENT <i className="bi bi-arrow-up-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
