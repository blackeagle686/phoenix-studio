import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    <div className="w-100 min-vh-100 position-relative text-white">
      <div className="ambient-bg"></div>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg glass-panel py-3 px-4 position-relative z-1 mb-5" style={{ borderRadius: '0 0 20px 20px' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand d-flex align-items-center text-white fw-bold" style={{ fontFamily: 'var(--font-title)' }}>
            <i className="bi bi-circle-fill text-mint me-2 fs-6"></i>
            PHOENIX-AI <span className="text-mint ms-2">STUDIO</span>
          </span>
          <div className="d-flex align-items-center gap-3 text-light fw-semibold">
            <span>Welcome, <strong className="text-mint">{user?.username}</strong>!</span>
            <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: '8px' }} onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container position-relative z-1">
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h2 className="fw-bold m-0 text-white" style={{ fontFamily: 'var(--font-title)' }}>Your Workspaces</h2>
          <button className="btn btn-mint fw-bold" onClick={createWorkspace}>
            <i className="bi bi-plus-lg me-2"></i>New Workspace
          </button>
        </div>

        <div className="row g-4">
          {workspaces.length === 0 ? (
            <div className="col-12 text-center py-5 glass-panel" style={{ borderRadius: '16px' }}>
              <i className="bi bi-folder2-open display-1 text-secondary mb-3"></i>
              <h4 className="text-light fw-semibold">No workspaces found</h4>
              <p className="text-muted">Create a new workspace to start building agents.</p>
            </div>
          ) : (
            workspaces.map(ws => (
              <div key={ws.id} className="col-md-4">
                <div 
                  className="glass-panel p-4 d-flex flex-column h-100" 
                  style={{ borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(114, 239, 221, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(114, 239, 221, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold m-0 text-white text-truncate flex-grow-1 me-2">{ws.name}</h5>
                    <button className="btn btn-sm btn-link text-danger p-0 m-0" style={{ zIndex: 2 }} onClick={(e) => deleteWorkspace(ws.id, e)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <p className="text-light opacity-75 small mb-4 flex-grow-1">{ws.description || "No description provided."}</p>
                  <div className="text-secondary small">
                    <i className="bi bi-clock me-1"></i>
                    Updated: {new Date(ws.updated_at).toLocaleDateString()}
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
