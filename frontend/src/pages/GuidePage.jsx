import React from 'react';
import { Link } from 'react-router-dom';

function GuidePage() {
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
            <i className="bi bi-journal-code text-mint mb-4" style={{ fontSize: '4rem' }}></i>
            <h1 className="hero-text mb-4" style={{ fontSize: '3.5rem' }}>How to Use Phoenix</h1>
            <p className="lead text-muted mb-5">A simple guide to get your first AI Agent running.</p>
            
            <div className="text-start feature-card p-5 mb-5">
              <h3 className="text-white mb-4">1. Create an Account</h3>
              <p className="text-muted mb-4">First, click the <strong>Launch Agent</strong> or <strong>Login</strong> button on the home page. You will need to create a free account to save your workspaces.</p>
              
              <h3 className="text-white mb-4">2. Build Your Workflow</h3>
              <p className="text-muted mb-4">Once inside the Phoenix Studio, you can drag and drop nodes from the left sidebar to build your agent. Connect LLMs, data sources, and tools to the core agent block.</p>

              <h3 className="text-white mb-4">3. Download & Run</h3>
              <p className="text-muted mb-4">When your workflow is complete, hit the <strong>Download Agent</strong> button in the top right. You will receive a ZIP file containing the generated Python code.</p>
              
              <h3 className="text-white mb-4">4. Execute Locally</h3>
              <div className="bg-dark p-3 rounded mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <code>
                  unzip my_agent.zip<br/>
                  cd my_agent<br/>
                  pip install -r requirements.txt<br/>
                  python main.py
                </code>
              </div>
              <p className="text-muted">Your agent is now live and running on your local machine!</p>
            </div>
            
            <Link to="/register" className="btn btn-mint btn-lg px-5">Get Started Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;
