import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, AlertCircle, Utensils } from 'lucide-react';

const LittleLemonBooking = () => {
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    requests: ''
  });

  const [bookings, setBookings] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Business Meeting', 'Date Night',
    'Family Dinner', 'Celebration', 'Other'
  ];

  const getAvailableSlots = (selectedDate) => {
    const bookedSlots = bookings
      .filter(booking => booking.date === selectedDate)
      .map(booking => booking.time);

    return timeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.name.trim()) newErrors.name = 'Name is required';
    if (!bookingData.email.trim()) newErrors.email = 'Email is required';
    if (!bookingData.email.includes('@') && bookingData.email.trim()) newErrors.email = 'Valid email is required';
    if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!bookingData.date) newErrors.date = 'Date is required';
    if (!bookingData.time) newErrors.time = 'Time is required';
    if (bookingData.guests < 1 || bookingData.guests > 12) newErrors.guests = 'Guests must be between 1 and 12';

    // Check if selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.date);
    if (selectedDate < today) newErrors.date = 'Date cannot be in the past';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newBooking = {
      ...bookingData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setBookings([...bookings, newBooking]);
    setShowConfirmation(true);

    // Reset form
    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      occasion: '',
      requests: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const availableSlots = getAvailableSlots(bookingData.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50" role="main">
      {/* Header */}
      <header className="bg-yellow-400 shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Utensils className="w-8 h-8 text-green-800 mr-3" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-green-800">Little Lemon</h1>
          </div>
          <p className="text-center text-green-700 mt-2">Reserve Your Table Today</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
                <h2 id="confirmation-title" className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for choosing Little Lemon. Your table has been reserved.
                </p>
                <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Confirmation Details:</strong><br />
                    We'll send you a confirmation email shortly with all the details.
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-green-800 font-semibold py-2 px-6 rounded-lg transition-colors"
                  aria-label="Close confirmation dialog"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <section className="lg:col-span-2" aria-labelledby="booking-form-title">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 id="booking-form-title" className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-yellow-500" aria-hidden="true" />
                Reserve Your Table
              </h2>

              <div className="space-y-6">
                {/* Personal Information */}
                <fieldset className="grid md:grid-cols-2 gap-4">
                  <legend className="sr-only">Personal Information</legend>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your full name"
                      aria-required="true"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="your@email.com"
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="(123) 456-7890"
                      aria-required="true"
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Reservation Details */}
                <fieldset className="grid md:grid-cols-2 gap-4">
                  <legend className="sr-only">Reservation Details</legend>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={getTomorrowDate()}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      aria-required="true"
                      aria-invalid={errors.date ? 'true' : 'false'}
                      aria-describedby={errors.date ? 'date-error' : undefined}
                    />
                    {errors.date && (
                      <p id="date-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                      <select
                        id="time"
                        value={bookingData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.time ? 'border-red-500' : 'border-gray-300'
                          }`}
                        aria-required="true"
                        aria-invalid={errors.time ? 'true' : 'false'}
                        aria-describedby={errors.time ? 'time-error' : undefined}
                      >
                        <option value="">Select time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    {errors.time && (
                      <p id="time-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </fieldset>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        value={bookingData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.guests ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.guests && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.guests}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion (Optional)
                    </label>
                    <select
                      value={bookingData.occasion}
                      onChange={(e) => handleInputChange('occasion', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                    >
                      <option value="">Select occasion</option>
                      {occasions.map(occasion => (
                        <option key={occasion} value={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.requests}
                    onChange={(e) => handleInputChange('requests', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                    placeholder="Any dietary restrictions, seating preferences, or special requests..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-800 font-semibold py-4 px-6 rounded-lg transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                  aria-label="Submit reservation form"
                >
                  Reserve Table
                </button>
              </div>
            </div>
          </section>

          {/* Restaurant Info & Recent Bookings */}
          <aside className="space-y-6" aria-labelledby="restaurant-info-title">
            {/* Restaurant Info */}
            <section className="bg-white rounded-2xl shadow-xl p-6">
              <h3 id="restaurant-info-title" className="text-xl font-bold text-gray-800 mb-4">Restaurant Info</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Hours:</strong><br />Mon-Thu: 11:00 AM - 10:00 PM<br />Fri-Sat: 11:00 AM - 11:00 PM<br />Sun: 11:00 AM - 9:00 PM</p>
                <p><strong>Location:</strong><br />123 Mediterranean Ave<br />Chicago, IL 60611</p>
                <p><strong>Phone:</strong><br />(312) 555-LEMON</p>
              </div>
            </section>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <section className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto" role="log" aria-label="Recent booking confirmations">
                  {bookings.slice(-5).reverse().map(booking => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                          <p className="text-sm text-gray-600">{booking.guests} guests</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" aria-label="Booking confirmed" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default LittleLemonBooking;