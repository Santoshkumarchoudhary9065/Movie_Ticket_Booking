const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Movie validation
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('duration')
    .isInt({ min: 1, max: 500 })
    .withMessage('Duration must be a positive number (in minutes)'),
  body('rating')
    .isIn(['U', 'U/A', 'A', 'S'])
    .withMessage('Rating must be one of: U, U/A, A, S'),
  body('language')
    .isArray({ min: 1 })
    .withMessage('At least one language is required'),
  body('poster')
    .isURL()
    .withMessage('Poster must be a valid URL'),
  body('director')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name is required'),
  body('releaseDate')
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('showId')
    .isMongoId()
    .withMessage('Valid show ID is required'),
  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected'),
  body('seats.*.seatNumber')
    .notEmpty()
    .withMessage('Seat number is required'),
  body('seats.*.seatType')
    .isIn(['Economy', 'Premium', 'VIP'])
    .withMessage('Invalid seat type'),
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'])
    .withMessage('Invalid payment method'),
  body('contactInfo.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Contact name is required'),
  body('contactInfo.email')
    .isEmail()
    .withMessage('Valid contact email is required'),
  body('contactInfo.phone')
    .isMobilePhone('en-IN')
    .withMessage('Valid contact phone is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateMovie,
  validateBooking,
  handleValidationErrors
};