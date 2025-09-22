import React from 'react';
import { useParams } from 'react-router-dom';

const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Seats</h1>
      <p className="text-gray-600">Show ID: {showId}</p>
    </div>
  );
};

export default SeatSelection;