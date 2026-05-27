import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NetworkCanvas from '../components/UI/NetworkCanvas';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      {/* Hero Section */}
      <section className="position-relative vh-100 d-flex flex-column justify-content-center" style={{ paddingTop: '80px' }}>
        <NetworkCanvas />
        <div className="container-fluid px-5 position-relative z-1" style={{ maxWidth: '1400px' }}>
          <div className="row">
            <div className="col-12 col-lg-8">
              <h1 className="hero-text mb-4">
                BUILD AGENTS<br />THAT THINK LIKE<br />HUMANS
              </h1>
              <p className="text-light opacity-75 mb-5" style={{ fontSize: '1.2rem', maxWidth: '400px', lineHeight: '1.6' }}>
                Synthetically trained. Symbolically steered. Deploy AI agents that adapt, act, and learn.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-mint d-flex align-items-center gap-2" onClick={() => navigate('/register')}>
                  TRY AGENT LIVE <i className="bi bi-arrow-up-right"></i>
                </button>
                <button className="btn btn-outline-mint" onClick={() => navigate('/login')}>
                  EXPLORE S. ENGINE
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Subtle gradient overlay on bottom to fade into next section */}
        <div className="position-absolute bottom-0 w-100" style={{ height: '200px', background: 'linear-gradient(to bottom, transparent, #050505)' }}></div>
      </section>

      {/* Logos and Stats Section */}
      <section className="py-5" style={{ backgroundColor: '#050505' }}>
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <p className="text-center text-muted mb-5" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Trusted by 8,000+ users from</p>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 mb-5 opacity-50" style={{ filter: 'grayscale(100%) brightness(200%)' }}>
            <span className="fs-4 fw-bold">swile</span>
            <span className="fs-4 fw-bold"><i className="bi bi-heart-pulse"></i> Hinge Health</span>
            <span className="fs-4 fw-bold">Polestar</span>
            <span className="fs-4 fw-bold">MERCK</span>
            <span className="fs-4 fw-bold">SEMRUSH</span>
            <span className="fs-4 fw-bold">NBCUniversal</span>
            <span className="fs-4 fw-bold">Klarna</span>
          </div>

          <div className="row mt-5 pt-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
            <div className="col-12 col-md-6 mb-5">
              <h3 className="text-white fw-light mb-0" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                The technology framework<br />behind human-like AI<br />cognition
              </h3>
            </div>
            <div className="col-12 col-md-6 mb-5 d-flex flex-column justify-content-center">
              <p className="text-light opacity-75 mb-4" style={{ fontSize: '1.1rem', maxWidth: '400px' }}>
                PHOENIX-AI's modular engine allows your agents to reason through logic, learn from memory, and operate within real-world tools.
              </p>
              <div>
                <button className="btn btn-light rounded-1 px-4 py-2 fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }} onClick={() => navigate('/login')}>
                  LAUNCH AGENT <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-4 mt-2">
            <div className="col-12 col-md-4">
              <div className="feature-card d-flex flex-column justify-content-center">
                <div className="stat-block">
                  <h2>97<span className="text-white">%</span></h2>
                </div>
                <p className="text-muted mt-3 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.5rem' }}></i> Task success in tool chains
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card d-flex flex-column justify-content-center">
                <div className="stat-block">
                  <h2>88<span className="text-white">%</span></h2>
                </div>
                <p className="text-muted mt-3 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.5rem' }}></i> Reasoning accuracy over time
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card d-flex flex-column justify-content-center">
                <div className="stat-block">
                  <h2>3<span className="text-white">x</span></h2>
                </div>
                <p className="text-muted mt-3 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.5rem' }}></i> Faster domain adaptation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-5 my-5">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <div className="row">
            <div className="col-12 col-lg-10">
              <h2 className="manifesto-text mb-5">
                We're not building flashy demos. We're<br />
                engineering agents that think like humans,<br />
                and work better with them.
              </h2>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 col-lg-6 offset-lg-6">
              <p className="text-light mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                At <span className="text-mint">PHOENIX-AI</span>, we believe intelligence isn't just about generating answers—it's about understanding context, reasoning through complexity, and acting with intent.
              </p>
              <p className="text-light opacity-75" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                True AI should be controllable, predictable in behavior, steerable by design, and fully auditable in every step. It must be context-aware, able to learn from interactions and adapt over time. And it has to be tool-native, seamlessly operating within real environments, not isolated sandboxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-5 mb-5">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <p className="text-mint text-uppercase fw-bold mb-3" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>OUR PILLARS</p>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <h2 className="text-white fw-light m-0" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
              Designed to grow and<br />adapt
            </h2>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}><i className="bi bi-arrow-left"></i></button>
              <button className="btn btn-outline-secondary rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}><i className="bi bi-arrow-right"></i></button>
            </div>
          </div>

          <div className="row g-4 flex-nowrap overflow-auto pb-3" style={{ scrollSnapType: 'x mandatory' }}>
            {/* Card 1 */}
            <div className="col-11 col-md-6 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
              <div className="feature-card d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[01]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-hdd-network" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Context Memory</h4>
                <p className="text-muted small mb-0">Agents learn what matters across sessions.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-11 col-md-6 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
              <div className="feature-card d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[02]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-lightning-charge" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Toolchain Mastery</h4>
                <p className="text-muted small mb-0">Plug-and-play with your real workflows.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-11 col-md-6 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
              <div className="feature-card d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[03]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-gear-wide-connected" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Symbolic Control</h4>
                <p className="text-muted small mb-0">Rule the agents, steer the logic.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-11 col-md-6 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
              <div className="feature-card d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[04]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-braces" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Dynamic APIs</h4>
                <p className="text-muted small mb-0">Connect, extend, and deploy anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-5 text-center" style={{ backgroundColor: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container py-5">
          <h2 className="text-white mb-4">Test the mind of our AI agent</h2>
          <p className="text-muted mb-5">Test how our agents think and operate within real tools, without the noise or gimmicks.</p>
          <button className="btn btn-mint d-inline-flex align-items-center gap-2" onClick={() => navigate('/register')}>
            TRY AGENT LIVE <i className="bi bi-arrow-up-right"></i>
          </button>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
