export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: 'U' | 'U/A' | 'A' | 'S';
  language: string[];
  poster: string;
  trailer?: string;
  cast: {
    name: string;
    role: string;
  }[];
  director: string;
  releaseDate: string;
  isActive: boolean;
}

export interface Theater {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  screens: Screen[];
  amenities: string[];
  isActive: boolean;
}

export interface Screen {
  screenNumber: number;
  name: string;
  capacity: number;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };
  seatTypes: SeatType[];
}

export interface SeatType {
  type: 'Economy' | 'Premium' | 'VIP';
  price: number;
  rows: string[];
}

export interface Show {
  _id: string;
  movie: Movie;
  theater: Theater;
  screen: {
    screenNumber: number;
    name: string;
  };
  showDate: string;
  showTime: string;
  language: string;
  format: '2D' | '3D' | 'IMAX' | '4DX';
  pricing: {
    seatType: 'Economy' | 'Premium' | 'VIP';
    price: number;
  }[];
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  seatNumber: string;
  seatType: 'Economy' | 'Premium' | 'VIP';
  isAvailable: boolean;
  price?: number;
}

export interface Booking {
  _id: string;
  bookingId: string;
  user: string;
  show: Show;
  movie: Movie;
  theater: Theater;
  seats: {
    seatNumber: string;
    seatType: 'Economy' | 'Premium' | 'VIP';
    price: number;
  }[];
  totalAmount: number;
  bookingDate: string;
  showDate: string;
  showTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BookingRequest {
  showId: string;
  seats: {
    seatNumber: string;
    seatType: 'Economy' | 'Premium' | 'VIP';
  }[];
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}