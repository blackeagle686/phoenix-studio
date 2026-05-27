import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg py-4 px-5 fixed-top" style={{ background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/">
            <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> SYNTHORA
          </Link>
          <div className="ms-auto">
            <Link to="/" className="btn btn-outline-light rounded-1 px-4 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container pt-5 mt-5">
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-8 text-center">
            <i className="bi bi-people-fill text-mint mb-4" style={{ fontSize: '4rem' }}></i>
            <h1 className="hero-text mb-4" style={{ fontSize: '3.5rem' }}>We are Phoenix AI</h1>
            <p className="lead text-muted mb-5">Building the future of Agentic Frameworks and Visual Programming.</p>
            
            <div className="text-start feature-card p-5 mb-5">
              <h3 className="text-white mb-4">Our Mission</h3>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                We believe that Artificial Intelligence shouldn't be locked behind complex API calls and spaghetti code. The Phoenix AI team is dedicated to democratizing advanced AI engineering. By combining robust symbolic logic, cutting edge models, and intuitive visual graph programming, we allow anyone to build systems that think, learn, and act.
              </p>
              
              <h3 className="text-white mb-4 mt-5">The Labs</h3>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Synthora is our flagship research initiative—a platform that proves our Phoenix Core SDK can be deployed reliably and efficiently in production environments. We are continuously exploring new paradigms in Hybrid Memory and multi-agent consensus algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
