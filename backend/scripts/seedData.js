const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_ticket_booking';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@movietickets.com' });
  if (!adminExists) {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@movietickets.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');
  }

  // Create demo user
  const userExists = await User.findOne({ email: 'user@demo.com' });
  if (!userExists) {
    const user = new User({
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'password123',
      phone: '9876543211',
      role: 'user'
    });
    await user.save();
    console.log('Demo user created');
  }
};

const seedMovies = async () => {
  const movies = [
    {
      title: 'Avengers: Endgame',
      description: 'The grave course of events set in motion by Thanos that wiped out half the universe and fractured the Avengers ranks compels the remaining Avengers to take one final stand.',
      genre: ['Action', 'Adventure', 'Drama'],
      duration: 181,
      rating: 'U/A',
      language: ['English', 'Hindi'],
      poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      cast: [
        { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
        { name: 'Chris Evans', role: 'Steve Rogers / Captain America' },
        { name: 'Mark Ruffalo', role: 'Bruce Banner / Hulk' }
      ],
      director: 'Anthony Russo, Joe Russo',
      releaseDate: new Date('2019-04-26')
    },
    {
      title: 'Spider-Man: No Way Home',
      description: 'With Spider-Mans identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
      genre: ['Action', 'Adventure', 'Fantasy'],
      duration: 148,
      rating: 'U/A',
      language: ['English', 'Hindi'],
      poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
      cast: [
        { name: 'Tom Holland', role: 'Peter Parker / Spider-Man' },
        { name: 'Zendaya', role: 'MJ' },
        { name: 'Benedict Cumberbatch', role: 'Doctor Strange' }
      ],
      director: 'Jon Watts',
      releaseDate: new Date('2021-12-17')
    },
    {
      title: 'The Batman',
      description: 'When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman must track down the killer and his mysterious agenda.',
      genre: ['Action', 'Crime', 'Drama'],
      duration: 176,
      rating: 'U/A',
      language: ['English'],
      poster: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      trailer: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
      cast: [
        { name: 'Robert Pattinson', role: 'Bruce Wayne / The Batman' },
        { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman' },
        { name: 'Paul Dano', role: 'The Riddler' }
      ],
      director: 'Matt Reeves',
      releaseDate: new Date('2022-03-04')
    },
    {
      title: 'RRR',
      description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
      genre: ['Action', 'Drama', 'History'],
      duration: 187,
      rating: 'U/A',
      language: ['Telugu', 'Hindi', 'English'],
      poster: 'https://image.tmdb.org/t/p/w500/zIPfU8y1LKJVcEw2DUGwvGfSOAZ.jpg',
      trailer: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
      cast: [
        { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
        { name: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem' },
        { name: 'Alia Bhatt', role: 'Sita' }
      ],
      director: 'S.S. Rajamouli',
      releaseDate: new Date('2022-03-25')
    }
  ];

  for (const movieData of movies) {
    const existingMovie = await Movie.findOne({ title: movieData.title });
    if (!existingMovie) {
      const movie = new Movie(movieData);
      await movie.save();
      console.log(`Movie created: ${movieData.title}`);
    }
  }
};

const seedTheaters = async () => {
  const theaters = [
    {
      name: 'PVR Cinemas',
      location: {
        address: '123 Mall Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1',
          capacity: 180,
          seatLayout: {
            rows: 12,
            seatsPerRow: 15
          },
          seatTypes: [
            {
              type: 'Economy',
              price: 150,
              rows: ['A', 'B', 'C', 'D']
            },
            {
              type: 'Premium',
              price: 200,
              rows: ['E', 'F', 'G', 'H']
            },
            {
              type: 'VIP',
              price: 300,
              rows: ['I', 'J', 'K', 'L']
            }
          ]
        },
        {
          screenNumber: 2,
          name: 'Screen 2',
          capacity: 150,
          seatLayout: {
            rows: 10,
            seatsPerRow: 15
          },
          seatTypes: [
            {
              type: 'Economy',
              price: 140,
              rows: ['A', 'B', 'C']
            },
            {
              type: 'Premium',
              price: 190,
              rows: ['D', 'E', 'F', 'G']
            },
            {
              type: 'VIP',
              price: 280,
              rows: ['H', 'I', 'J']
            }
          ]
        }
      ],
      amenities: ['Parking', 'Food Court', 'Air Conditioning', 'Wheelchair Access']
    },
    {
      name: 'INOX Multiplex',
      location: {
        address: '456 Cinema Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      screens: [
        {
          screenNumber: 1,
          name: 'INOX Screen 1',
          capacity: 200,
          seatLayout: {
            rows: 13,
            seatsPerRow: 16
          },
          seatTypes: [
            {
              type: 'Economy',
              price: 160,
              rows: ['A', 'B', 'C', 'D', 'E']
            },
            {
              type: 'Premium',
              price: 210,
              rows: ['F', 'G', 'H', 'I']
            },
            {
              type: 'VIP',
              price: 320,
              rows: ['J', 'K', 'L', 'M']
            }
          ]
        }
      ],
      amenities: ['Parking', 'Food Court', 'Air Conditioning', 'IMAX']
    }
  ];

  for (const theaterData of theaters) {
    const existingTheater = await Theater.findOne({ name: theaterData.name });
    if (!existingTheater) {
      const theater = new Theater(theaterData);
      await theater.save();
      console.log(`Theater created: ${theaterData.name}`);
    }
  }
};

const seedShows = async () => {
  const movies = await Movie.find().limit(2);
  const theaters = await Theater.find();

  if (movies.length === 0 || theaters.length === 0) {
    console.log('No movies or theaters found for creating shows');
    return;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const showTimes = ['10:00', '13:30', '17:00', '20:30'];

  for (const movie of movies) {
    for (const theater of theaters) {
      for (const screen of theater.screens) {
        for (const showTime of showTimes) {
          const existingShow = await Show.findOne({
            movie: movie._id,
            theater: theater._id,
            'screen.screenNumber': screen.screenNumber,
            showDate: today,
            showTime: showTime
          });

          if (!existingShow) {
            const show = new Show({
              movie: movie._id,
              theater: theater._id,
              screen: {
                screenNumber: screen.screenNumber,
                name: screen.name
              },
              showDate: today,
              showTime: showTime,
              language: movie.language[0],
              format: '2D',
              pricing: screen.seatTypes.map(st => ({
                seatType: st.type,
                price: st.price
              })),
              totalSeats: screen.capacity
            });

            await show.save();
            console.log(`Show created: ${movie.title} at ${theater.name} - ${showTime}`);
          }
        }
      }
    }
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    await seedUsers();
    await seedMovies();
    await seedTheaters();
    await seedShows();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();