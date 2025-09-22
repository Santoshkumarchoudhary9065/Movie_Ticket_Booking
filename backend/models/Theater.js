const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    seatLayout: {
      rows: {
        type: Number,
        required: true
      },
      seatsPerRow: {
        type: Number,
        required: true
      }
    },
    seatTypes: [{
      type: {
        type: String,
        enum: ['Economy', 'Premium', 'VIP'],
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      rows: [String] // Which rows belong to this seat type
    }]
  }],
  amenities: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theater', theaterSchema);