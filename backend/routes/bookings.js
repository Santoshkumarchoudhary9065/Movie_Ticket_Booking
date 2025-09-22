const express = require('express');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const { auth } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

const router = express.Router();

// Get show details with seat availability
router.get('/show/:showId', auth, async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate('movie', 'title duration rating language poster')
      .populate('theater', 'name location screens');

    if (!show || !show.isActive) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Get screen details
    const theater = show.theater;
    const screen = theater.screens.find(s => s.screenNumber === show.screen.screenNumber);
    
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // Generate seat map if not exists
    if (show.availableSeats.size === 0) {
      const seatMap = new Map();
      const rows = screen.seatLayout.rows;
      const seatsPerRow = screen.seatLayout.seatsPerRow;

      for (let row = 1; row <= rows; row++) {
        const rowLetter = String.fromCharCode(64 + row); // A, B, C, etc.
        for (let seat = 1; seat <= seatsPerRow; seat++) {
          const seatNumber = `${rowLetter}${seat}`;
          
          // Determine seat type based on screen configuration
          let seatType = 'Economy';
          for (const type of screen.seatTypes) {
            if (type.rows.includes(rowLetter)) {
              seatType = type.type;
              break;
            }
          }

          seatMap.set(seatNumber, {
            isAvailable: true,
            seatType: seatType
          });
        }
      }

      show.availableSeats = seatMap;
      show.totalSeats = seatMap.size;
      await show.save();
    }

    res.json({
      show: {
        _id: show._id,
        movie: show.movie,
        theater: {
          _id: show.theater._id,
          name: show.theater.name,
          location: show.theater.location
        },
        screen: show.screen,
        showDate: show.showDate,
        showTime: show.showTime,
        language: show.language,
        format: show.format,
        pricing: show.pricing
      },
      seatLayout: {
        rows: screen.seatLayout.rows,
        seatsPerRow: screen.seatLayout.seatsPerRow
      },
      availableSeats: Object.fromEntries(show.availableSeats),
      seatTypes: screen.seatTypes
    });
  } catch (error) {
    console.error('Get show details error:', error);
    res.status(500).json({ message: 'Server error getting show details' });
  }
});

// Create booking
router.post('/book', auth, validateBooking, async (req, res) => {
  try {
    const { showId, seats, paymentMethod, contactInfo } = req.body;

    // Get show details
    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theater');

    if (!show || !show.isActive) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if show is in the future
    const now = new Date();
    const showDateTime = new Date(show.showDate);
    const [hours, minutes] = show.showTime.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (showDateTime <= now) {
      return res.status(400).json({ message: 'Cannot book tickets for past shows' });
    }

    // Validate seats availability
    const requestedSeats = seats.map(s => s.seatNumber);
    const unavailableSeats = [];

    for (const seatNumber of requestedSeats) {
      const seatInfo = show.availableSeats.get(seatNumber);
      if (!seatInfo || !seatInfo.isAvailable) {
        unavailableSeats.push(seatNumber);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are no longer available',
        unavailableSeats
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const bookingSeats = [];

    for (const seatRequest of seats) {
      const seatInfo = show.availableSeats.get(seatRequest.seatNumber);
      const pricing = show.pricing.find(p => p.seatType === seatInfo.seatType);
      
      if (!pricing) {
        return res.status(400).json({ message: `Pricing not found for seat type: ${seatInfo.seatType}` });
      }

      bookingSeats.push({
        seatNumber: seatRequest.seatNumber,
        seatType: seatInfo.seatType,
        price: pricing.price
      });

      totalAmount += pricing.price;
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theater: show.theater._id,
      seats: bookingSeats,
      totalAmount,
      showDate: show.showDate,
      showTime: show.showTime,
      paymentMethod,
      contactInfo
    });

    await booking.save();

    // Update seat availability
    for (const seatNumber of requestedSeats) {
      show.availableSeats.set(seatNumber, {
        ...show.availableSeats.get(seatNumber),
        isAvailable: false
      });
    }

    show.bookedSeats += requestedSeats.length;
    await show.save();

    // Populate booking details for response
    await booking.populate('movie', 'title poster duration rating');
    await booking.populate('theater', 'name location');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        bookingId: booking.bookingId,
        _id: booking._id,
        movie: booking.movie,
        theater: booking.theater,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        showDate: booking.showDate,
        showTime: booking.showTime,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(query)
      .populate('movie', 'title poster duration rating')
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
        totalBookings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error getting bookings' });
  }
});

// Get booking details
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { _id: req.params.bookingId },
        { bookingId: req.params.bookingId }
      ],
      user: req.user._id
    })
      .populate('movie', 'title poster duration rating')
      .populate('theater', 'name location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({ message: 'Server error getting booking details' });
  }
});

// Cancel booking
router.put('/:bookingId/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { _id: req.params.bookingId },
        { bookingId: req.params.bookingId }
      ],
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check if cancellation is allowed (e.g., at least 2 hours before show)
    const now = new Date();
    const showDateTime = new Date(booking.showDate);
    const [hours, minutes] = booking.showTime.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const timeDiff = showDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      return res.status(400).json({ 
        message: 'Bookings can only be cancelled at least 2 hours before the show' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release seats
    const show = await Show.findById(booking.show);
    if (show) {
      for (const seat of booking.seats) {
        const seatInfo = show.availableSeats.get(seat.seatNumber);
        if (seatInfo) {
          show.availableSeats.set(seat.seatNumber, {
            ...seatInfo,
            isAvailable: true
          });
        }
      }
      show.bookedSeats -= booking.seats.length;
      await show.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: {
        bookingId: booking.bookingId,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

module.exports = router;