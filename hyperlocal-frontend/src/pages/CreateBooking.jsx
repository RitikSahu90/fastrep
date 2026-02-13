import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingAPI, providerAPI } from '../services/api';
import Loading from '../components/Loading';

const CreateBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    providerId: searchParams.get('provider') || '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (formData.providerId && providers.length > 0) {
      const provider = providers.find(p => p.id.toString() === formData.providerId);
      setSelectedProvider(provider);
    }
  }, [formData.providerId, providers]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getAllProviders();
      setProviders(response.data);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setApiError('Failed to load providers. Please try again.');
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
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.providerId) {
      newErrors.providerId = 'Please select a service provider';
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Date cannot be in the past';
      }
    }

    if (!formData.bookingTime) {
      newErrors.bookingTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const bookingData = {
        providerId: parseInt(formData.providerId),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        notes: formData.notes,
        status: 'Pending',
      };

      await bookingAPI.createBooking(bookingData);
      alert('Booking created successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      setApiError(
        err.response?.data?.message ||
        'Failed to create booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <div className="create-booking-page min-vh-100 py-5 bg-pattern">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-4 animate-fade-in">
              <div className="booking-icon mb-3">
                <i className="bi bi-calendar-plus text-primary fs-1"></i>
              </div>
              <h1 className="display-6 fw-bold mb-2">Create New Booking</h1>
              <p className="text-secondary">Schedule your service appointment</p>
            </div>

            <div className="card border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="card-body p-5">
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
                  {/* Provider Selection */}
                  <div className="mb-4">
                    <label htmlFor="providerId" className="form-label">
                      <i className="bi bi-person-badge me-2"></i>
                      Select Service Provider
                    </label>
                    <select
                      className={`form-select form-select-lg ${errors.providerId ? 'is-invalid' : ''}`}
                      id="providerId"
                      name="providerId"
                      value={formData.providerId}
                      onChange={handleChange}
                    >
                      <option value="">Choose a provider...</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} - {provider.service}
                        </option>
                      ))}
                    </select>
                    {errors.providerId && (
                      <div className="invalid-feedback">{errors.providerId}</div>
                    )}
                  </div>

                  {/* Selected Provider Info */}
                  {selectedProvider && (
                    <div className="provider-info-card card bg-light border-0 mb-4">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start">
                          <div className="provider-avatar-sm me-3">
                            <i className="bi bi-briefcase"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-1">{selectedProvider.name}</h5>
                            <p className="text-primary mb-2 small fw-semibold">
                              <i className="bi bi-briefcase me-1"></i>
                              {selectedProvider.service}
                            </p>
                            <div className="d-flex align-items-center text-secondary small">
                              <i className="bi bi-star-fill text-warning me-1"></i>
                              <span className="fw-semibold me-2">{selectedProvider.rating || 4.5}</span>
                              <span>•</span>
                              <span className="ms-2">From ${selectedProvider.priceFrom || 50}/hour</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date and Time */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="bookingDate" className="form-label">
                        <i className="bi bi-calendar3 me-2"></i>
                        Select Date
                      </label>
                      <input
                        type="date"
                        className={`form-control form-control-lg ${errors.bookingDate ? 'is-invalid' : ''}`}
                        id="bookingDate"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        min={getMinDate()}
                      />
                      {errors.bookingDate && (
                        <div className="invalid-feedback">{errors.bookingDate}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="bookingTime" className="form-label">
                        <i className="bi bi-clock me-2"></i>
                        Select Time
                      </label>
                      <select
                        className={`form-select form-select-lg ${errors.bookingTime ? 'is-invalid' : ''}`}
                        id="bookingTime"
                        name="bookingTime"
                        value={formData.bookingTime}
                        onChange={handleChange}
                      >
                        <option value="">Choose a time...</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.bookingTime && (
                        <div className="invalid-feedback">{errors.bookingTime}</div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="mb-4">
                    <label htmlFor="notes" className="form-label">
                      <i className="bi bi-chat-left-text me-2"></i>
                      Additional Notes <span className="text-muted">(Optional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="4"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special requirements or instructions for the provider..."
                    ></textarea>
                  </div>

                  {/* Booking Summary */}
                  {formData.providerId && formData.bookingDate && formData.bookingTime && (
                    <div className="booking-summary card border-primary border-2 mb-4">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0 fw-bold">
                          <i className="bi bi-info-circle me-2"></i>
                          Booking Summary
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="summary-row mb-2">
                          <span className="text-secondary">Provider:</span>
                          <span className="fw-semibold">{selectedProvider?.name}</span>
                        </div>
                        <div className="summary-row mb-2">
                          <span className="text-secondary">Service:</span>
                          <span className="fw-semibold">{selectedProvider?.service}</span>
                        </div>
                        <div className="summary-row mb-2">
                          <span className="text-secondary">Date:</span>
                          <span className="fw-semibold">
                            {new Date(formData.bookingDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span className="text-secondary">Time:</span>
                          <span className="fw-semibold">{formData.bookingTime}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg flex-grow-1"
                      onClick={() => navigate('/providers')}
                      disabled={submitting}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg flex-grow-1"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(10, 127, 126, 0.1) 0%, rgba(10, 127, 126, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .provider-avatar-sm {
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

        .provider-info-card {
          animation: slideInRight 0.4s ease-out;
        }

        .booking-summary {
          animation: slideInRight 0.4s ease-out;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 0.2rem rgba(10, 127, 126, 0.1);
        }

        .form-control-lg,
        .form-select-lg {
          font-size: 1rem;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateBooking;
