import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authAPI } from '../services/api';
import { getUser, setUser, logout } from '../utils/auth';
import Loading from '../components/Loading';

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = getUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
      setOriginalData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Use localStorage data if API fails
      if (currentUser) {
        setFormData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await userAPI.updateProfile(formData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      setOriginalData(formData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage(
        err.response?.data?.message ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading profile..." />;
  }

  return (
    <div className="profile-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-4 animate-fade-in">
              <div className="profile-avatar mb-3">
                <i className="bi bi-person-circle text-primary fs-1"></i>
              </div>
              <h1 className="display-6 fw-bold mb-2">My Profile</h1>
              <p className="text-secondary">Manage your account information</p>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show animate-fade-in" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMessage('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show animate-fade-in" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errorMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorMessage('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Profile Card */}
            <div className="card border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="card-header bg-white border-0 py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold">
                    <i className="bi bi-person-badge me-2"></i>
                    Personal Information
                  </h4>
                  {!isEditing && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-4">
                    <div className="col-12">
                      <label htmlFor="name" className="form-label">
                        <i className="bi bi-person me-2"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        <i className="bi bi-telephone me-2"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <label htmlFor="address" className="form-label">
                        <i className="bi bi-geo-alt me-2"></i>
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                      ></textarea>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="d-flex gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg flex-grow-1"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg flex-grow-1"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Account Actions */}
            <div className="row g-4 mt-4">
              <div className="col-md-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 text-center">
                    <div className="action-icon bg-warning bg-opacity-10 text-warning mb-3">
                      <i className="bi bi-key fs-3"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Change Password</h5>
                    <p className="text-secondary mb-3 small">Update your account password</p>
                    <button className="btn btn-outline-warning">
                      <i className="bi bi-shield-lock me-2"></i>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4 text-center">
                    <div className="action-icon bg-danger bg-opacity-10 text-danger mb-3">
                      <i className="bi bi-box-arrow-right fs-3"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Logout</h5>
                    <p className="text-secondary mb-3 small">Sign out from your account</p>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(10, 127, 126, 0.1) 0%, rgba(10, 127, 126, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .profile-avatar i {
          font-size: 4rem;
        }

        .form-control:disabled,
        .form-control[readonly] {
          background-color: var(--light);
          cursor: not-allowed;
        }

        .action-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .card {
          transition: var(--transition-base);
        }

        .form-label {
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 0.2rem rgba(10, 127, 126, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Profile;
