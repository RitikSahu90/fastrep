import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { providerAPI } from '../services/api';
import Loading from '../components/Loading';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');

  const services = [
    'All',
    'Home Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Gardening',
    'Tech Repair',
    'Beauty & Wellness',
  ];

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchQuery, serviceFilter]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getAllProviders();
      setProviders(response.data);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = [...providers];

    // Service filter
    if (serviceFilter !== 'All') {
      filtered = filtered.filter(provider => 
        provider.service?.toLowerCase() === serviceFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProviders(filtered);
  };

  const getServiceIcon = (service) => {
    const icons = {
      'Home Cleaning': 'bi-house-door',
      'Plumbing': 'bi-tools',
      'Electrical': 'bi-lightning',
      'Carpentry': 'bi-hammer',
      'Painting': 'bi-paint-bucket',
      'Gardening': 'bi-basket',
      'Tech Repair': 'bi-phone',
      'Beauty & Wellness': 'bi-scissors',
    };
    return icons[service] || 'bi-briefcase';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    return stars;
  };

  if (loading) {
    return <Loading fullScreen message="Loading providers..." />;
  }

  return (
    <div className="providers-page py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4 animate-fade-in">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-6 fw-bold mb-2">Find Service Providers</h1>
              <p className="text-secondary lead">Browse and connect with verified local professionals</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="row mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-3 align-items-center">
                  <div className="col-lg-6">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search providers by name or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <select
                      className="form-select form-select-lg"
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                    >
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service === 'All' ? 'All Services' : service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="row mb-3">
          <div className="col-12">
            <p className="text-muted">
              Showing <strong>{filteredProviders.length}</strong> provider{filteredProviders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="row g-4">
          {filteredProviders.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="empty-state-icon text-muted mb-3">
                    <i className="bi bi-people fs-1"></i>
                  </div>
                  <h5 className="text-muted mb-2">No providers found</h5>
                  <p className="text-secondary mb-0">
                    {searchQuery || serviceFilter !== 'All'
                      ? 'Try adjusting your search or filters'
                      : 'Check back later for available providers'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filteredProviders.map((provider, index) => (
              <div 
                key={provider.id} 
                className="col-lg-4 col-md-6 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="provider-card card border-0 shadow-sm h-100 card-hover">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start mb-3">
                      <div className="provider-avatar me-3">
                        <i className={`bi ${getServiceIcon(provider.service)}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{provider.name}</h5>
                        <p className="text-primary mb-0 small fw-semibold">
                          <i className="bi bi-briefcase me-1"></i>
                          {provider.service}
                        </p>
                      </div>
                      {provider.verified && (
                        <div className="verified-badge" title="Verified Provider">
                          <i className="bi bi-patch-check-fill text-primary"></i>
                        </div>
                      )}
                    </div>

                    <p className="text-secondary mb-3 small">
                      {provider.description || 'Professional service provider with years of experience.'}
                    </p>

                    <div className="provider-info mb-3">
                      <div className="info-row mb-2">
                        <i className="bi bi-geo-alt text-muted me-2"></i>
                        <span className="text-secondary small">
                          {provider.location || 'Your Area'}
                        </span>
                      </div>
                      <div className="info-row mb-2">
                        <i className="bi bi-star-fill text-warning me-2"></i>
                        <span className="fw-semibold me-2">
                          {provider.rating || 4.5}
                        </span>
                        <span className="text-muted small">
                          ({provider.reviewCount || 128} reviews)
                        </span>
                      </div>
                      <div className="info-row mb-2">
                        <i className="bi bi-currency-dollar text-muted me-2"></i>
                        <span className="text-secondary small">
                          From ${provider.priceFrom || 50}/hour
                        </span>
                      </div>
                    </div>

                    <div className="rating-stars mb-3">
                      {renderStars(provider.rating || 4.5)}
                    </div>

                    {provider.tags && provider.tags.length > 0 && (
                      <div className="tags mb-3">
                        {provider.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="badge bg-light text-secondary me-1 mb-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/booking/new?provider=${provider.id}`}
                      className="btn btn-primary w-100"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        {filteredProviders.length > 0 && (
          <div className="row mt-5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="col-12">
              <div className="cta-card card border-0 shadow-sm bg-gradient-primary text-white">
                <div className="card-body p-5 text-center">
                  <h3 className="fw-bold mb-3">Can't find what you're looking for?</h3>
                  <p className="lead mb-4">
                    Contact us and we'll help you find the perfect service provider for your needs.
                  </p>
                  <button className="btn btn-light btn-lg">
                    <i className="bi bi-envelope me-2"></i>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .provider-card {
          transition: var(--transition-base);
          overflow: hidden;
        }

        .provider-avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .verified-badge {
          font-size: 1.5rem;
        }

        .info-row {
          display: flex;
          align-items: center;
        }

        .rating-stars {
          font-size: 1rem;
        }

        .tags .badge {
          font-weight: 500;
          padding: 0.375rem 0.75rem;
        }

        .empty-state-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .cta-card {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }

        .input-group-text {
          border-right: none;
        }

        .form-control:focus {
          border-left: none;
        }

        @media (max-width: 991px) {
          .provider-avatar {
            width: 56px;
            height: 56px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Providers;
