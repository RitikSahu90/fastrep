import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: 'bi-search',
      title: 'Find Services',
      description: 'Browse through hundreds of verified local service providers in your area.',
    },
    {
      icon: 'bi-calendar-check',
      title: 'Book Instantly',
      description: 'Schedule appointments at your convenience with real-time availability.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Verified Providers',
      description: 'All service providers are verified and rated by real customers.',
    },
    {
      icon: 'bi-star-fill',
      title: 'Quality Service',
      description: 'Get top-rated professionals for all your local service needs.',
    },
  ];

  const services = [
    { icon: 'bi-house-door', name: 'Home Cleaning', color: '#0a7f7e' },
    { icon: 'bi-tools', name: 'Plumbing', color: '#3b82f6' },
    { icon: 'bi-lightning', name: 'Electrical', color: '#f59e0b' },
    { icon: 'bi-hammer', name: 'Carpentry', color: '#8b5cf6' },
    { icon: 'bi-paint-bucket', name: 'Painting', color: '#ec4899' },
    { icon: 'bi-basket', name: 'Gardening', color: '#10b981' },
    { icon: 'bi-phone', name: 'Tech Repair', color: '#6366f1' },
    { icon: 'bi-scissors', name: 'Beauty & Wellness', color: '#f97316' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-pattern">
        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6 animate-slide-left">
              <h1 className="display-3 fw-bold mb-4">
                Book Local Services
                <span className="text-gradient d-block">Instantly</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Connect with trusted service providers in your area. From home cleaning to repairs, 
                book verified professionals with just a few clicks.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {isAuthenticated() ? (
                  <>
                    <Link to="/providers" className="btn btn-primary btn-lg">
                      Browse Services
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-primary btn-lg">
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Get Started
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              <div className="stats-row mt-5 d-flex gap-4">
                <div>
                  <h3 className="fw-bold text-primary mb-0">500+</h3>
                  <p className="text-muted mb-0">Providers</p>
                </div>
                <div>
                  <h3 className="fw-bold text-primary mb-0">10K+</h3>
                  <p className="text-muted mb-0">Bookings</p>
                </div>
                <div>
                  <h3 className="fw-bold text-primary mb-0">4.8★</h3>
                  <p className="text-muted mb-0">Average Rating</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 animate-slide-right">
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop" 
                  alt="Service Provider" 
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="floating-card card position-absolute shadow-lg">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-circle bg-success text-white me-3">
                        <i className="bi bi-check-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Booking Confirmed!</h6>
                        <p className="mb-0 small text-muted">Your service is scheduled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5 animate-on-scroll">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="lead text-secondary">Get started in three simple steps</p>
          </div>
          
          <div className="row g-4">
            {[
              { step: '01', icon: 'bi-search', title: 'Search', desc: 'Browse services and find the perfect provider' },
              { step: '02', icon: 'bi-calendar-check', title: 'Book', desc: 'Select your preferred time and confirm booking' },
              { step: '03', icon: 'bi-star-fill', title: 'Enjoy', desc: 'Get quality service and rate your experience' },
            ].map((item, idx) => (
              <div key={idx} className="col-md-4 animate-on-scroll" style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="card h-100 border-0 shadow-sm card-hover text-center">
                  <div className="card-body p-4">
                    <div className="step-number text-primary mb-3">{item.step}</div>
                    <div className="icon-lg text-primary mb-3">
                      <i className={`bi ${item.icon} fs-1`}></i>
                    </div>
                    <h4 className="fw-bold mb-3">{item.title}</h4>
                    <p className="text-secondary mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features py-5">
        <div className="container py-5">
          <div className="text-center mb-5 animate-on-scroll">
            <h2 className="display-5 fw-bold mb-3">Why Choose HyperLocal</h2>
            <p className="lead text-secondary">Your trusted partner for local services</p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 animate-on-scroll" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="feature-card card h-100 border-0 shadow-sm card-hover">
                  <div className="card-body p-4 text-center">
                    <div className="feature-icon text-primary mb-3">
                      <i className={`bi ${feature.icon} fs-1`}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-secondary mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="popular-services py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5 animate-on-scroll">
            <h2 className="display-5 fw-bold mb-3">Popular Services</h2>
            <p className="lead text-secondary">Explore our most requested services</p>
          </div>
          
          <div className="row g-4">
            {services.map((service, idx) => (
              <div key={idx} className="col-lg-3 col-md-4 col-sm-6 animate-on-scroll" style={{ animationDelay: `${idx * 0.05}s` }}>
                <Link to="/providers" className="text-decoration-none">
                  <div className="service-card card h-100 border-0 shadow-sm card-hover">
                    <div className="card-body p-4 text-center">
                      <div className="service-icon mb-3" style={{ color: service.color }}>
                        <i className={`bi ${service.icon} fs-1`}></i>
                      </div>
                      <h6 className="fw-bold mb-0">{service.name}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-gradient-primary text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8 animate-on-scroll">
              <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-0">
                Join thousands of satisfied customers and book your service today.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0 animate-on-scroll">
              {isAuthenticated() ? (
                <Link to="/providers" className="btn btn-light btn-lg">
                  Browse Services
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              ) : (
                <Link to="/register" className="btn btn-light btn-lg">
                  Sign Up Now
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .hero-image-container {
          position: relative;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .floating-card {
          bottom: 20px;
          right: 20px;
          animation: slideUp 0.8s ease-out 1s both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-number {
          font-size: 3rem;
          font-weight: 800;
          font-family: var(--font-display);
          opacity: 0.2;
        }

        .feature-icon, .service-icon {
          transition: var(--transition-base);
        }

        .feature-card:hover .feature-icon,
        .service-card:hover .service-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .stats-row > div {
          animation: fadeIn 1s ease-out forwards;
        }

        .stats-row > div:nth-child(1) { animation-delay: 0.2s; }
        .stats-row > div:nth-child(2) { animation-delay: 0.4s; }
        .stats-row > div:nth-child(3) { animation-delay: 0.6s; }

        .animate-on-scroll {
          opacity: 0;
        }

        @media (max-width: 991px) {
          .hero-section .row {
            min-height: auto;
          }
          
          .floating-card {
            position: relative !important;
            bottom: auto;
            right: auto;
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
