import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login(formData);
      
      // Since your backend returns the User object directly
      const user = response.data; 
      
      // Mock token for interceptors
      const token = 'mock-session-token';
      
      setAuthToken(token);
      setUser(user); 
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setApiError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center bg-pattern">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 animate-scale">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-box-arrow-in-right text-primary fs-1"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-secondary">Sign in to your account to continue</p>
                </div>

                {apiError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {apiError}
                    <button type="button" className="btn-close" onClick={() => setApiError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label text-secondary" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" title="Forgot Password?" className="text-primary text-decoration-none small">Forgot Password?</Link>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
                    ) : (
                      <>Sign In<i className="bi bi-arrow-right ms-2"></i></>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-secondary mb-0">
                    Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Sign up</Link>
                  </p>
                </div>

                <div className="divider my-4"><span className="divider-text">OR</span></div>

                <div className="social-login">
                  <button className="btn btn-outline-secondary w-100 mb-2"><i className="bi bi-google me-2"></i>Continue with Google</button>
                  <button className="btn btn-outline-secondary w-100"><i className="bi bi-facebook me-2"></i>Continue with Facebook</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
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
      `}</style>
    </div>
  );
};

export default Login;
