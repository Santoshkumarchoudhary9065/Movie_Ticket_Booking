const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: String,
    enum: ['U', 'U/A', 'A', 'S'],
    required: true
  },
  language: [{
    type: String,
    required: true
  }],
  poster: {
    type: String, // URL to poster image
    required: true
  },
  trailer: {
    type: String // URL to trailer video
  },
  cast: [{
    name: String,
    role: String
  }],
  director: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);