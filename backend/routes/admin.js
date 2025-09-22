const express = require('express');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { validateMovie } = require('../middleware/validation');

const router = express.Router();

// Apply admin authentication to all routes
router.use(auth, adminAuth);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await Promise.all([
      Movie.countDocuments({ isActive: true }),
      Theater.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user', isActive: true }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]),
      Booking.aggregate([
        {
          $match: {
            bookingDate: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        },
        { $group: { _id: null, monthlyRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    const [
      totalMovies,
      totalTheaters,
      totalUsers,
      totalBookings,
      revenueResult,
      monthlyRevenueResult
    ] = stats;

    res.json({
      stats: {
        totalMovies,
        totalTheaters,
        totalUsers,
        totalBookings,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        monthlyRevenue: monthlyRevenueResult[0]?.monthlyRevenue || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error getting dashboard stats' });
  }
});

// Movie Management

// Get all movies for admin
router.get('/movies', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const skip = (page - 1) * limit;
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalMovies: total
      }
    });
  } catch (error) {
    console.error('Get admin movies error:', error);
    res.status(500).json({ message: 'Server error getting movies' });
  }
});

// Create movie
router.post('/movies', validateMovie, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error creating movie' });
  }
});

// Update movie
router.put('/movies/:id', validateMovie, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Server error updating movie' });
  }
});

// Delete movie
router.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Also deactivate associated shows
    await Show.updateMany(
      { movie: req.params.id },
      { isActive: false }
    );

    res.json({
      message: 'Movie deactivated successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Server error deleting movie' });
  }
});

// Theater Management

// Get all theaters
router.get('/theaters', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, city } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const theaters = await Theater.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Theater.countDocuments(query);

    res.json({
      theaters,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalTheaters: total
      }
    });
  } catch (error) {
    console.error('Get theaters error:', error);
    res.status(500).json({ message: 'Server error getting theaters' });
  }
});

// Create theater
router.post('/theaters', async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();

    res.status(201).json({
      message: 'Theater created successfully',
      theater
    });
  } catch (error) {
    console.error('Create theater error:', error);
    res.status(500).json({ message: 'Server error creating theater' });
  }
});

// Update theater
router.put('/theaters/:id', async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({
      message: 'Theater updated successfully',
      theater
    });
  } catch (error) {
    console.error('Update theater error:', error);
    res.status(500).json({ message: 'Server error updating theater' });
  }
});

// Show Management

// Get all shows
router.get('/shows', async (req, res) => {
  try {
    const { page = 1, limit = 10, movie, theater, date } = req.query;
    const query = {};

    if (movie) query.movie = movie;
    if (theater) query.theater = theater;
    if (date) {
      const showDate = new Date(date);
      showDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(showDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.showDate = { $gte: showDate, $lt: nextDay };
    }

    const skip = (page - 1) * limit;
    const shows = await Show.find(query)
      .populate('movie', 'title duration')
      .populate('theater', 'name location')
      .sort({ showDate: -1, showTime: 1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Show.countDocuments(query);

    res.json({
      shows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalShows: total
      }
    });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({ message: 'Server error getting shows' });
  }
});

// Create show
router.post('/shows', async (req, res) => {
  try {
    const {
      movie,
      theater,
      screenNumber,
      showDate,
      showTime,
      language,
      format,
      pricing
    } = req.body;

    // Verify movie and theater exist
    const [movieDoc, theaterDoc] = await Promise.all([
      Movie.findById(movie),
      Theater.findById(theater)
    ]);

    if (!movieDoc || !movieDoc.isActive) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (!theaterDoc || !theaterDoc.isActive) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    // Find screen details
    const screen = theaterDoc.screens.find(s => s.screenNumber === screenNumber);
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // Check for conflicting shows
    const conflictingShow = await Show.findOne({
      theater,
      'screen.screenNumber': screenNumber,
      showDate: new Date(showDate),
      showTime,
      isActive: true
    });

    if (conflictingShow) {
      return res.status(400).json({ message: 'Show time conflict with existing show' });
    }

    const show = new Show({
      movie,
      theater,
      screen: {
        screenNumber,
        name: screen.name
      },
      showDate: new Date(showDate),
      showTime,
      language,
      format,
      pricing,
      totalSeats: screen.capacity
    });

    await show.save();

    res.status(201).json({
      message: 'Show created successfully',
      show
    });
  } catch (error) {
    console.error('Create show error:', error);
    res.status(500).json({ message: 'Server error creating show' });
  }
});

// Update show
router.put('/shows/:id', async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({
      message: 'Show updated successfully',
      show
    });
  } catch (error) {
    console.error('Update show error:', error);
    res.status(500).json({ message: 'Server error updating show' });
  }
});

// Delete show
router.delete('/shows/:id', async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({
      message: 'Show deactivated successfully'
    });
  } catch (error) {
    console.error('Delete show error:', error);
    res.status(500).json({ message: 'Server error deleting show' });
  }
});

// Booking Management

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, movie, theater, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (movie) query.movie = movie;
    if (theater) query.theater = theater;
    if (date) {
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(bookingDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.bookingDate = { $gte: bookingDate, $lt: nextDay };
    }

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title')
      .populate('theater', 'name location')
      .sort({ bookingDate: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({ message: 'Server error getting bookings' });
  }
});

// User Management

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status) query.isActive = status === 'active';

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

module.exports = router;