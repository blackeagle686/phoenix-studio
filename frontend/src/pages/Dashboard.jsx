import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NetworkCanvas from '../components/UI/NetworkCanvas';

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/workspaces/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createWorkspace = async () => {
    const name = prompt("Enter a name for the new workspace:");
    if (!name) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/workspaces/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, description: '' })
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/workspace/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWorkspace = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this workspace?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/workspaces/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchWorkspaces();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-100 min-vh-100 position-relative text-white" style={{ backgroundColor: '#050505', overflowX: 'hidden' }}>
      
      {/* Background Interactive Net & Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4, zIndex: 0, background: 'linear-gradient(180deg, rgba(8,8,16,1) 0%, rgba(105,48,195,0.05) 50%, rgba(5,5,5,1) 100%)' }}>
        <NetworkCanvas />
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg py-4 px-5 position-relative z-1 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/">
            <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
          </Link>
          <div className="d-flex align-items-center gap-4">
            <span className="text-muted d-none d-md-inline" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              OPERATOR: <strong className="text-white ms-1">{user?.username}</strong>
            </span>
            <button className="btn btn-outline-danger btn-sm px-3" style={{ borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.5px' }} onClick={logout}>
              LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <div className="container position-relative z-1 pb-5">
        
        {/* Dashboard Hero */}
        <div className="row mb-5 align-items-center pt-3">
          <div className="col-lg-8">
            <h1 className="hero-text text-white mb-2" style={{ fontSize: '4rem', letterSpacing: '-2px' }}>
              COMMAND <span className="text-mint">CENTER</span>
            </h1>
            <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
              Manage your active AI agents, orchestrate complex workflows, and deploy your autonomous systems.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <button className="btn btn-mint py-3 px-4 d-inline-flex align-items-center gap-2" style={{ borderRadius: '8px', fontSize: '1.1rem' }} onClick={createWorkspace}>
              <i className="bi bi-plus-circle-fill"></i> CREATE WORKSPACE
            </button>
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="row g-4">
          {workspaces.length === 0 ? (
            <div className="col-12">
              <div className="glass-panel text-center py-5" style={{ borderRadius: '16px', borderStyle: 'dashed' }}>
                <i className="bi bi-diagram-3 text-muted display-3 mb-4 d-block opacity-50"></i>
                <h3 className="text-white fw-bold mb-2" style={{ fontFamily: 'var(--font-title)' }}>No Active Workspaces</h3>
                <p className="text-muted mb-4">Initialize your first AI agent or logic flow to get started.</p>
                <button className="btn btn-outline-mint px-4 py-2" onClick={createWorkspace}>
                  Initialize Workspace
                </button>
              </div>
            </div>
          ) : (
            workspaces.map(ws => (
              <div key={ws.id} className="col-lg-4 col-md-6">
                <div 
                  className="feature-card d-flex flex-column h-100 position-relative overflow-hidden" 
                  style={{ cursor: 'pointer', background: 'rgba(20, 20, 25, 0.6)', backdropFilter: 'blur(10px)' }}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'rgba(114, 239, 221, 0.4)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(114, 239, 221, 0.1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded p-2 bg-dark" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        <i className="bi bi-cpu text-mint fs-5"></i>
                      </div>
                      <h4 className="fw-bold m-0 text-white text-truncate" style={{ fontFamily: 'var(--font-title)', maxWidth: '180px' }}>
                        {ws.name}
                      </h4>
                    </div>
                    <button 
                      className="btn btn-sm btn-link text-danger p-0 m-0 opacity-75" 
                      style={{ zIndex: 2, transition: 'opacity 0.2s' }} 
                      onClick={(e) => deleteWorkspace(ws.id, e)}
                      onMouseOver={e => e.currentTarget.style.opacity = '1'}
                      onMouseOut={e => e.currentTarget.style.opacity = '0.75'}
                    >
                      <i className="bi bi-trash3-fill fs-5"></i>
                    </button>
                  </div>
                  
                  <p className="text-muted flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {ws.description || "Unconfigured logic flow. Open to assemble AI nodes."}
                  </p>
                  
                  <div className="mt-4 pt-3 d-flex align-items-center justify-content-between border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                      <i className="bi bi-clock-history me-2"></i>
                      {new Date(ws.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <i className="bi bi-arrow-right text-mint"></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
