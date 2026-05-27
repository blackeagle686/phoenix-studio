import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NetworkCanvas from '../components/UI/NetworkCanvas';
import Footer from '../components/UI/Footer';

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [newWorkspaceType, setNewWorkspaceType] = useState('ai_agent');
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:8000/api/workspaces/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newWorkspaceName, description: newWorkspaceDesc, workspace_type: newWorkspaceType })
      });
      if (response.ok) {
        const data = await response.json();
        setShowCreateModal(false);
        setNewWorkspaceName('');
        setNewWorkspaceDesc('');
        setNewWorkspaceType('ai_agent');
        navigate(`/workspace/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
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
    <div className="w-100 min-vh-100 position-relative text-white d-flex flex-column" style={{ backgroundColor: '#050505', overflowX: 'hidden' }}>
      
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
            <button className="btn btn-outline-secondary btn-sm px-3" style={{ borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.5px' }} onClick={() => navigate('/profile')}>
              PROFILE
            </button>
            <button className="btn btn-outline-danger btn-sm px-3" style={{ borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.5px' }} onClick={logout}>
              LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <div className="container position-relative z-1 pb-5 flex-grow-1">
        
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
            <button className="btn btn-mint py-3 px-4 d-inline-flex align-items-center gap-2" style={{ borderRadius: '8px', fontSize: '1.1rem' }} onClick={() => setShowCreateModal(true)}>
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
                <button className="btn btn-outline-mint px-4 py-2" onClick={() => setShowCreateModal(true)}>
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
                        <div>
                          <h4 className="fw-bold m-0 text-white text-truncate" style={{ fontFamily: 'var(--font-title)', maxWidth: '180px' }}>
                            {ws.name}
                          </h4>
                          <span className="badge bg-dark border border-secondary text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                            {ws.workspace_type === 'ai_chatbot' ? 'AI Chatbot' : 
                             ws.workspace_type === 'multi_agent' ? 'Multi Agents' : 
                             ws.workspace_type === 'rag_system' ? 'RAG System' : 
                             ws.workspace_type === 'computer_vision' ? 'Computer Vision' :
                             ws.workspace_type === 'vlm' ? 'VLM' :
                             ws.workspace_type === 'iot' ? 'Smart Agent (IoT)' : 'AI Agent'}
                          </span>
                        </div>
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

      <div className="position-relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div 
          className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ top: 0, left: 0, zIndex: 1050, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-5 position-relative" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', background: 'rgba(15, 15, 20, 0.9)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-white fw-bold m-0" style={{ fontFamily: 'var(--font-title)' }}>Initialize Workspace</h3>
              <button 
                className="btn-close btn-close-white" 
                onClick={() => setShowCreateModal(false)}
                style={{ opacity: 0.5 }}
              ></button>
            </div>
            
            <p className="text-muted mb-4">Set up a new isolated environment for your AI agents and logic flows.</p>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Workspace Name</label>
                <input 
                  type="text" 
                  className="form-control bg-transparent text-white shadow-none" 
                  style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }}
                  placeholder="e.g. Customer Support Agent"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Workspace Type</label>
                <select 
                  className="form-select bg-transparent text-white shadow-none" 
                  style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer' }}
                  value={newWorkspaceType}
                  onChange={(e) => setNewWorkspaceType(e.target.value)}
                >
                  <option value="ai_agent" style={{ background: '#111' }}>AI Agent</option>
                  <option value="ai_chatbot" style={{ background: '#111' }}>AI Chatbot</option>
                  <option value="multi_agent" style={{ background: '#111' }}>AI Multi Agents</option>
                  <option value="rag_system" style={{ background: '#111' }}>RAG System</option>
                  <option value="computer_vision" style={{ background: '#111' }}>Computer Vision Models</option>
                  <option value="vlm" style={{ background: '#111' }}>VLMs</option>
                  <option value="iot" style={{ background: '#111' }}>Smart Agents (IoT)</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Description <span className="text-secondary text-lowercase" style={{letterSpacing:'0'}}>(optional)</span></label>
                <input 
                  type="text" 
                  className="form-control bg-transparent text-white shadow-none" 
                  style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }}
                  placeholder="What is the purpose of this workspace?"
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                />
              </div>

              <div className="d-flex gap-3 justify-content-end">
                <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-mint px-4" style={{ borderRadius: '8px' }} disabled={isCreating || !newWorkspaceName.trim()}>
                  {isCreating ? <span className="spinner-border spinner-border-sm text-dark"></span> : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
