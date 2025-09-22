import React from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Details</h1>
      <p className="text-gray-600">Movie ID: {id}</p>
    </div>
  );
};

export default MovieDetail;