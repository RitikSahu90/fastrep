import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setApiError('');
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    setLoading(true);
    setApiError('');

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await authAPI.register(registrationData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page min-vh-100 d-flex align-items-center bg-pattern py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 animate-scale">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-person-plus text-primary fs-1"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-secondary">Join thousands of satisfied customers</p>
                </div>

                {apiError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {apiError}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setApiError('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="phone" className="form-label">
                        Phone Number <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="terms"
                        required
                      />
                      <label className="form-check-label text-secondary small" htmlFor="terms">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-secondary mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                </div>

                <div className="divider my-4">
                  <span className="divider-text">OR</span>
                </div>

                <div className="social-login">
                  <button className="btn btn-outline-secondary w-100 mb-2">
                    <i className="bi bi-google me-2"></i>
                    Continue with Google
                  </button>
                  <button className="btn btn-outline-secondary w-100">
                    <i className="bi bi-facebook me-2"></i>
                    Continue with Facebook
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="text-secondary text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          background: linear-gradient(135deg, var(--light) 0%, var(--light-secondary) 100%);
        }

        .card {
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .auth-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(10, 127, 126, 0.1) 0%, rgba(10, 127, 126, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .divider {
          position: relative;
          text-align: center;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--light-secondary);
        }

        .divider-text {
          position: relative;
          background: white;
          padding: 0 1rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 0.2rem rgba(10, 127, 126, 0.1);
        }

        .social-login .btn {
          font-weight: 600;
          transition: var(--transition-base);
        }

        .social-login .btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .alert {
          border-radius: var(--radius-lg);
          border: none;
        }

        .form-check-input:checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Register;
