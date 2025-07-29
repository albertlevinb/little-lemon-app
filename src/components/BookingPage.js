import { Calendar, Clock, Users, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function BookingPage({
  bookingData,
  handleInputChange,
  handleSubmit,
  errors,
  getTomorrowDate,
  showConfirmation,
  setShowConfirmation,
  bookings,
  availableSlots,
  occasions,
  loading = false // Add loading prop with default value
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Make a Reservation</h1>
          <p className="text-gray-600 text-lg">Reserve your table at Little Lemon and experience authentic Mediterranean cuisine</p>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
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
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-yellow-500" />
                Reserve Your Table
              </h2>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                          } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={loading}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Reservation Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={getTomorrowDate()}
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.date ? 'border-red-500' : 'border-gray-300'
                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Same-day bookings are not available.</p>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        value={bookingData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.time ? 'border-red-500' : 'border-gray-300'
                          } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Select time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

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
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.guests ? 'border-red-500' : 'border-gray-300'
                          } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                      disabled={loading}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${loading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
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
                    disabled={loading}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${loading ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    placeholder="Any dietary restrictions, seating preferences, or special requests..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full font-semibold py-4 px-6 rounded-lg transition-all transform ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-green-800 hover:scale-105'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Reservation...
                    </div>
                  ) : (
                    'Reserve Table'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Restaurant Info & Recent Bookings */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Restaurant Info</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Hours:</strong><br />Mon-Thu: 11:00 AM - 10:00 PM<br />Fri-Sat: 11:00 AM - 11:00 PM<br />Sun: 11:00 AM - 9:00 PM</p>
                <p><strong>Location:</strong><br />123 Mediterranean Ave<br />Chicago, IL 60611</p>
                <p><strong>Phone:</strong><br />(312) 555-LEMON</p>
              </div>
            </div>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                          <p className="text-sm text-gray-600">{booking.guests} guests</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}