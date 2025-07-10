export interface Car {
  id: string;
  name: string;
  type: string;
  year: number;
  image: string;
  seats: number;
  fuelType: string;
  transmission: string;
  location: string;
  available: boolean;
  features: string[];
  description: string;
}

export const carData: Record<string, Car[]> = {
  budget: [
    {
      id: "hyundai-creta",
      name: "Hyundai Creta",
      type: "SUV",
      year: 2023,

      image:
        "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/Highlights/mob/cretagalleryb2.jpg",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Mumbai",
      available: true,
      features: [
        "Air Conditioning",
        "Power Steering",
        "Central Locking",
        "ABS",
      ],
      description:
        "The Hyundai Creta is a compact SUV that offers great value for money with modern features and reliable performance.",
    },
    {
      id: "tata-nexon",
      name: "Tata Nexon",
      type: "SUV",
      year: 2023,

      image: "https://imgd-ct.aeplcdn.com/664x415/n/eu89ifb_1818191.jpg?q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Delhi",
      available: true,
      features: [
        "Touchscreen Infotainment",
        "Reverse Camera",
        "Dual Airbags",
        "EBD",
      ],
      description:
        "Tata Nexon combines safety, style, and performance in an affordable package perfect for city driving.",
    },
    {
      id: "suzuki-ertiga",
      name: "Suzuki Ertiga",
      type: "MPV",
      year: 2022,

      image: "https://imgd.aeplcdn.com/1056x594/n/c6es93a_1572125.jpg?q=80",
      seats: 7,
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Bangalore",
      available: true,
      features: [
        "7 Seater",
        "Fuel Efficient",
        "Spacious Interior",
        "Smart Play Infotainment",
      ],
      description:
        "Perfect for families, the Suzuki Ertiga offers 7-seater comfort with excellent fuel efficiency.",
    },
  ],
  premium: [
    {
      id: "audi-a4",
      name: "Audi A4",
      type: "Sedan",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/664x374/cw/ec/22613/Audi-A4-Right-Front-Three-Quarter-165484.jpg?wm=0&q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Mumbai",
      available: true,
      features: [
        "Virtual Cockpit",
        "MMI Navigation",
        "Bang & Olufsen Sound",
        "Quattro AWD",
      ],
      description:
        "The Audi A4 delivers premium luxury with cutting-edge technology and exceptional driving dynamics.",
    },
    {
      id: "mercedes-a-class",
      name: "Mercedes-Benz A-Class Limousine",
      type: "Sedan",
      year: 2023,

      image:
        "https://imgd-ct.aeplcdn.com/1280x720/n/cw/ec/149525/a-class-limousine-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Delhi",
      available: true,
      features: [
        "MBUX Infotainment",
        "LED Headlamps",
        "Dual Zone Climate",
        "Wireless Charging",
      ],
      description:
        "Experience Mercedes-Benz luxury in a compact sedan with advanced technology and premium comfort.",
    },
    {
      id: "jaguar-xe",
      name: "Jaguar XE",
      type: "Sedan",
      year: 2022,

      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/43356/jaguar-xe-front-right-three-quarter-7.jpeg?q=80",
      seats: 5,
      fuelType: "Diesel",
      transmission: "Automatic",
      location: "Chennai",
      available: true,
      features: [
        "InControl Touch Pro",
        "Meridian Sound System",
        "Adaptive Dynamics",
        "All-Wheel Drive",
      ],
      description:
        "The Jaguar XE combines British luxury with sporty performance and refined elegance.",
    },
    {
      id: "volvo-xc40",
      name: "Volvo XC40",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/664x374/cw/ec/32889/Volvo-XC40-Exterior-130763.jpg?wm=0&q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Pune",
      available: true,
      features: [
        "City Safety",
        "Sensus Connect",
        "Harman Kardon Audio",
        "Panoramic Sunroof",
      ],
      description:
        "Volvo XC40 offers Scandinavian design with world-class safety features and premium comfort.",
    },
  ],
  luxury: [
    {
      id: "bmw-7-series",
      name: "BMW 7 Series",
      type: "Sedan",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/132513/new-7-series-exterior-right-front-three-quarter.jpeg?isig=0&q=80&q=80",
      seats: 5,
      fuelType: "Hybrid",
      transmission: "Automatic",
      location: "Mumbai",
      available: true,
      features: [
        "Executive Lounge Seating",
        "Gesture Control",
        "Bowers & Wilkins Audio",
        "Massage Seats",
      ],
      description:
        "The BMW 7 Series represents the pinnacle of luxury with innovative technology and unmatched comfort.",
    },
    {
      id: "mercedes-s-class",
      name: "Mercedes-Benz S-Class",
      type: "Sedan",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/48067/s-class-exterior-right-front-three-quarter-9.jpeg?isig=0&q=80&q=80",
      seats: 5,
      fuelType: "Hybrid",
      transmission: "Automatic",
      location: "Delhi",
      available: true,
      features: [
        "MBUX Hyperscreen",
        "Burmester 4D Sound",
        "Executive Rear Seats",
        "Air Balance Package",
      ],
      description:
        "The S-Class sets the standard for luxury sedans with cutting-edge technology and supreme comfort.",
    },
    {
      id: "range-rover-autobiography",
      name: "Range Rover Autobiography",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/107719/range-rover-exterior-right-front-three-quarter-46.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Hybrid",
      transmission: "Automatic",
      location: "Bangalore",
      available: true,
      features: [
        "Terrain Response",
        "Meridian Signature Sound",
        "Executive Class Seating",
        "Air Suspension",
      ],
      description:
        "The Range Rover Autobiography offers unparalleled luxury and capability for any terrain.",
    },
    {
      id: "volvo-s90",
      name: "Volvo S90",
      type: "Sedan",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/105969/exterior-right-front-three-quarter-4.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Hybrid",
      transmission: "Automatic",
      location: "Hyderabad",
      available: true,
      features: [
        "Pilot Assist",
        "Bowers & Wilkins Audio",
        "Four-C Adaptive Chassis",
        "Clean Zone Technology",
      ],
      description:
        "Volvo S90 combines Scandinavian luxury with advanced safety technology and environmental consciousness.",
    },
  ],
  suvs: [
    {
      id: "toyota-fortuner",
      name: "Toyota Fortuner",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/1200x900/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80",
      seats: 7,
      fuelType: "Diesel",
      transmission: "Automatic",
      location: "Mumbai",
      available: true,
      features: [
        "4WD",
        "Hill Start Assist",
        "Vehicle Stability Control",
        "Multi-terrain Monitor",
      ],
      description:
        "The Toyota Fortuner is a robust SUV built for both city driving and off-road adventures.",
    },
    {
      id: "mg-gloster",
      name: "MG Gloster",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd-ct.aeplcdn.com/664x415/n/cw/ec/129689/gloster-exterior-left-front-three-quarter-3.jpeg?isig=0&q=80",
      seats: 7,
      fuelType: "Diesel",
      transmission: "Automatic",
      location: "Delhi",
      available: true,
      features: [
        "ADAS Level 2",
        "360-degree Camera",
        "Captain Seats",
        "Infinity Sound System",
      ],
      description:
        "MG Gloster offers premium SUV experience with advanced driver assistance and luxury features.",
    },
    {
      id: "kia-seltos",
      name: "Kia Seltos",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/174329/seltos-right-front-three-quarter.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Chennai",
      available: true,
      features: [
        "UVO Connect",
        "Ventilated Seats",
        "Bose Premium Audio",
        "Smart Pure Air Purifier",
      ],
      description:
        "Kia Seltos combines bold design with smart technology for the modern urban explorer.",
    },
    {
      id: "range-rover-evoque",
      name: "Range Rover Evoque",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/37721/range-rover-evoque-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Bangalore",
      available: true,
      features: [
        "ClearSight Ground View",
        "Meridian Audio",
        "Terrain Response 2",
        "Touch Pro Duo",
      ],
      description:
        "Range Rover Evoque delivers distinctive design with luxury and capability in a compact SUV.",
    },
    {
      id: "bmw-x7",
      name: "BMW X7",
      type: "SUV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/136217/x7-exterior-right-front-three-quarter-8.jpeg?isig=0&q=80&q=80",
      seats: 7,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Pune",
      available: true,
      features: [
        "xDrive AWD",
        "Sky Lounge Panoramic Roof",
        "Bowers & Wilkins Audio",
        "Gesture Control",
      ],
      description:
        "BMW X7 is the ultimate luxury SUV offering spacious comfort and dynamic performance.",
    },
  ],
  "off-road": [
    {
      id: "mahindra-thar",
      name: "Mahindra Thar",
      type: "SUV",
      year: 2023,
      image: "https://imgd-ct.aeplcdn.com/664x415/n/rskpp0b_1638613.jpg?q=80",
      seats: 4,
      fuelType: "Diesel",
      transmission: "Manual",
      location: "Mumbai",
      available: true,
      features: ["4WD", "Convertible Top", "Rock Crawling", "Adventure Ready"],
      description:
        "Mahindra Thar is built for adventure with authentic off-road capability and rugged design.",
    },
    {
      id: "force-gurkha",
      name: "Force Gurkha",
      type: "SUV",
      year: 2022,
      image:
        "https://imgd.aeplcdn.com/664x374/n/cw/ec/124851/five-door-gurkha-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80",
      seats: 6,
      fuelType: "Diesel",
      transmission: "Manual",
      location: "Delhi",
      available: true,
      features: [
        "4WD",
        "Snorkel",
        "Differential Lock",
        "High Ground Clearance",
      ],
      description:
        "Force Gurkha is designed for extreme off-road conditions with military-grade toughness.",
    },
    {
      id: "jeep-wrangler",
      name: "Jeep Wrangler",
      type: "SUV",
      year: 2023,

      image:
        "https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2025/wrangler/gallery/desktop/my25-jeep-wrangler-gallery-01-exterior-desktop.jpg",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Bangalore",
      available: true,
      features: [
        "Rock-Trac 4WD",
        "Removable Doors",
        "Fold-Down Windshield",
        "Uconnect System",
      ],
      description:
        "Jeep Wrangler offers unmatched off-road capability with iconic design and open-air freedom.",
    },
    {
      id: "toyota-hilux",
      name: "Toyota Hilux",
      type: "Pickup",
      year: 2023,
      image:
        "https://imgd.aeplcdn.com/1280x720/n/cw/ec/109265/hilux-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
      seats: 5,
      fuelType: "Diesel",
      transmission: "Automatic",
      location: "Chennai",
      available: true,
      features: [
        "4WD",
        "Multi-terrain Select",
        "Crawl Control",
        "Rear Differential Lock",
      ],
      description:
        "Toyota Hilux combines pickup truck utility with serious off-road performance and reliability.",
    },
    {
      id: "land-rover-defender",
      name: "Land Rover Defender",
      type: "SUV",
      year: 2023,

      image: "https://imgd-ct.aeplcdn.com/664x415/n/htaemfb_1823551.jpg?q=80",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Pune",
      available: true,
      features: [
        "Terrain Response 2",
        "Wade Sensing",
        "ClearSight Ground View",
        "Configurable Terrain Response",
      ],
      description:
        "Land Rover Defender is the most capable Land Rover ever, ready for any adventure.",
    },
  ],
  vans: [
    {
      id: "toyota-innova-crysta",
      name: "Toyota Innova Crysta",
      type: "MPV",
      year: 2023,

      image:
        "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-2.png?isig=0&q=80&q=80",
      seats: 8,
      fuelType: "Diesel",
      transmission: "Automatic",
      location: "Mumbai",
      available: true,
      features: [
        "Captain Seats",
        "Dual Zone AC",
        "Touchscreen Infotainment",
        "Premium Interior",
      ],
      description:
        "Toyota Innova Crysta offers premium MPV experience with spacious comfort for large families.",
    },
    {
      id: "maruti-ertiga",
      name: "Maruti Suzuki Ertiga",
      type: "MPV",
      year: 2023,

      image: "https://imgd.aeplcdn.com/1056x594/n/c6es93a_1572125.jpg?q=80",
      seats: 7,
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Delhi",
      available: true,
      features: [
        "SmartPlay Studio",
        "Auto AC",
        "Cruise Control",
        "ESP with Hill Hold Assist",
      ],
      description:
        "Maruti Suzuki Ertiga provides practical 7-seater solution with excellent fuel efficiency.",
    },
    {
      id: "kia-carens",
      name: "Kia Carens",
      type: "MPV",
      year: 2023,

      image: "https://imgd-ct.aeplcdn.com/664x415/n/vr8j3cb_1726571.jpg?q=80",
      seats: 7,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "Bangalore",
      available: true,
      features: [
        "UVO Connect",
        "Ventilated Seats",
        "Air Purifier",
        "Wireless Phone Charger",
      ],
      description:
        "Kia Carens combines modern design with family-friendly features and advanced connectivity.",
    },
    {
      id: "renault-triber",
      name: "Renault Triber",
      type: "MPV",
      year: 2022,

      image:
        "https://imgd-ct.aeplcdn.com/1280x720/n/cw/ec/141145/triber-right-front-three-quarter-2.jpeg?isig=0&q=80",
      seats: 7,
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Chennai",
      available: true,
      features: [
        "Modular Seating",
        "MediaNav Evolution",
        "Dual Airbags",
        "EasyFix Seats",
      ],
      description:
        "Renault Triber offers flexible seating configuration in a compact and affordable package.",
    },
    {
      id: "mahindra-marazzo",
      name: "Mahindra Marazzo",
      type: "MPV",
      year: 2022,

      image:
        "https://auto.mahindra.com/dw/image/v2/BKRC_PRD/on/demandware.static/-/Sites-mahindra-product-catalog/default/dw8daa92dd/images/MRZO/large/marazzo_1_white_900%20x%20439.png?sw=360&sh=202",
      seats: 8,
      fuelType: "Diesel",
      transmission: "Manual",
      location: "Hyderabad",
      available: true,
      features: [
        "Surround Cool Technology",
        "7-inch Touchscreen",
        "Cruise Control",
        "Shark-fin Antenna",
      ],
      description:
        "Mahindra Marazzo delivers premium MPV experience with distinctive design and comfort features.",
    },
  ],
};
