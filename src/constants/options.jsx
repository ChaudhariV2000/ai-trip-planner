export const SelectTravelList = [
  {
    id: 1,
    title: "Solo Adventure",
    desc: "Embark on a journey of self-discovery",
    icon: "🏃",
    people: "1 person"
  },
  {
    id: 2,
    title: "Educational Trip",
    desc: "Learn about the world ",
    icon: "📖",
    people: "2 people"
  },
  {
    id: 3,
    title: "Family Fun",
    desc: "Create unforgettable memories with loved ones",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 4 people"
  },
  {
    id: 4,
    title: "Friends' Escapade",
    desc: "Thrilling adventures with your best pals",
    icon: "👥",
    people: "5 to 10 people"
  },
  {
    id: 5,
    title: "Small Group Tour",
    desc: "Perfect for meeting new travel companions",
    icon: "🌟",
    people: "8 to 12 people"
  },
  {
    id: 6,
    title: "Team Building",
    desc: "Corporate retreat or work event",
    icon: "💼",
    people: "10 to 15 people"
  }
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Budget-Friendly",
    desc: "Travel smart, spend less",
    icon: "🪙"
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balance comfort and cost",
    icon: "💰"
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Indulge in lavish experiences",
    icon: "👑"
  }
];

// Rest of the code remains the same...
export const AI_PROMPT = `
  Generate a travel plan for the destination: {location} for {totalDays} days. 
  Traveler type: {traveler}, with a {budget} budget. 
  Provide a list of hotel options including the name, address, and the most recent image URL (ensure the URL is working), geo coordinates, rating, and descriptions. 
  Suggest a daily itinerary with place names, details, image URLs, geo coordinates, ticket pricing, ratings, and travel time for each location for {totalDays} days, including the best time to visit. 
  Output in JSON format.
`;
export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
