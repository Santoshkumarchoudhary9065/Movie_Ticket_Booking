import api from './api';
import { Booking, BookingRequest } from '../types';

export const bookingService = {
  // Get show details with seat availability
  getShowDetails: async (showId: string) => {
    const response = await api.get(`/bookings/show/${showId}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: BookingRequest): Promise<{
    message: string;
    booking: Booking;
  }> => {
    const response = await api.post('/bookings/book', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Get booking details
  getBookingDetails: async (bookingId: string): Promise<{ booking: Booking }> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ message: string }> => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};