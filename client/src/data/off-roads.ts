export interface OffRoadTrip {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  description: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  inclusions: string[];
  exclusions: string[];
  thingsToPack: {
    item: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  gallery: string[];
  difficulty: string;
  ageLimit: string;
  groupSize: string;
  bestTime: string;
  terrain: string[];
  vehicles: string[];
  safetyFeatures: string[];
}

export const offRoadTrips: OffRoadTrip[] = [
  {
    id: "aravali-trail-rides",
    title: "Aravali Trail Rides",
    subtitle: "Conquer the Ancient Hills",
    location: "Delhi to Alwar",
    duration: "2N/3D (Extention Available)",
    rating: 4.6,
    reviewCount: 1200,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Aravalli.jpg",
    category: "Off-Road Adventure",
    description:
      "Experience the thrill of off-road driving through the ancient Aravali mountain range. Navigate rocky terrains, sandy patches, and forest trails while discovering hidden gems of Rajasthan's countryside. Perfect for adventure enthusiasts seeking an adrenaline-pumping weekend getaway.",
    highlights: [
      "Drive through 500+ million year old Aravali mountains",
      "Navigate challenging rocky terrains and sand dunes",
      "Visit ancient forts and heritage sites",
      "Professional off-road training and guidance",
      "Camping under the stars in the wilderness",
      "Traditional Rajasthani cuisine and cultural experiences",
    ],
    itinerary: [
      {
        day: 1,
        title: "Delhi to Alwar | Off-Road Training",
        description:
          "Depart from Delhi and reach Alwar. Get introduced to off-road vehicles and basic training.",
        activities: [
          "Morning departure from Delhi (6:00 AM)",
          "Reach Alwar base camp (10:00 AM)",
          "Vehicle briefing and safety instructions",
          "Basic off-road driving training",
          "Lunch at base camp",
          "First trail ride through easy terrain",
          "Evening campfire and dinner",
          "Overnight camping",
        ],
      },
      {
        day: 2,
        title: "Aravali Trail Exploration | Advanced Terrain",
        description:
          "Full day of challenging off-road trails through the Aravali hills.",
        activities: [
          "Early morning breakfast",
          "Advanced off-road trail through rocky terrain",
          "Visit to Bhangarh Fort ruins",
          "Lunch in the wilderness",
          "Sand dune driving experience",
          "Sunset point at hilltop",
          "Traditional Rajasthani dinner",
          "Night stay at eco-resort",
        ],
      },
      {
        day: 3,
        title: "Final Trail | Return to Delhi",
        description: "Morning trail ride and return journey to Delhi.",
        activities: [
          "Sunrise photography session",
          "Final challenging trail",
          "Breakfast at scenic location",
          "Certificate ceremony",
          "Departure to Delhi (12:00 PM)",
          "Reach Delhi by evening (6:00 PM)",
        ],
      },
    ],
    inclusions: [
      "Transportation from Delhi to Alwar and back",
      "Professional off-road vehicles (Mahindra Thar/Gypsy)",
      "Experienced off-road instructors and guides",
      "All meals (2 breakfasts, 3 lunches, 2 dinners)",
      "Accommodation (1 night camping, 1 night eco-resort)",
      "Safety equipment (helmets, first aid)",
      "Entry fees to monuments and trails",
      "Certificate of completion",
      "Photography and videography",
      "Fuel for off-road vehicles",
    ],
    exclusions: [
      "Personal expenses and shopping",
      "Travel insurance",
      "Any meals not mentioned in inclusions",
      "Tips and gratuities",
      "Damage to vehicles due to negligence",
      "Medical expenses",
      "Alcoholic beverages",
    ],
    thingsToPack: [
      {
        item: "Comfortable Clothing",
        description:
          "Wear comfortable, breathable clothes suitable for outdoor activities. Avoid loose clothing.",
      },
      {
        item: "Closed Shoes",
        description:
          "Sturdy closed shoes with good grip are essential for off-road driving and walking on rocky terrain.",
      },
      {
        item: "Sun Protection",
        description:
          "Sunglasses, sunscreen, and hat to protect from desert sun and dust.",
      },
      {
        item: "Personal Medications",
        description:
          "Carry any personal medications and basic first aid items.",
      },
    ],
    faqs: [
      {
        question: "Do I need prior off-road driving experience?",
        answer:
          "No prior experience is required. We provide comprehensive training and our experienced instructors will guide you throughout the trip.",
      },
      {
        question: "What type of vehicles are used?",
        answer:
          "We use Mahindra Thar and Maruti Gypsy vehicles, which are specially modified for off-road adventures with safety equipment.",
      },
      {
        question: "Is the trip suitable for beginners?",
        answer:
          "Yes, the trip is designed for all skill levels. We start with basic training and gradually progress to more challenging terrains.",
      },
      {
        question: "What is the best time to visit?",
        answer:
          "October to March is the best time when the weather is pleasant. We avoid monsoon season for safety reasons.",
      },
      {
        question: "Are there any age restrictions?",
        answer:
          "Participants must be 18+ years old with a valid driving license. Passengers can be 12+ years old.",
      },
    ],
    gallery: [
      "https://images.pexels.com/photos/20620843/pexels-photo-20620843.jpeg",
      "https://images.pexels.com/photos/1702972/pexels-photo-1702972.jpeg",
      "https://images.pexels.com/photos/15053777/pexels-photo-15053777.jpeg",
    ],
    difficulty: "Moderate",
    ageLimit: "18+ (with valid license)",
    groupSize: "8-12 participants",
    bestTime: "October to March",
    terrain: ["Rocky Hills", "Sand Dunes", "Forest Trails", "River Crossings"],
    vehicles: ["Mahindra Thar", "Maruti Gypsy", "Modified 4x4"],
    safetyFeatures: [
      "Professional instructors",
      "First aid kit",
      "Communication devices",
      "Safety helmets",
      "Vehicle maintenance",
      "Emergency backup",
    ],
  },
  {
    id: "adventure-park",
    title: "Off Road Adventure Park",
    subtitle: "Ultimate Thrill Experience",
    location: "Gurgaon Adventure Park",
    duration: "1 Day (Extention Available)",
    rating: 4.8,
    reviewCount: 2500,
    image: "https://images.pexels.com/photos/2346106/pexels-photo-2346106.jpeg",
    category: "Adventure Park",
    description:
      "Experience the ultimate off-road adventure at India's premier adventure park. With specially designed tracks, obstacles, and challenges, this park offers everything from beginner-friendly trails to extreme off-road courses. Perfect for corporate team building, family outings, or solo adventures.",
    highlights: [
      "Multiple difficulty levels from beginner to extreme",
      "Specially designed obstacle courses",
      "Professional grade off-road vehicles",
      "Expert training and safety briefing",
      "Competitive racing tracks",
      "Team building activities and challenges",
    ],
    itinerary: [
      {
        day: 1,
        title: "Full Day Adventure Park Experience",
        description:
          "Complete day of off-road adventures with multiple activities and challenges.",
        activities: [
          "9:00 AM - Registration and welcome",
          "9:30 AM - Safety briefing and vehicle orientation",
          "10:00 AM - Beginner trail experience",
          "11:30 AM - Obstacle course challenge",
          "1:00 PM - Lunch break",
          "2:00 PM - Advanced trail riding",
          "3:30 PM - Competitive racing session",
          "4:30 PM - Team challenges and games",
          "5:30 PM - Certificate ceremony and departure",
        ],
      },
    ],
    inclusions: [
      "Entry to adventure park",
      "Professional off-road vehicles",
      "Safety equipment (helmets, protective gear)",
      "Expert instructors and guides",
      "Lunch and refreshments",
      "All activity fees",
      "Certificate of participation",
      "Photography service",
      "First aid and medical support",
      "Parking facilities",
    ],
    exclusions: [
      "Transportation to/from the park",
      "Personal expenses",
      "Additional food and beverages",
      "Travel insurance",
      "Damage charges for reckless driving",
      "Personal photography equipment",
    ],
    thingsToPack: [
      {
        item: "Comfortable Sports Wear",
        description:
          "Wear comfortable sports clothing that allows free movement. Avoid loose or flowing clothes.",
      },
      {
        item: "Sports Shoes",
        description:
          "Closed sports shoes with good grip are mandatory for all activities.",
      },
      {
        item: "Water Bottle",
        description:
          "Stay hydrated throughout the day with your personal water bottle.",
      },
      {
        item: "Change of Clothes",
        description:
          "Bring an extra set of clothes as you might get dusty during the activities.",
      },
    ],
    faqs: [
      {
        question: "What is the minimum age requirement?",
        answer:
          "Drivers must be 18+ with a valid license. Passengers can be 12+ years old. Children under 12 can participate in specific family-friendly activities.",
      },
      {
        question: "Do you provide training for beginners?",
        answer:
          "Yes, we provide comprehensive training for all skill levels. Our expert instructors ensure everyone can participate safely.",
      },
      {
        question: "What safety measures are in place?",
        answer:
          "We have professional instructors, safety equipment, first aid facilities, and all vehicles are regularly maintained and inspected.",
      },
      {
        question: "Can we book for corporate events?",
        answer:
          "Yes, we offer special corporate packages with team building activities, customized challenges, and group discounts.",
      },
      {
        question: "What happens in case of bad weather?",
        answer:
          "Activities may be modified or rescheduled for safety. We provide covered areas and alternative indoor activities if needed.",
      },
    ],
    gallery: [
      "https://images.pexels.com/photos/7772887/pexels-photo-7772887.jpeg",
      "https://images.pexels.com/photos/29666812/pexels-photo-29666812.png",
      "https://images.pexels.com/photos/26550994/pexels-photo-26550994.jpeg",
    ],
    difficulty: "All Levels",
    ageLimit: "12+ (18+ for driving)",
    groupSize: "1-50 participants",
    bestTime: "Year Round",
    terrain: [
      "Artificial Obstacles",
      "Mud Tracks",
      "Rock Climbing",
      "Water Crossings",
    ],
    vehicles: ["Modified ATVs", "4x4 Jeeps", "Dirt Bikes", "Go-Karts"],
    safetyFeatures: [
      "Certified instructors",
      "Medical facility on-site",
      "Safety equipment provided",
      "Regular vehicle maintenance",
      "Emergency response team",
      "Insurance coverage",
    ],
  },
];
