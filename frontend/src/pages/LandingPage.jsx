import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NetworkCanvas from '../components/UI/NetworkCanvas';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';
import heroImg from '../assets/phx-std-net-nobg.png';
import flowExampleImg from '../assets/flow-example.png';
function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const sections = document.querySelectorAll('.fade-up-section');
    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      {/* Merged Hero Section */}
      <section className="position-relative min-vh-100 d-flex align-items-center" style={{ paddingTop: '100px', paddingBottom: '80px', backgroundColor: '#050505' }}>
        <NetworkCanvas />
        <div className="container-fluid px-5 position-relative z-1" style={{ maxWidth: '1400px' }}>
          <div className="row align-items-center">
            
            {/* Left Column: Title, Headline, Description, CTAs */}
            <div className="col-lg-7 text-start fade-up-section is-visible">
              <div className="fw-bold mb-3" style={{
                fontSize: 'clamp(2.8rem, 5vw, 4.8rem)',
                letterSpacing: '4px',
                fontFamily: 'var(--font-title)',
                background: 'linear-gradient(135deg, rgba(114,239,221,1) 0%, rgba(155,81,224,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none'
              }}>
                PHOENIX-AI
              </div>
              
              <h1 className="hero-text text-start mb-4" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.8rem)', textTransform: 'uppercase', lineHeight: '1.1' }}>
                BUILD AGENTS THAT<br />THINK LIKE HUMANS
              </h1>
              
              <p className="text-light opacity-75 mb-5" style={{ fontSize: '1.15rem', maxWidth: '600px', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
                Synthetically trained. Symbolically steered. Deploy AI agents that adapt, act, and learn.
              </p>
              
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-mint d-flex align-items-center gap-2 px-4 py-3" onClick={() => navigate('/register')}>
                  TRY AGENT LIVE <i className="bi bi-arrow-up-right"></i>
                </button>
                <button className="btn btn-outline-mint px-4 py-3" onClick={() => navigate('/login')}>
                  EXPLORE S. ENGINE
                </button>
              </div>
            </div>
            
            {/* Right Column: 3D Hero Image */}
            <div className="col-lg-5 text-center text-lg-end mt-5 mt-lg-0 position-relative">
              <div className="position-absolute w-100 h-100 rounded-circle start-50 top-50 translate-middle" style={{ background: 'radial-gradient(circle, rgba(114,239,221,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0, width: '400px', height: '400px' }}></div>
              <img src={heroImg} alt="Phoenix AI Agent" className="hero-image-3d position-relative z-1 img-fluid" style={{ maxWidth: '480px', objectFit: 'contain' }} />
            </div>
            
          </div>
        </div>
        
        {/* Scroll indicator pointing to the next section */}
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-none d-lg-flex flex-column align-items-center justify-content-center text-muted"
          style={{ cursor: 'pointer', zIndex: 2, transform: 'translateY(-20px)', animation: 'float3d 3s ease-in-out infinite' }}
          onClick={() => document.getElementById('logos-section').scrollIntoView({ behavior: 'smooth' })}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Scroll to Explore</span>
          <i className="bi bi-chevron-down fs-5 text-mint"></i>
        </div>
        
        <div className="position-absolute bottom-0 w-100" style={{ height: '100px', background: 'linear-gradient(to bottom, transparent, #050505)' }}></div>
      </section>
 
       {/* Logos and Stats Section */}
       <section id="logos-section" className="py-5 fade-up-section" style={{ backgroundColor: '#050505' }}>
         <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <p className="text-center text-muted mb-5" style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Powering next-generation solutions across</p>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 mb-5 opacity-75">
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-robot fs-4 text-mint"></i> Robotics</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-heart-pulse fs-4 text-mint"></i> Healthcare AI</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-bank fs-4 text-mint"></i> FinTech</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-car-front fs-4 text-mint"></i> Autonomous Mobility</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-shield-lock fs-4 text-mint"></i> Cybersecurity</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-boxes fs-4 text-mint"></i> Supply Chain</span>
            <span className="fs-5 fw-bold d-flex align-items-center gap-2"><i className="bi bi-controller fs-4 text-mint"></i> Gaming AI</span>
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
                  Build it now <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-4 mt-2">
            
            {/* Stat Card 1 */}
            <div className="col-12 col-md-4">
              <div className="feature-card hover-lift-card d-flex flex-column justify-content-center p-5 position-relative overflow-hidden" style={{
                background: 'rgba(15, 15, 20, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '220px',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className="position-absolute top-0 start-0 w-100" style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--palette-9), var(--palette-7))',
                  opacity: 0.8
                }}></div>
                <div className="stat-block">
                  <h2 className="display-1 fw-bold mb-0" style={{
                    fontFamily: 'var(--font-title)',
                    background: 'linear-gradient(135deg, var(--palette-9) 0%, var(--palette-7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-2px',
                    lineHeight: '1'
                  }}>
                    97<span className="fw-light" style={{ WebkitTextFillColor: '#ffffff', color: '#ffffff', opacity: 0.8 }}>%</span>
                  </h2>
                </div>
                <p className="text-light opacity-75 mt-3 mb-0 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-cpu-fill text-mint fs-5"></i> Task success in tool chains
                </p>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="col-12 col-md-4">
              <div className="feature-card hover-lift-card d-flex flex-column justify-content-center p-5 position-relative overflow-hidden" style={{
                background: 'rgba(15, 15, 20, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '220px',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className="position-absolute top-0 start-0 w-100" style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--palette-7), var(--palette-5))',
                  opacity: 0.8
                }}></div>
                <div className="stat-block">
                  <h2 className="display-1 fw-bold mb-0" style={{
                    fontFamily: 'var(--font-title)',
                    background: 'linear-gradient(135deg, var(--palette-7) 0%, var(--palette-5) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-2px',
                    lineHeight: '1'
                  }}>
                    88<span className="fw-light" style={{ WebkitTextFillColor: '#ffffff', color: '#ffffff', opacity: 0.8 }}>%</span>
                  </h2>
                </div>
                <p className="text-light opacity-75 mt-3 mb-0 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-brain-fill text-mint fs-5"></i> Reasoning accuracy over time
                </p>
              </div>
            </div>
            
            {/* Stat Card 3 */}
            <div className="col-12 col-md-4">
              <div className="feature-card hover-lift-card d-flex flex-column justify-content-center p-5 position-relative overflow-hidden" style={{
                background: 'rgba(15, 15, 20, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '220px',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div className="position-absolute top-0 start-0 w-100" style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--palette-5), var(--palette-9))',
                  opacity: 0.8
                }}></div>
                <div className="stat-block">
                  <h2 className="display-1 fw-bold mb-0" style={{
                    fontFamily: 'var(--font-title)',
                    background: 'linear-gradient(135deg, var(--palette-5) 0%, var(--palette-9) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-2px',
                    lineHeight: '1'
                  }}>
                    3<span className="fw-light" style={{ WebkitTextFillColor: '#ffffff', color: '#ffffff', opacity: 0.8 }}>x</span>
                  </h2>
                </div>
                <p className="text-light opacity-75 mt-3 mb-0 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-lightning-charge-fill text-mint fs-5"></i> Faster domain adaptation
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-5 my-5 fade-up-section">
        <div className="container-fluid px-5" style={{ maxWidth: '1400px' }}>
          <div className="row">
            <div className="col-12 col-lg-10">
              <div className="mb-5" style={{ maxWidth: '1000px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: '300',
                  fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
                  lineHeight: '1.4',
                  letterSpacing: '-0.01em',
                  color: '#e2e8f0',
                  textWrap: 'balance'
                }}>
                  We're <strong style={{color: 'green'}}>not</strong> building flashy demos. <br className="d-none d-md-block" />
                  We're building <strong style={{
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--palette-9) 0%, var(--palette-6) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(114, 239, 221, 0.2)'
                  }}>engineering agents</strong> that think like humans, and work better with them.
                </h2>
              </div>
            </div>
          </div>
          <div className="row mt-5 align-items-center">
            <div className="col-12 col-lg-6 mb-5 mb-lg-0 pe-lg-5">
              <div className="position-relative">
                <div className="position-absolute w-100 h-100 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(114,239,221,0.2) 0%, rgba(155,81,224,0.15) 100%)', filter: 'blur(30px)', zIndex: 0 }}></div>
                <img src={flowExampleImg} alt="Workflow Example" className="img-fluid rounded-4 position-relative z-1 hover-scale-img" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
              </div>
            </div>
            <div className="col-12 col-lg-6 ps-lg-4">
              <p className="text-light mb-4" style={{ fontSize: '1.15rem', lineHeight: '1.8', fontFamily: 'var(--font-body)' }}>
                At <span className="text-mint fw-bold">PHOENIX-AI</span>, we believe intelligence isn't just about generating answers—it's about understanding context, reasoning through complexity, and acting with intent.
              </p>
              <p className="text-muted opacity-80" style={{ fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'var(--font-body)' }}>
                True AI should be controllable, predictable in behavior, steerable by design, and fully auditable in every step. It must be context-aware, able to learn from interactions and adapt over time. And it has to be tool-native, seamlessly operating within real environments, not isolated sandboxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-5 mb-5 fade-up-section">
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
            <div className="col-11 col-md-6 col-lg-3 fade-up-section" style={{ scrollSnapAlign: 'start', transitionDelay: '0.1s' }}>
              <div className="feature-card d-flex flex-column h-100 hover-lift-card" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[01]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-diagram-3" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Multi-Agent Teams</h4>
                <p className="text-muted small mb-0">Orchestrate cooperative teams of specialized agents.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-11 col-md-6 col-lg-3 fade-up-section" style={{ scrollSnapAlign: 'start', transitionDelay: '0.2s' }}>
              <div className="feature-card d-flex flex-column h-100 hover-lift-card" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[02]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-eye" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">Computer Vision</h4>
                <p className="text-muted small mb-0">Equip agents with VLM models to see and analyze visual data.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-11 col-md-6 col-lg-3 fade-up-section" style={{ scrollSnapAlign: 'start', transitionDelay: '0.3s' }}>
              <div className="feature-card d-flex flex-column h-100 hover-lift-card" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[03]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-database-check" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">RAG Systems</h4>
                <p className="text-muted small mb-0">Ground agent intelligence with real-time vector retrieval.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-11 col-md-6 col-lg-3 fade-up-section" style={{ scrollSnapAlign: 'start', transitionDelay: '0.4s' }}>
              <div className="feature-card d-flex flex-column h-100 hover-lift-card" style={{ minHeight: '400px' }}>
                <span className="text-muted mb-4">[04]</span>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center opacity-50 my-4">
                  <i className="bi bi-router" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.1)' }}></i>
                </div>
                <h4 className="text-white mb-3">IoT & Hardware</h4>
                <p className="text-muted small mb-0">Deploy smart agents directly to embedded devices and sensors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-5 text-center fade-up-section" style={{ backgroundColor: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container py-5">
          <h2 className="text-white mb-4">Test the mind of our AI agent</h2>
          <p className="text-muted mb-5">Test how our agents think and operate within real tools, without the noise or gimmicks.</p>
          <button className="btn btn-mint d-inline-flex align-items-center gap-2" onClick={() => navigate('/register')}>
            TRY AGENT LIVE <i className="bi bi-arrow-up-right"></i>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
