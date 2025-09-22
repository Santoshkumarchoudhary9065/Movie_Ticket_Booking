const express = require('express');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Theater = require('../models/Theater');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all movies
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { genre, language, rating, search, page = 1, limit = 10 } = req.query;
    const filters = { isActive: true };

    // Apply filters
    if (genre) filters.genre = { $in: [genre] };
    if (language) filters.language = { $in: [language] };
    if (rating) filters.rating = rating;
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const movies = await Movie.find(filters)
      .sort({ releaseDate: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Movie.countDocuments(filters);

    res.json({
      movies,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalMovies: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error getting movies' });
  }
});

// Get movie by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ movie });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error getting movie' });
  }
});

// Get shows for a movie
router.get('/:id/shows', optionalAuth, async (req, res) => {
  try {
    const { city, date, theater } = req.query;
    const movieId = req.params.id;

    // Verify movie exists
    const movie = await Movie.findOne({ _id: movieId, isActive: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Build query
    const query = {
      movie: movieId,
      isActive: true
    };

    // Filter by date (default to today if not provided)
    const showDate = date ? new Date(date) : new Date();
    showDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(showDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.showDate = {
      $gte: showDate,
      $lt: nextDay
    };

    // Get theaters for city filter
    let theaterIds = [];
    if (city || theater) {
      const theaterQuery = { isActive: true };
      if (city) theaterQuery['location.city'] = { $regex: city, $options: 'i' };
      if (theater) theaterQuery.name = { $regex: theater, $options: 'i' };
      
      const theaters = await Theater.find(theaterQuery).select('_id');
      theaterIds = theaters.map(t => t._id);
      
      if (theaterIds.length === 0) {
        return res.json({ shows: [] });
      }
      
      query.theater = { $in: theaterIds };
    }

    // Get shows with theater and movie details
    const shows = await Show.find(query)
      .populate('theater', 'name location screens')
      .populate('movie', 'title duration rating language')
      .sort({ showTime: 1 });

    // Group shows by theater
    const groupedShows = shows.reduce((acc, show) => {
      const theaterId = show.theater._id.toString();
      if (!acc[theaterId]) {
        acc[theaterId] = {
          theater: show.theater,
          shows: []
        };
      }
      acc[theaterId].shows.push({
        _id: show._id,
        showTime: show.showTime,
        language: show.language,
        format: show.format,
        pricing: show.pricing,
        availableSeats: show.totalSeats - show.bookedSeats,
        totalSeats: show.totalSeats
      });
      return acc;
    }, {});

    res.json({
      movie: {
        _id: movie._id,
        title: movie.title,
        duration: movie.duration,
        rating: movie.rating,
        language: movie.language
      },
      theaters: Object.values(groupedShows)
    });
  } catch (error) {
    console.error('Get movie shows error:', error);
    res.status(500).json({ message: 'Server error getting movie shows' });
  }
});

// Get available cities
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await Theater.distinct('location.city', { isActive: true });
    res.json({ cities: cities.sort() });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Server error getting cities' });
  }
});

// Get available genres
router.get('/genres/list', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre', { isActive: true });
    res.json({ genres: genres.sort() });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error getting genres' });
  }
});

// Get available languages
router.get('/languages/list', async (req, res) => {
  try {
    const languages = await Movie.distinct('language', { isActive: true });
    res.json({ languages: languages.sort() });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Server error getting languages' });
  }
});

module.exports = router;