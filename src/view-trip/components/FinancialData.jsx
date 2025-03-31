import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

const TripCostCalculator = ({ trip }) => {
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Currency conversion rates to INR (as of February 2025)
  const currencyConversionRates = {
    'GBP': 104.5,  // British Pound to INR
    'USD': 82.3,   // US Dollar to INR
    'EUR': 89.7,   // Euro to INR
    'AUD': 54.2,   // Australian Dollar to INR
    'INR': 1       // Indian Rupee to INR (no conversion needed)
  };

  useEffect(() => {
    const calculateCost = async () => {
      if (!trip) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5002/estimate-cost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trip),
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert all currency values to INR
        const originalCurrency = data.data.cost_breakdown.currency;
        const conversionRate = currencyConversionRates[originalCurrency] || 1;
        
        // Make a deep copy to avoid mutating the original data
        const convertedData = _.cloneDeep(data.data);
        
        // Convert total cost and per person cost
        convertedData.cost_breakdown.total_cost *= conversionRate;
        convertedData.cost_breakdown.per_person_cost *= conversionRate;
        
        // Convert breakdown costs
        Object.keys(convertedData.cost_breakdown.breakdown).forEach(key => {
          convertedData.cost_breakdown.breakdown[key] *= conversionRate;
        });
        
        // Update currency to INR
        convertedData.cost_breakdown.currency = 'INR';
        convertedData.original_currency = originalCurrency;
        convertedData.conversion_rate = conversionRate;
        
        setCostData(convertedData);
        
      } catch (err) {
        setError(`Failed to calculate trip cost: ${err.message}`);
        console.error('Error calculating trip cost:', err);
      } finally {
        setLoading(false);
      }
    };
    
    calculateCost();
  }, [trip]);
  
  // Calculate the range (base value to base value + 30%)
  const calculateRange = (value) => {
    const lowerBound = Math.round(value);
    const upperBound = Math.round(value * 1.3);
    return { lowerBound, upperBound };
  };
  
  // Format currency with commas for thousands
  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN');
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Calculating trip cost...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md border border-red-200">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!costData) {
    return null;
  }
  
  const { cost_breakdown, trip_details, original_currency, conversion_rate } = costData;
  const breakdown = cost_breakdown.breakdown;
  
  // Prepare data for charts with range values
  const breakdownChartData = Object.entries(breakdown).map(([category, amount]) => {
    const { lowerBound, upperBound } = calculateRange(amount);
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      lowerBound,
      upperBound,
      // Use average for the bar chart
      amount: (lowerBound + upperBound) / 2
    };
  });
  
  // Calculate ranges for total and per person costs
  const totalCostRange = calculateRange(cost_breakdown.total_cost);
  const perPersonCostRange = calculateRange(cost_breakdown.per_person_cost);
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Trip Cost Estimate</h2>
        <p className="text-lg">
          {trip_details.duration} in {trip_details.location} for {trip_details.people} people
        </p>
        <p className="text-sm opacity-80">Budget level: {trip_details.budget_level}</p>
      </div>
      
      <div className="p-6">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p className="font-medium mb-1">Disclaimer:</p>
          <p>All costs have been converted from {original_currency} to INR (1 {original_currency} = ₹{conversion_rate.toFixed(2)}). 
          The values shown are estimated ranges and do not include Flight data</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Total Cost Range</h3>
            <p className="text-3xl font-bold text-blue-900">
              ₹{formatCurrency(totalCostRange.lowerBound)} - ₹{formatCurrency(totalCostRange.upperBound)}
            </p>
            <p className="text-lg text-blue-700 mt-2">
              ₹{formatCurrency(perPersonCostRange.lowerBound)} - ₹{formatCurrency(perPersonCostRange.upperBound)} per person
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Location:</span> {trip_details.location}</p>
              <p><span className="font-medium">Duration:</span> {trip_details.duration}</p>
              <p><span className="font-medium">Group size:</span> {trip_details.people} people</p>
              <p><span className="font-medium">Budget level:</span> {trip_details.budget_level}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={120} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    return [`₹${formatCurrency(props.payload.lowerBound)} - ₹${formatCurrency(props.payload.upperBound)}`, 'Range'];
                  }} 
                />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Range (INR)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(breakdown).map(([category, amount]) => {
                  const { lowerBound, upperBound } = calculateRange(amount);
                  return (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ₹{formatCurrency(lowerBound)} - ₹{formatCurrency(upperBound)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    ₹{formatCurrency(totalCostRange.lowerBound)} - ₹{formatCurrency(totalCostRange.upperBound)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCostCalculator;