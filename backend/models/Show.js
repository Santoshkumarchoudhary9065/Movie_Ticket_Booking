const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screen: {
    screenNumber: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  pricing: [{
    seatType: {
      type: String,
      enum: ['Economy', 'Premium', 'VIP'],
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  availableSeats: {
    type: Map,
    of: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      seatType: {
        type: String,
        enum: ['Economy', 'Premium', 'VIP']
      }
    },
    default: new Map()
  },
  totalSeats: {
    type: Number,
    required: true
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
showSchema.index({ movie: 1, showDate: 1, showTime: 1 });
showSchema.index({ theater: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);