import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { movieService } from '../services/movie';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesResponse, citiesResponse] = await Promise.all([
        movieService.getMovies({ limit: 8 }),
        movieService.getCities()
      ]);
      
      setFeaturedMovies(moviesResponse.movies || []);
      setCities(citiesResponse.cities || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Movie Tickets
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Experience the magic of cinema with the best seats at the best prices
            </p>
            
            {/* City Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <label className="text-lg font-medium">Select Your City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/movies"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose MovieTickets?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Latest Movies</h3>
              <p className="text-gray-600">
                Get access to the latest blockbusters and indie films across all genres
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💺</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Seats</h3>
              <p className="text-gray-600">
                Choose from premium, VIP, and economy seats with real-time availability
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Multiple payment options with bank-level security for safe transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      {featuredMovies.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Now Showing</h2>
              <Link
                to="/movies"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All Movies →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/movie/${movie._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {movie.genre.join(', ')}
                      </span>
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
                        {movie.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {movie.duration} min
                      </span>
                      <span className="text-sm text-gray-600">
                        {movie.language.join(', ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Next Movie Experience?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of movie lovers who trust us for their entertainment needs
          </p>
          <Link
            to="/movies"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Booking Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;