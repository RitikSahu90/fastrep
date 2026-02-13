import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, dashboardAPI } from '../services/api';
import { getUser } from '../utils/auth';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all bookings to calculate stats
      const bookingsResponse = await bookingAPI.getAllBookings();
      const allBookings = bookingsResponse.data;
      
      // Calculate stats
      const statsData = {
        totalBookings: allBookings.length,
        activeBookings: allBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length,
        completedBookings: allBookings.filter(b => b.status === 'Completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'Cancelled').length,
      };
      
      setStats(statsData);
      
      // Get recent bookings (last 5)
      const recent = allBookings
        .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
        .slice(0, 5);
      setRecentBookings(recent);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      Pending: 'bg-warning',
      Confirmed: 'bg-info',
      Completed: 'bg-success',
      Cancelled: 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  };

  if (loading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        {/* Welcome Section */}
        <div className="row mb-4 animate-fade-in">
          <div className="col-12">
            <div className="welcome-card p-4 rounded-4 bg-gradient-primary text-white">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h1 className="display-6 fw-bold mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                  </h1>
                  <p className="mb-0 opacity-90">
                    Here's an overview of your bookings and activity
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                  <Link to="/providers" className="btn btn-light btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>
                    Book New Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card card border-0 shadow-sm card-hover h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <span className="badge bg-primary bg-opacity-10 text-primary">Total</span>
                </div>
                <h3 className="fw-bold mb-1">{stats.totalBookings}</h3>
                <p className="text-secondary mb-0 small">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-card card border-0 shadow-sm card-hover h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="stat-icon bg-info bg-opacity-10 text-info">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <span className="badge bg-info bg-opacity-10 text-info">Active</span>
                </div>
                <h3 className="fw-bold mb-1">{stats.activeBookings}</h3>
                <p className="text-secondary mb-0 small">Active Bookings</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="stat-card card border-0 shadow-sm card-hover h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="stat-icon bg-success bg-opacity-10 text-success">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success">Done</span>
                </div>
                <h3 className="fw-bold mb-1">{stats.completedBookings}</h3>
                <p className="text-secondary mb-0 small">Completed</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="stat-card card border-0 shadow-sm card-hover h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="stat-icon bg-danger bg-opacity-10 text-danger">
                    <i className="bi bi-x-circle"></i>
                  </div>
                  <span className="badge bg-danger bg-opacity-10 text-danger">Cancelled</span>
                </div>
                <h3 className="fw-bold mb-1">{stats.cancelledBookings}</h3>
                <p className="text-secondary mb-0 small">Cancelled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="row animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold">Recent Bookings</h4>
                  <Link to="/bookings" className="btn btn-sm btn-outline-primary">
                    View All
                    <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
              <div className="card-body p-0">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="empty-state-icon text-muted mb-3">
                      <i className="bi bi-calendar-x fs-1"></i>
                    </div>
                    <h5 className="text-muted">No bookings yet</h5>
                    <p className="text-secondary mb-3">Start by booking your first service</p>
                    <Link to="/providers" className="btn btn-primary">
                      Browse Services
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Provider</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="service-icon-sm me-3">
                                  <i className="bi bi-briefcase"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{booking.service || 'Service'}</div>
                                  <small className="text-muted">#{booking.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-medium">{booking.provider?.name || 'Provider'}</div>
                              <small className="text-muted">{booking.provider?.service}</small>
                            </td>
                            <td>
                              <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                              <small className="text-muted">
                                {booking.bookingTime || new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </small>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <Link 
                                to={`/bookings/${booking.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-4 mt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="col-md-4">
            <Link to="/providers" className="text-decoration-none">
              <div className="action-card card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-4 text-center">
                  <div className="action-icon text-primary mb-3">
                    <i className="bi bi-search fs-1"></i>
                  </div>
                  <h5 className="fw-bold mb-2">Find Providers</h5>
                  <p className="text-secondary mb-0 small">Browse and book local service providers</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/bookings" className="text-decoration-none">
              <div className="action-card card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-4 text-center">
                  <div className="action-icon text-success mb-3">
                    <i className="bi bi-list-check fs-1"></i>
                  </div>
                  <h5 className="fw-bold mb-2">Manage Bookings</h5>
                  <p className="text-secondary mb-0 small">View and manage all your bookings</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/profile" className="text-decoration-none">
              <div className="action-card card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-4 text-center">
                  <div className="action-icon text-info mb-3">
                    <i className="bi bi-person-circle fs-1"></i>
                  </div>
                  <h5 className="fw-bold mb-2">Edit Profile</h5>
                  <p className="text-secondary mb-0 small">Update your account information</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-card {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }

        .stat-card {
          transition: var(--transition-base);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .service-icon-sm {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .action-card {
          transition: var(--transition-base);
        }

        .action-card:hover {
          transform: translateY(-5px);
        }

        .action-icon {
          width: 64px;
          height: 64px;
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
      `}</style>
    </div>
  );
};

export default Dashboard;
