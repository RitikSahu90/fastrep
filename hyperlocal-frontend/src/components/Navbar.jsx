import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, getUser } from '../utils/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-icon me-2">
            <i className="bi bi-geo-alt-fill text-primary fs-3"></i>
          </div>
          <span className="fw-bold fs-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            HyperLocal
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          {authenticated ? (
            <>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 ${isActive('/dashboard')}`} 
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 ${isActive('/bookings')}`} 
                    to="/bookings"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-calendar-check me-1"></i>
                    Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 ${isActive('/providers')}`} 
                    to="/providers"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-people me-1"></i>
                    Providers
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center px-3"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="avatar-circle me-2">
                      <i className="bi bi-person-circle fs-4"></i>
                    </div>
                    {user?.name || 'User'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setIsOpen(false)}>
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className="nav-link px-3" 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="btn btn-primary ms-lg-2" 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          padding: 1rem 0;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95) !important;
        }

        .navbar-brand {
          font-weight: 800;
          font-size: 1.5rem;
          transition: var(--transition-base);
        }

        .navbar-brand:hover {
          transform: scale(1.05);
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-base);
          position: relative;
          font-family: var(--font-body);
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link.active {
          color: var(--primary);
          font-weight: 600;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
        }

        .avatar-circle {
          color: var(--primary);
        }

        .dropdown-menu {
          border-radius: var(--radius-lg);
          margin-top: 0.5rem;
          min-width: 200px;
        }

        .dropdown-item {
          padding: 0.75rem 1.25rem;
          transition: var(--transition-base);
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: var(--light);
          color: var(--primary);
        }

        .dropdown-item.text-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            margin-top: 1rem;
            padding: 1rem 0;
          }

          .nav-link {
            padding: 0.75rem 1rem !important;
          }

          .btn-primary {
            margin-top: 0.5rem;
            margin-left: 0 !important;
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
