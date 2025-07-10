export interface Tour {
  id: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string[];
  description: string;
  highlights: string[];
  inclusions: {
    meals: boolean;
    stays: boolean;
    transfers: boolean;
    activities: boolean;
  };
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  inclusionsList: string[];
  exclusionsList: string[];
  thingsToPack: {
    item: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  gallery: string[];
  pickupDrop: string;
  ageLimit: string;
  difficulty: string;
}

export const tourData: Tour[] = [
  {
    id: "spiti-valley-bike-backpacking",
    title: "Spiti Valley Bike and Backpacking Trip",
    location: "Delhi to Delhi",
    duration: "10 Days",
    rating: 4.8,
    reviewCount: 8700,
    image:
      "https://w0.peakpx.com/wallpaper/656/103/HD-wallpaper-bike-himalayan-bike-trip-chitkul-himachal-pradesh-himalayan-kaza-mountains-india-royal-enfield-spiti-valley.jpg",
    category: ["Self-Riding", "Group"],
    description:
      "A bike trip to Spiti valley where you get to traverse through some of the most mystifying valleys of Himachal is a dream for many travelers. The reason why Spiti is on the bucket list of many, be it adventure enthusiasts or people looking for a peaceful retreat is that, in its embrace, Spiti Valley holds both calm and chaos.",
    highlights: [
      "Ride through the world's most dangerous roads",
      "Visit ancient monasteries and villages",
      "Experience the cold desert mountain landscape",
      "Cross high altitude passes like Kunzum La and Rohtang Pass",
    ],
    inclusions: {
      meals: true,
      stays: true,
      transfers: true,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Delhi to Jibhi | Overnight Journey",
        description:
          "Start your journey from Delhi to Jibhi with an overnight bus journey.",
        activities: [
          "Departure from Delhi",
          "Overnight travel",
          "Rest and preparation",
        ],
      },
      {
        day: 2,
        title: "Jibhi Arrival | Bike Introduction | Day at Leisure",
        description:
          "Arrive in Jibhi, get introduced to your bikes, and spend the day at leisure.",
        activities: [
          "Bike allocation and briefing",
          "Local sightseeing",
          "Acclimatization",
        ],
      },
      {
        day: 3,
        title: "Jibhi to Chitkul (214 Kms)",
        description:
          "Ride from Jibhi to Chitkul, the last village on Indo-Tibet border.",
        activities: ["Mountain riding", "Border village visit", "Photography"],
      },
      {
        day: 4,
        title: "Chitkul to Kalpa (60 Kms)",
        description:
          "Short ride to Kalpa with stunning views of Kinnaur Kailash.",
        activities: [
          "Kinnaur Kailash views",
          "Apple orchards visit",
          "Local culture",
        ],
      },
      {
        day: 5,
        title: "Kalpa to Dhankar (200 Kms)",
        description:
          "Long riding day through changing landscapes to reach Dhankar.",
        activities: [
          "Landscape photography",
          "High altitude riding",
          "Monastery visit",
        ],
      },
    ],
    inclusionsList: [
      "AC Volvo Bus from Delhi to Manali and return",
      "Transportation in Tempo Traveller from Jibhi to Manali",
      "Himalayan BS6 Bikes",
      "Bike Rent & Fuel from Manali to Manali",
      "Temporary lodgings for bikers to freshen up in Manali",
      "Surface Transfer from Aut to Jibhi for people travelling in tempo travelers",
      "Riding Gears: Knee guard, Elbow guard, Helmet, Riding Jacket - Level 2",
      "Accommodation on sharing basis as per itinerary",
      "Meal Plan: MAP Plan (Total 14 Meals - 1 Meal on Day 2 (D) + 2 Meals on Day 3 (B+D) + 2 Meals on Day 4 (B+D) + 2 Meals on Day 5 (B+D) + 2 Meals on Day 6 (B+D) + 2 Meals on Day 7 (B+D) + 2 Meals on Day 8 (B+D) + 1 Meals on Day 9 (B))",
      "Evening Tea on Day 3,4,5,6,7 and 8",
      "The Trip Lead will be present at all times during the tour",
      "The Bike Marshal will guide you throughout",
      "Adventure Medical Insurance",
      "Spare Parts of a Bike (Personal Expense)",
      "Toolkit",
      "Backup Vehicle",
      "Mechanical Support",
      "Permits Required",
      "First Aid Kits",
      "Oxygen Cylinders",
      "Oximeter",
    ],
    exclusionsList: [
      "5% GST",
      "Early check-in (Before 1:00 PM) & Late Check-out (After 11:00 AM) at the hotel",
      "Any additional expenses such as of personal nature",
      "Additional accommodation/food costs incurred due to any delayed travel",
      "Any lunch and other meals not mentioned in Package Inclusions",
      "Any Airfare / Rail fare other than what is mentioned in Inclusions or any type of transportation",
      "Parking and monument entry fees during sightseeing",
      "Additional Costs due to Flight Cancellations, Landslides, Roadblocks, and other natural calamities",
      "Any other services not specified above in inclusions",
      "Vehicle servicing or maintenance cost and security deposit per motorbike of Rs. 5,000/-",
    ],
    thingsToPack: [
      {
        item: "Rucksack",
        description:
          "You must pick a good quality backpack with a comfortable fit and straps that won't give you shoulder pain. You can check out your nearest Decathlon store for a good trekking backpack.",
      },
      {
        item: "Day Bag / Day Pack",
        description:
          "When you head towards the summit, you are required to carry only a few necessary items and for that, you need a day backpack as you will leave your bigger one on the campsite.",
      },
      {
        item: "Riding Jacket",
        description:
          "A good quality riding jacket with proper padding and protection for long distance motorcycle riding.",
      },
      {
        item: "Riding Gloves",
        description:
          "Essential for grip and protection during long riding hours in varying weather conditions.",
      },
    ],
    faqs: [
      {
        question: "How to Reach Spiti Valley From Manali?",
        answer:
          "Spiti Valley can be reached from Manali via the Rohtang Pass and Kunzum Pass route. The journey takes approximately 8-10 hours depending on road conditions.",
      },
      {
        question: "Is It Safe to Visit Manali in December?",
        answer:
          "December is winter season in Manali with heavy snowfall. While it's beautiful, road conditions can be challenging and some routes may be closed.",
      },
      {
        question:
          "How Much Time it Takes to Cover the Manali to Spiti Distance?",
        answer:
          "The distance from Manali to Spiti is approximately 200 km and takes 8-10 hours by road, depending on weather and road conditions.",
      },
      {
        question: "Can We Visit Chitkul in December?",
        answer:
          "Chitkul experiences heavy snowfall in December and the road may be closed. It's better to visit between May to October.",
      },
      {
        question: "What Is the Best Time to Visit Spiti Valley?",
        answer:
          "The best time to visit Spiti Valley is from May to October when the weather is pleasant and roads are accessible.",
      },
    ],
    gallery: [
      "https://images.pexels.com/photos/31756532/pexels-photo-31756532.jpeg",
      "https://images.pexels.com/photos/28238704/pexels-photo-28238704.jpeg",
      "https://images.pexels.com/photos/5324309/pexels-photo-5324309.jpeg",
    ],
    pickupDrop: "Delhi to Delhi",
    ageLimit: "18-45",
    difficulty: "Moderate to Challenging",
  },
  {
    id: "meghalaya-backpacking",
    title: "Backpacking Trip to Meghalaya",
    location: "Guwahati to Guwahati",
    duration: "5N/6D",
    rating: 4.7,
    reviewCount: 5200,
    image:
      "https://images.wanderon.in/blogs/new/2024/06/hiking-in-meghalaya.webp",
    category: ["Guided", "Group"],
    description:
      "Explore the Scotland of the East with this comprehensive backpacking trip to Meghalaya. Experience living root bridges, crystal clear rivers, and the wettest place on Earth.",
    highlights: [
      "Visit the famous Living Root Bridges",
      "Explore Cherrapunji and Mawlynnong",
      "Experience local Khasi culture",
      "Trek through pristine forests",
    ],
    inclusions: {
      meals: true,
      stays: true,
      transfers: true,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Guwahati | Transfer to Shillong",
        description:
          "Arrive in Guwahati and transfer to Shillong, the capital of Meghalaya.",
        activities: [
          "Airport pickup",
          "Drive to Shillong",
          "Check-in and rest",
        ],
      },
      {
        day: 2,
        title: "Shillong to Cherrapunji",
        description:
          "Visit the wettest place on Earth and explore various waterfalls.",
        activities: ["Nohkalikai Falls", "Seven Sisters Falls", "Mawsmai Cave"],
      },
    ],
    inclusionsList: [
      "Accommodation on twin sharing basis",
      "All meals as per itinerary",
      "All transfers and sightseeing by private vehicle",
      "Professional guide",
      "All entry fees and permits",
    ],
    exclusionsList: [
      "Airfare to/from Guwahati",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
    ],
    thingsToPack: [
      {
        item: "Rain Gear",
        description:
          "Essential for Meghalaya's unpredictable weather and frequent rainfall.",
      },
      {
        item: "Trekking Shoes",
        description:
          "Good grip shoes for walking on wet and slippery surfaces.",
      },
    ],
    faqs: [
      {
        question: "What is the best time to visit Meghalaya?",
        answer:
          "October to April is the best time when the weather is pleasant and rainfall is minimal.",
      },
    ],
    gallery: [
      "https://images.pexels.com/photos/18442775/pexels-photo-18442775.jpeg",
      "https://images.unsplash.com/photo-1593813738953-fb3c93e0769d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVnaGFsYXlhfGVufDB8fDB8fHww",
    ],
    pickupDrop: "Guwahati to Guwahati",
    ageLimit: "18-60",
    difficulty: "Easy to Moderate",
  },
  {
    id: "ladakh-corporate-tour",
    title: "Corporate Team Building - Ladakh Adventure",
    location: "Delhi to Delhi",
    duration: "7N/8D",
    rating: 4.9,
    reviewCount: 1200,
    image:
      "https://images.pexels.com/photos/25025516/pexels-photo-25025516.jpeg",
    category: ["Corporate", "Guided"],
    description:
      "A perfect corporate retreat combining adventure, team building activities, and the breathtaking landscapes of Ladakh.",
    highlights: [
      "Team building activities at high altitude",
      "Visit to Pangong Tso and Nubra Valley",
      "Corporate workshops with mountain backdrop",
      "Adventure activities like river rafting",
    ],
    inclusions: {
      meals: true,
      stays: true,
      transfers: true,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Delhi to Leh | Flight Journey",
        description:
          "Fly from Delhi to Leh and acclimatize to the high altitude.",
        activities: [
          "Flight to Leh",
          "Rest and acclimatization",
          "Welcome dinner",
        ],
      },
    ],
    inclusionsList: [
      "Return flights Delhi-Leh-Delhi",
      "Luxury accommodation",
      "All meals and refreshments",
      "Professional team building facilitator",
      "All adventure activities",
    ],
    exclusionsList: [
      "Personal expenses",
      "Alcohol",
      "Travel insurance",
      "Medical expenses",
    ],
    thingsToPack: [
      {
        item: "Formal Attire",
        description: "For corporate sessions and formal dinners.",
      },
    ],
    faqs: [
      {
        question: "Is this suitable for all fitness levels?",
        answer:
          "Yes, activities are designed to accommodate different fitness levels with alternatives available.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1574701427742-acc058398496?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fExhZGFraCUyMEFkdmVudHVyZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    pickupDrop: "Delhi to Delhi",
    ageLimit: "25-55",
    difficulty: "Easy",
  },
  {
    id: "rajasthan-self-riding",
    title: "Royal Rajasthan Self-Riding Tour",
    location: "Jaipur to Jaipur",
    duration: "8N/9D",
    rating: 4.6,
    reviewCount: 3400,
    image:
      "https://images.pexels.com/photos/32367738/pexels-photo-32367738.jpeg",
    category: ["Self-Riding", "Custom"],
    description:
      "Explore the royal heritage of Rajasthan on your own motorcycle, visiting majestic forts, palaces, and desert landscapes.",
    highlights: [
      "Self-guided motorcycle tour",
      "Visit Jaipur, Jodhpur, Jaisalmer, Udaipur",
      "Desert camping experience",
      "Palace and fort explorations",
    ],
    inclusions: {
      meals: true,
      stays: true,
      transfers: false,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jaipur | Bike Handover",
        description:
          "Arrive in Jaipur, collect your motorcycle and explore the Pink City.",
        activities: ["Bike briefing", "City Palace visit", "Hawa Mahal"],
      },
    ],
    inclusionsList: [
      "Royal Enfield motorcycle rental",
      "Fuel for the entire journey",
      "Heritage hotel accommodations",
      "Breakfast and dinner",
      "Route maps and GPS device",
    ],
    exclusionsList: [
      "Lunch meals",
      "Entry fees to monuments",
      "Personal expenses",
      "Bike damage charges",
    ],
    thingsToPack: [
      {
        item: "Riding Gear",
        description:
          "Complete riding gear including helmet, jacket, and protective clothing.",
      },
    ],
    faqs: [
      {
        question: "Do I need a motorcycle license?",
        answer:
          "Yes, a valid motorcycle driving license is mandatory for this self-riding tour.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1584297875607-e85a9608d5b7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um95YWwlMjBSYWphc3RoYW4lMjBTZWxmJTIwUmlkaW5nJTIwVG91cnxlbnwwfHwwfHx8MA%3D%3D",
    ],
    pickupDrop: "Jaipur to Jaipur",
    ageLimit: "21-50",
    difficulty: "Moderate",
  },
  {
    id: "kerala-guided-tour",
    title: "Kerala Backwaters Guided Experience",
    location: "Kochi to Kochi",
    duration: "6N/7D",
    rating: 4.8,
    reviewCount: 4100,
    image: "https://images.pexels.com/photos/5374224/pexels-photo-5374224.jpeg",
    category: ["Guided", "Group"],
    description:
      "Experience God's Own Country with guided tours through backwaters, spice plantations, and hill stations.",
    highlights: [
      "Houseboat stay in Alleppey",
      "Spice plantation tours in Munnar",
      "Traditional Kathakali performance",
      "Ayurvedic spa treatments",
    ],
    inclusions: {
      meals: true,
      stays: true,
      transfers: true,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi | City Tour",
        description:
          "Arrive in Kochi and explore the historic Fort Kochi area.",
        activities: [
          "Chinese fishing nets",
          "St. Francis Church",
          "Dutch Palace",
        ],
      },
    ],
    inclusionsList: [
      "AC accommodation",
      "Houseboat stay",
      "All meals",
      "Professional guide",
      "All transfers",
    ],
    exclusionsList: [
      "Airfare",
      "Personal expenses",
      "Optional activities",
      "Tips",
    ],
    thingsToPack: [
      {
        item: "Light Cotton Clothes",
        description:
          "Comfortable clothing suitable for Kerala's tropical climate.",
      },
    ],
    faqs: [
      {
        question: "What is the best time to visit Kerala?",
        answer:
          "October to March is ideal with pleasant weather and minimal rainfall.",
      },
    ],
    gallery: [
      "https://images.pexels.com/photos/20830782/pexels-photo-20830782.jpeg",
      "https://images.pexels.com/photos/31381682/pexels-photo-31381682.jpeg",
    ],
    pickupDrop: "Kochi to Kochi",
    ageLimit: "All ages",
    difficulty: "Easy",
  },
  {
    id: "goa-custom-tour",
    title: "Customized Goa Beach Experience",
    location: "Goa",
    duration: "4N/5D",
    rating: 4.5,
    reviewCount: 2800,
    image: "https://images.pexels.com/photos/2174660/pexels-photo-2174660.jpeg",
    category: ["Custom", "Group"],
    description:
      "A fully customizable Goa experience with beaches, nightlife, water sports, and cultural exploration.",
    highlights: [
      "Customizable itinerary",
      "Beach hopping",
      "Water sports activities",
      "Portuguese heritage sites",
    ],
    inclusions: {
      meals: false,
      stays: true,
      transfers: true,
      activities: true,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa | Beach Time",
        description: "Arrive in Goa and head to your chosen beach destination.",
        activities: ["Beach relaxation", "Sunset viewing", "Local cuisine"],
      },
    ],
    inclusionsList: [
      "Beach resort accommodation",
      "Airport transfers",
      "Water sports package",
      "Sightseeing tours",
    ],
    exclusionsList: [
      "Meals",
      "Alcohol",
      "Personal expenses",
      "Additional activities",
    ],
    thingsToPack: [
      {
        item: "Beach Wear",
        description: "Swimwear, beach clothes, and sun protection essentials.",
      },
    ],
    faqs: [
      {
        question: "Can I customize my itinerary?",
        answer:
          "Yes, this tour is fully customizable based on your preferences and interests.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R29hfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEdvYXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    pickupDrop: "Goa Airport",
    ageLimit: "All ages",
    difficulty: "Easy",
  },
];

export const tourCategories = [
  { id: "all", name: "All Tours", count: tourData.length },
  {
    id: "guided-tours",
    name: "Guided Tours",
    count: tourData.filter((tour) => tour.category.includes("Guided")).length,
  },
  {
    id: "self-riding",
    name: "Self-Riding Tours",
    count: tourData.filter((tour) => tour.category.includes("Self-Riding"))
      .length,
  },
  {
    id: "corporate-tours",
    name: "Corporate Tours",
    count: tourData.filter((tour) => tour.category.includes("Corporate"))
      .length,
  },
  {
    id: "group-tours",
    name: "Group Tours",
    count: tourData.filter((tour) => tour.category.includes("Group")).length,
  },
  {
    id: "custom-tours",
    name: "Custom Tours",
    count: tourData.filter((tour) => tour.category.includes("Custom")).length,
  },
];
