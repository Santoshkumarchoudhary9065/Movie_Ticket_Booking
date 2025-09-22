# 🎟️ Movie Ticket Booking System

A comprehensive online movie ticket booking platform built with modern web technologies. This system allows users to browse movies, select show timings, choose seats, and book tickets digitally with a complete admin dashboard for management.

## 🚀 Features

### User Features
- **User Authentication**: Secure signup/login with JWT-based authentication
- **Movie Browsing**: Browse movies with filters (genre, language, rating)
- **Show Selection**: View show timings across different theaters and cities
- **Seat Selection**: Interactive seat map with real-time availability
- **Ticket Booking**: Complete booking flow with multiple payment options
- **Booking History**: View and manage past bookings
- **Profile Management**: Update personal information and change passwords

### Admin Features
- **Dashboard**: Overview of movies, theaters, users, and revenue statistics
- **Movie Management**: Add, edit, and manage movie listings
- **Theater Management**: Configure theaters, screens, and seat layouts
- **Show Management**: Schedule shows with pricing and availability
- **Booking Oversight**: Monitor all bookings and user activities
- **User Management**: Manage user accounts and permissions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Custom CSS** - Styling (designed for Tailwind CSS)

## 📁 Project Structure

```
Movie_Ticket_Booking/
├── backend/                    # Backend API
│   ├── models/                # Database models
│   │   ├── User.js           # User model
│   │   ├── Movie.js          # Movie model
│   │   ├── Theater.js        # Theater model
│   │   ├── Show.js           # Show model
│   │   └── Booking.js        # Booking model
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── movies.js         # Movie routes
│   │   ├── bookings.js       # Booking routes
│   │   └── admin.js          # Admin routes
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Auth middleware
│   │   └── validation.js     # Validation middleware
│   ├── server.js             # Main server file
│   └── package.json          # Backend dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Movies.tsx
│   │   │   ├── MovieDetail.tsx
│   │   │   ├── SeatSelection.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/         # API services
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── movie.ts
│   │   │   └── booking.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   └── App.tsx           # Main App component
│   └── package.json          # Frontend dependencies
│
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas URI)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Santoshkumarchoudhary9065/Movie_Ticket_Booking.git
   cd Movie_Ticket_Booking
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the frontend development server
   npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/movie_ticket_booking

# JWT Secret Key (use a strong secret in production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Default Credentials (optional)
ADMIN_EMAIL=admin@movietickets.com
ADMIN_PASSWORD=admin123
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/:id/shows` - Get shows for a movie
- `GET /api/movies/cities/list` - Get available cities
- `GET /api/movies/genres/list` - Get available genres
- `GET /api/movies/languages/list` - Get available languages

### Bookings
- `GET /api/bookings/show/:showId` - Get show details with seats
- `POST /api/bookings/book` - Create new booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking

### Admin (Requires admin role)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/movies` - Get all movies for admin
- `POST /api/admin/movies` - Create new movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie
- `GET /api/admin/theaters` - Get all theaters
- `POST /api/admin/theaters` - Create new theater
- `GET /api/admin/shows` - Get all shows
- `POST /api/admin/shows` - Create new show
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/users` - Get all users

## 📱 Features Overview

### User Journey
1. **Registration/Login**: Users can create accounts or login
2. **Browse Movies**: View current movies with details
3. **Select Show**: Choose preferred show timing and theater
4. **Seat Selection**: Interactive seat map with pricing
5. **Payment**: Complete booking with payment details
6. **Confirmation**: Receive booking confirmation
7. **Manage Bookings**: View history and cancel if needed

### Admin Workflow
1. **Dashboard**: Monitor system statistics
2. **Content Management**: Add/edit movies and theaters
3. **Show Scheduling**: Create shows with pricing
4. **User Oversight**: Manage user accounts
5. **Analytics**: Track bookings and revenue

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin requests
- **Role-Based Access**: Separate user and admin permissions

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Interactive Elements**: Hover effects and transitions

## 🔄 Future Enhancements

- **Payment Integration**: Stripe/PayPal integration
- **Email Notifications**: Booking confirmations and reminders
- **Push Notifications**: Mobile app notifications
- **Advanced Filters**: More movie filtering options
- **Reviews & Ratings**: User movie reviews
- **Loyalty Program**: Points and rewards system
- **Multi-language Support**: Internationalization
- **Offline Support**: Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Santosh Kumar Choudhary** - *Initial work* - [GitHub](https://github.com/Santoshkumarchoudhary9065)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All open-source contributors whose packages made this possible

## 📞 Support

For support, email support@movietickets.com or create an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**