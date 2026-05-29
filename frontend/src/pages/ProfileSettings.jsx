import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NetworkCanvas from '../components/UI/NetworkCanvas';
import Footer from '../components/UI/Footer';
import { baseurl } from '../context/AuthContext'; 

function ProfileSettings() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    phone_number: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        location: user.location || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'danger', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
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
          <Link className="navbar-brand text-white fw-bold d-inline-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '1px' }} to="/dashboard">
            <i className="bi bi-circle-fill text-mint" style={{ fontSize: '0.8rem' }}></i> PHOENIX-AI
          </Link>
          <div className="d-flex align-items-center gap-4">
            <span className="text-muted d-none d-md-inline" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              OPERATOR: <strong className="text-white ms-1">{user?.username}</strong>
            </span>
            <button className="btn btn-outline-secondary btn-sm px-3" style={{ borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.5px' }} onClick={() => navigate('/dashboard')}>
              DASHBOARD
            </button>
            <button className="btn btn-outline-danger btn-sm px-3" style={{ borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.5px' }} onClick={logout}>
              LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <div className="container position-relative z-1 pb-5 flex-grow-1">
        <div className="row justify-content-center pt-4">
          <div className="col-lg-8">
            <h1 className="hero-text text-white mb-2" style={{ fontSize: '3.5rem', letterSpacing: '-1px' }}>
              OPERATOR <span className="text-mint">SETTINGS</span>
            </h1>
            <p className="text-muted mb-5" style={{ fontSize: '1.2rem' }}>
              Manage your personal credentials and contact information.
            </p>

            <div className="glass-panel p-5" style={{ borderRadius: '16px', background: 'rgba(15, 15, 20, 0.9)' }}>
              {message.text && (
                <div className={`alert alert-${message.type} py-3 mb-4 d-flex align-items-center gap-2`} style={message.type === 'danger' ? { background: 'rgba(255, 95, 86, 0.1)', border: '1px solid rgba(255, 95, 86, 0.3)', color: '#ff5f56' } : { background: 'rgba(114, 239, 221, 0.1)', border: '1px solid rgba(114, 239, 221, 0.3)', color: '#72EFDD' }}>
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>First Name</label>
                    <input type="text" name="first_name" className="form-control bg-transparent text-white shadow-none" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }} value={formData.first_name} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Last Name</label>
                    <input type="text" name="last_name" className="form-control bg-transparent text-white shadow-none" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }} value={formData.last_name} onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
                  <input type="email" name="email" className="form-control bg-transparent text-white shadow-none" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }} value={formData.email} onChange={handleChange} />
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Location</label>
                    <input type="text" name="location" className="form-control bg-transparent text-white shadow-none" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }} value={formData.location} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Phone Number</label>
                    <input type="text" name="phone_number" className="form-control bg-transparent text-white shadow-none" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }} value={formData.phone_number} onChange={handleChange} />
                  </div>
                </div>

                <div className="d-flex gap-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                  <button type="submit" className="btn btn-mint px-5 py-2 fw-bold" style={{ borderRadius: '8px' }} disabled={isLoading}>
                    {isLoading ? <span className="spinner-border spinner-border-sm text-dark"></span> : 'SAVE SETTINGS'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => navigate('/dashboard')}>
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="position-relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </div>
  );
}

export default ProfileSettings;
