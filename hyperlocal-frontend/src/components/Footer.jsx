import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-3">
              <i className="bi bi-geo-alt-fill text-primary fs-2 me-2"></i>
              <span className="fs-4 fw-bold">HyperLocal</span>
            </div>
            <p className="text-secondary mb-3">
              Your trusted platform for booking local services instantly. Connect with verified service providers in your area.
            </p>
            <div className="social-links">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle me-2">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle me-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle me-2">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/providers" className="footer-link">Browse Services</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="footer-link">Home Cleaning</span>
              </li>
              <li className="mb-2">
                <span className="footer-link">Plumbing</span>
              </li>
              <li className="mb-2">
                <span className="footer-link">Electrical</span>
              </li>
              <li className="mb-2">
                <span className="footer-link">Carpentry</span>
              </li>
              <li className="mb-2">
                <span className="footer-link">Beauty & Wellness</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-start">
                <i className="bi bi-envelope me-2 mt-1"></i>
                <span className="text-secondary">support@hyperlocal.com</span>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <i className="bi bi-telephone me-2 mt-1"></i>
                <span className="text-secondary">+1 (555) 123-4567</span>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <i className="bi bi-geo-alt me-2 mt-1"></i>
                <span className="text-secondary">123 Service Street, City, ST 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-secondary">
              © {currentYear} HyperLocal. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="footer-link me-3">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: 4rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .footer-brand {
          font-family: var(--font-display);
          display: flex;
          align-items: center;
        }

        .footer-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition-base);
          cursor: pointer;
        }

        .footer-link:hover {
          color: var(--primary-light);
          padding-left: 5px;
        }

        .social-links .btn {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: var(--transition-base);
        }

        .social-links .btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          transform: translateY(-3px);
        }

        h5 {
          font-family: var(--font-display);
          color: white;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
