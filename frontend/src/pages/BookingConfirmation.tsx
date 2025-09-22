import React from 'react';
import { useParams } from 'react-router-dom';

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Confirmation</h1>
      <p className="text-gray-600">Booking ID: {bookingId}</p>
    </div>
  );
};

export default BookingConfirmation;