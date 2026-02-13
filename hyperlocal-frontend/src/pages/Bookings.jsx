import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Loading from '../components/Loading';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id?.toString().includes(searchQuery)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      Pending: 'bg-warning text-dark',
      Confirmed: 'bg-info',
      Completed: 'bg-success',
      Cancelled: 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  };

  const getStatusCount = (status) => {
    if (status === 'All') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  if (loading) {
    return <Loading fullScreen message="Loading bookings..." />;
  }

  return (
    <div className="bookings-page py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4 animate-fade-in">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="display-6 fw-bold mb-2">My Bookings</h1>
                <p className="text-secondary mb-0">Manage all your service bookings</p>
              </div>
              <Link to="/booking/new" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                New Booking
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="row mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-lg-6">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search by service, provider, or booking ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="btn-group w-100" role="group">
                      {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                          <span className="badge bg-white text-primary ms-2">
                            {getStatusCount(status)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="row animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="col-12">
            {filteredBookings.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="empty-state-icon text-muted mb-3">
                    <i className="bi bi-calendar-x fs-1"></i>
                  </div>
                  <h5 className="text-muted mb-2">No bookings found</h5>
                  <p className="text-secondary mb-4">
                    {searchQuery || statusFilter !== 'All' 
                      ? 'Try adjusting your filters'
                      : 'Start by booking your first service'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'All' && (
                    <Link to="/providers" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Book a Service
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {filteredBookings.map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className="col-lg-6 animate-fade-in" 
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    <div className="booking-card card border-0 shadow-sm h-100 card-hover">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="booking-icon me-3">
                              <i className="bi bi-calendar-event"></i>
                            </div>
                            <div>
                              <h5 className="fw-bold mb-1">{booking.service || 'Service'}</h5>
                              <p className="text-muted mb-0 small">Booking #{booking.id}</p>
                            </div>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="booking-details">
                          <div className="detail-row mb-2">
                            <i className="bi bi-person me-2 text-muted"></i>
                            <span className="fw-medium">{booking.provider?.name || 'Provider'}</span>
                          </div>
                          <div className="detail-row mb-2">
                            <i className="bi bi-briefcase me-2 text-muted"></i>
                            <span className="text-secondary">{booking.provider?.service || 'N/A'}</span>
                          </div>
                          <div className="detail-row mb-2">
                            <i className="bi bi-calendar3 me-2 text-muted"></i>
                            <span className="text-secondary">
                              {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="detail-row mb-3">
                            <i className="bi bi-clock me-2 text-muted"></i>
                            <span className="text-secondary">
                              {booking.bookingTime || new Date(booking.bookingDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {booking.notes && (
                            <div className="notes-section p-3 bg-light rounded-3 mb-3">
                              <small className="text-muted fw-semibold d-block mb-1">Notes:</small>
                              <small className="text-secondary">{booking.notes}</small>
                            </div>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <Link 
                            to={`/bookings/${booking.id}`}
                            className="btn btn-outline-primary btn-sm flex-grow-1"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View Details
                          </Link>
                          {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-card {
          transition: var(--transition-base);
          overflow: hidden;
        }

        .booking-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
        }

        .notes-section {
          border-left: 3px solid var(--primary);
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

        .badge {
          padding: 0.5rem 0.75rem;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .btn-group .btn {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }

        .btn-group .badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }

        .input-group-text {
          border-right: none;
        }

        .form-control:focus {
          border-left: none;
        }

        @media (max-width: 991px) {
          .btn-group {
            flex-direction: column;
          }

          .btn-group .btn {
            border-radius: var(--radius-md) !important;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Bookings;
