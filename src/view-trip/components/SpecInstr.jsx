import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TravelAdvisor = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState(null);
  const [error, setError] = useState(null);

  const location = trip?.userChoice?.location?.label || '';


  const generatePrompt = (location) => {
    return `As a travel expert, analyze ${location} and provide specific travel instructions and advisories. Focus on:

1. Weather-related clothing recommendations
2. Terrain-specific warnings (motion sickness, altitude, etc.)
3. Essential items to pack
4. Local customs and etiquette to be aware of

Please format your response using markdown with proper headings (##) for each category and bullet points (*) for list items.`;
  };

  useEffect(() => {
    if (location) {
      handleFetchInstructions();
    }
  }, [location]);

  const handleFetchInstructions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: generatePrompt(location)
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini Raw Response:', data);

      // Extract the text from Gemini's response
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Generated Text:', generatedText);

      setInstructions(generatedText);
    } catch (error) {
      console.error('Error fetching instructions:', error);
      setError('Failed to get travel instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-gray-600 text-center py-4">
          Getting travel instructions for {location}...
        </div>
      );
    }

    if (instructions) {
      return (
        <div className="prose max-w-none p-6 bg-gray-50 rounded-lg">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-700 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 mb-4" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
              em: ({node, ...props}) => <em className="text-gray-800 italic" {...props} />
            }}
          >
            {instructions}
          </ReactMarkdown>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Travel Advisory for {location}
      </h2>
      
      {renderContent()}
    </div>
  );
};

export default TravelAdvisor;