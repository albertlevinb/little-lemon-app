import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Phone, Mail, Utensils, Star, MapPin, ChefHat, Award, Home, BookOpen, Menu as MenuIcon } from 'lucide-react';
import BookingPage from './components/BookingPage';

const LittleLemonWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
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
  const [loading, setLoading] = useState(false); // Add loading state

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Business Meeting', 'Date Night',
    'Family Dinner', 'Celebration', 'Other'
  ];

  const menuItems = {
    appetizers: [
      { name: 'Mediterranean Mezze Platter', price: '$18', description: 'Hummus, baba ganoush, olives, dolmas, and pita bread' },
      { name: 'Grilled Octopus', price: '$22', description: 'Tender octopus with lemon, olive oil, and herbs' },
      { name: 'Spanakopita', price: '$14', description: 'Traditional Greek spinach and feta pie' },
      { name: 'Bruschetta Trio', price: '$16', description: 'Three varieties of our signature bruschetta' }
    ],
    mains: [
      { name: 'Grilled Branzino', price: '$32', description: 'Whole Mediterranean sea bass with lemon and herbs' },
      { name: 'Lamb Souvlaki', price: '$28', description: 'Marinated lamb skewers with tzatziki and pita' },
      { name: 'Lemon Herb Chicken', price: '$24', description: 'Free-range chicken with Mediterranean herbs' },
      { name: 'Seafood Paella', price: '$34', description: 'Traditional Spanish rice dish with fresh seafood' },
      { name: 'Moussaka', price: '$26', description: 'Classic Greek layered casserole with eggplant' },
      { name: 'Pasta Puttanesca', price: '$22', description: 'Spaghetti with olives, capers, and tomatoes' }
    ],
    desserts: [
      { name: 'Baklava', price: '$8', description: 'Layers of phyllo with nuts and honey' },
      { name: 'Lemon Tart', price: '$9', description: 'House-made tart with fresh lemon curd' },
      { name: 'Tiramisu', price: '$10', description: 'Classic Italian coffee-flavored dessert' },
      { name: 'Greek Yogurt Parfait', price: '$7', description: 'With honey, nuts, and seasonal fruits' }
    ]
  };

  // Load bookings from Supabase on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.date);
    if (selectedDate < today) newErrors.date = 'Date cannot be in the past';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          date: bookingData.date,
          time: bookingData.time,
          guests: bookingData.guests,
          occasion: bookingData.occasion || null,
          requests: bookingData.requests || null
        }])
        .select()
        .single();

      if (error) throw error;

      // Add new booking to local state
      setBookings(prev => [data, ...prev]);
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

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error creating your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));

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

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Utensils className="w-8 h-8 text-yellow-500 mr-2" />
            <span className="text-2xl font-bold text-green-800">Little Lemon</span>
          </div>
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${currentPage === 'home'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-700 hover:text-yellow-600'
                }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>
            <button
              onClick={() => setCurrentPage('menu')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${currentPage === 'menu'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-700 hover:text-yellow-600'
                }`}
            >
              <MenuIcon className="w-4 h-4 mr-2" />
              Menu
            </button>
            <button
              onClick={() => setCurrentPage('booking')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${currentPage === 'booking'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-700 hover:text-yellow-600'
                }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Reservations
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Home Page Component
  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Little Lemon
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience the authentic flavors of the Mediterranean in the heart of Chicago
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('booking')}
              className="bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => setCurrentPage('menu')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-green-800 font-bold py-4 px-8 rounded-lg text-lg transition-all">
              View Menu
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Little Lemon brings the vibrant tastes of the Mediterranean to Chicago.
                Founded by Adrian and Mario, two passionate chefs who grew up in the coastal
                towns of Italy and Greece, our restaurant celebrates the rich culinary
                traditions of the Mediterranean region.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We source the finest ingredients, from hand-picked olives to fresh seafood,
                creating dishes that transport you to the sun-soaked shores of the Mediterranean.
                Every meal is prepared with love, tradition, and a commitment to authenticity.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-gray-700">Award Winning</span>
                </div>
                <div className="flex items-center">
                  <ChefHat className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-gray-700">Expert Chefs</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl h-96 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1674216645383-afc4e42c227f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWVkaXRlcnJhbmVhbiUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvciUyMHdpdGglMjB3YXJtJTIwbGlnaHRpbmd8ZW58MHx8MHx8fDA%3D"
                alt="Mediterranean restaurant interior with warm lighting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-semibold">Authentic Mediterranean Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Signature Dishes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                image: "https://images.unsplash.com/photo-1638387113777-dfc37a21086c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RnJlc2glMjBNZWRpdGVycmFuZWFuJTIwU2FsYWR8ZW58MHx8MHx8fDA%3D",
                title: "Fresh Mediterranean Salad",
                description: "Mixed greens with olives, feta, and herbs"
              },
              {
                image: "https://plus.unsplash.com/premium_photo-1717345994192-f5bc10b61c09?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Grilled Seafood Platter",
                description: "Fresh catch of the day with lemon and herbs"
              },
              {
                image: "https://plus.unsplash.com/premium_photo-1677000666761-ff476a65c8ba?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Homemade Pasta",
                description: "Traditional recipes with fresh ingredients"
              },
              {
                image: "https://plus.unsplash.com/premium_photo-1661373158038-645491a05932?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Wood-Fired Pizza",
                description: "Authentic Italian style with fresh toppings"
              },
              {
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "Mediterranean Mezze",
                description: "Variety of appetizers and dips"
              },
              {
                image: "https://images.unsplash.com/photo-1619810816513-2484647eef43?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Grilled Lamb",
                description: "Tender lamb with Mediterranean spices"
              }
            ].map((dish, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-64">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{dish.title}</h3>
                    <p className="text-sm text-gray-200">{dish.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                review: "Absolutely incredible! The flavors transported me straight to Greece. The service was impeccable and the atmosphere was perfect for our anniversary dinner."
              },
              {
                name: "Michael Chen",
                rating: 5,
                review: "Best Mediterranean food in Chicago! The fresh ingredients and authentic recipes make every visit special. Highly recommend the grilled octopus!"
              },
              {
                name: "Emily Rodriguez",
                rating: 5,
                review: "A hidden gem! The staff is so welcoming and the food is consistently amazing. The lemon-herb chicken is to die for. Will definitely be back!"
              }
            ].map((review, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.review}"</p>
                <p className="font-semibold text-gray-800">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>123 Mediterranean Ave<br />Chicago, IL 60611</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p>(312) 555-LEMON</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>info@littlelemon.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Thursday</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>11:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Menu Page Component
  const MenuPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h1>
          <p className="text-gray-600 text-lg">Authentic Mediterranean cuisine made with the finest ingredients</p>
        </div>

        {/* Menu Categories */}
        <div className="space-y-12">
          {/* Appetizers */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Appetizers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {menuItems.appetizers.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-lg font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Main Courses */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Main Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {menuItems.mains.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-lg font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Desserts */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Desserts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {menuItems.desserts.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-lg font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-yellow-400 to-green-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Dine?</h2>
            <p className="text-xl mb-6">Make a reservation and taste the Mediterranean difference</p>
            <button
              onClick={() => setCurrentPage('booking')}
              className="bg-white text-green-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Make Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'menu' && <MenuPage />}
      {currentPage === 'booking' && (
        <BookingPage
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          errors={errors}
          getTomorrowDate={getTomorrowDate}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          bookings={bookings}
          availableSlots={availableSlots}
          occasions={occasions}
          loading={loading} // Pass loading state
        />
      )}
    </div>
  )
};

export default LittleLemonWebsite;