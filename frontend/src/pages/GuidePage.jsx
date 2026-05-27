import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NetworkCanvas from '../components/UI/NetworkCanvas';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';
function GuidePage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      {/* Hero Section */}
      <section className="position-relative d-flex flex-column justify-content-center" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, zIndex: 0 }}>
          <NetworkCanvas />
        </div>
        <div className="container-fluid px-5 position-relative z-1" style={{ maxWidth: '1400px' }}>
          <div className="row">
            <div className="col-12 col-lg-8">
              <p className="text-mint text-uppercase fw-bold mb-3" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>USE CASES & GUIDES</p>
              <h1 className="manifesto-text mb-4 text-white" style={{ fontSize: '4.5rem' }}>
                How to deploy your first agent
              </h1>
              <p className="text-light opacity-75 mb-5" style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                A step-by-step framework for transforming visual logic into a production-ready, locally executable AI system.
              </p>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 w-100" style={{ height: '150px', background: 'linear-gradient(to bottom, transparent, #050505)' }}></div>
      </section>

      {/* Steps Content Section */}
      <section className="py-5 bg-deep">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <div className="row g-5">
            {/* Step 1 */}
            <div className="col-12 col-md-6">
              <div className="feature-card h-100 d-flex flex-column position-relative overflow-hidden">
                <span className="text-mint mb-4 font-monospace fs-5">[01] Authentication</span>
                <h3 className="text-white fw-light mb-4" style={{ fontSize: '2rem' }}>Access the Studio</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  Secure your workspace by creating a free account. Click the <strong>LAUNCH AGENT</strong> button in the navigation bar to log in or register. Authenticated users gain access to cloud-saved session histories and persistent workflows.
                </p>
                <div className="mt-auto pt-4">
                  <button className="btn btn-outline-mint btn-sm rounded-1 px-4 py-2" onClick={() => navigate('/register')}>Register Now</button>
                </div>
                <i className="bi bi-shield-lock-fill position-absolute text-white opacity-25" style={{ fontSize: '12rem', right: '-20px', bottom: '-40px' }}></i>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-12 col-md-6">
              <div className="feature-card h-100 d-flex flex-column position-relative overflow-hidden">
                <span className="text-mint mb-4 font-monospace fs-5">[02] Architecture</span>
                <h3 className="text-white fw-light mb-4" style={{ fontSize: '2rem' }}>Build the Workflow</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  Inside Phoenix Studio, drag and drop logic nodes onto the infinite canvas. Connect massive data sources like GitHub repositories or raw folders into RAG pipelines, and hook them directly into advanced multi-modal LLMs and ChatBots.
                </p>
                <i className="bi bi-diagram-3-fill position-absolute text-white opacity-25" style={{ fontSize: '12rem', right: '-20px', bottom: '-40px' }}></i>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-12 col-md-6">
              <div className="feature-card h-100 d-flex flex-column position-relative overflow-hidden">
                <span className="text-mint mb-4 font-monospace fs-5">[03] Export</span>
                <h3 className="text-white fw-light mb-4" style={{ fontSize: '2rem' }}>Compile to Production</h3>
                <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  Once your visual architecture is complete, click <strong>Download Agent</strong>. The Phoenix packager engine will compile your node graph into a production-grade Python package, complete with FastAPI headless routes and secure environment variables.
                </p>
                <i className="bi bi-box-arrow-down position-absolute text-white opacity-25" style={{ fontSize: '12rem', right: '-20px', bottom: '-40px' }}></i>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-12 col-md-6">
              <div className="feature-card h-100 d-flex flex-column position-relative overflow-hidden">
                <span className="text-mint mb-4 font-monospace fs-5">[04] Execution</span>
                <h3 className="text-white fw-light mb-4" style={{ fontSize: '2rem' }}>Run it Locally</h3>
                <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  Unzip the generated payload and execute the provided bootstrap scripts. Your agent will mount to your local hardware and begin serving requests immediately.
                </p>
                <div className="bg-dark p-4 rounded mt-auto" style={{ border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
                  <span className="text-muted">$</span> unzip my_agent.zip<br />
                  <span className="text-muted">$</span> cd my_agent<br />
                  <span className="text-muted">$</span> pip install -r requirements.txt<br />
                  <span className="text-muted">$</span> python main.py
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-5 text-center mt-5" style={{ backgroundColor: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container py-5">
          <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-title)' }}>Ready to build?</h2>
          <p className="text-muted mb-5" style={{ fontSize: '1.1rem' }}>Skip the boilerplate and start engineering intelligent workflows.</p>
          <button className="btn btn-mint d-inline-flex align-items-center gap-2 px-5 py-3 fs-5" onClick={() => navigate('/register')}>
            ENTER STUDIO <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default GuidePage;
