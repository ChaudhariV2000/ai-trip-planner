import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const TransportPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const trip = location.state?.trip;
    const [source, setSource] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!trip) {
            setError('No trip data available. Please select a destination.');
        }
    }, [trip]);

    const fetchTransportOptions = async () => {
        if (!source || !trip?.userChoice?.location?.label || !date) {
            setError('Please enter your source and select a date.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const flightRes = await axios.get('http://localhost:5001/api/flights', {
                params: { source, destination: trip.userChoice.location.label, date },
            });
            setFlights(flightRes.data);
            console.log(flightRes.data);
        } catch (err) {
            setError('Failed to fetch transport data. Please try again.');
            console.error('Error fetching transport options:', err);
        }

        setLoading(false);
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
                Back
            </button>

            {/* Page Title */}
            <h1 className="text-3xl font-bold mt-4 text-center text-blue-600">
                Transport Options to {trip?.userChoice?.location?.label || 'Unknown Destination'}
            </h1>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            {/* Input Fields: Location & Date */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Enter your current location"
                    className="border p-2 rounded-lg w-64"
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded-lg w-64"
                />

                <button
                    onClick={fetchTransportOptions}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {loading ? 'Loading...' : 'Search'}
                </button>
            </div>

            {/* Flights Section */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Available Flights</h2>

                {flights.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flights.map((flight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition"
                            >
                                <h3 className="text-xl font-bold text-blue-500">{flight.airline}</h3>
                                <p className="text-gray-700"><strong>Flight No:</strong> {flight.flight}</p>
                                <p className="text-gray-700"><strong>Departure:</strong> {new Date(flight.departure_time).toLocaleTimeString()}</p>
                                <p className="text-gray-700"><strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleTimeString()}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No flights available.</p>
                )}
            </div>
        </div>
    );
};

export default TransportPage;
