import React from 'react';

const HotelCard = ({ hotel }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="h-48 overflow-hidden">
      <img 
        src={hotel.imageUrl || "/api/placeholder/400/300"} 
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{hotel.address}</p>
      <p className="text-gray-700 mb-3">{hotel.description}</p>
      <div className="flex items-center">
        <span className="text-yellow-500">★</span>
        <span className="ml-1 text-gray-600">{hotel.rating}/5</span>
      </div>
    </div>
  </div>
);

const Hotels = ({ trip }) => {
  if (!trip?.tripData?.hotels) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trip.tripData.hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Hotels;