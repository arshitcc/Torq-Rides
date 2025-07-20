const bikeCategories = [
  { name: "Royal Enfield Rentals", href: "/motorcycles?make=Royal Enfield" },
  { name: "KTM Rentals", href: "/motorcycles?make=KTM" },
  { name: "BMW Rentals", href: "/motorcycles?make=BMW" },
  { name: "Triumph Rentals", href: "/motorcycles?make=Triumph" },
  { name: "Superbike Rentals", href: "/motorcycles?category=SUPERBIKE" },
  { name: "Adventure Motorcycles", href: "/motorcycles?category=ADVENTURE" },
];

const carCategories = [
  { name: "Budget", href: "/cars/budget" },
  { name: "Premium", href: "/cars/premium" },
  { name: "Luxury", href: "/cars/luxury" },
  { name: "SUVs", href: "/cars/suvs" },
  { name: "Off-roaders", href: "/cars/off-road" },
  { name: "Vans", href: "/cars/vans" },
];

const tourCategories = [
  { name: "Guided Tours", href: "/tours?category=guided-tours" },
  { name: "Self-Riding Tours", href: "/tours?category=self-riding" },
  { name: "Corporate Tours", href: "/tours?category=corporate-tours" },
];

const offRoadCategories = [
  { name: "Aravali Trail Rides", href: "/off-roads/aravali-trail-rides" },
  { name: "Off-Road Adventure Park", href: "/off-roads/adventure-park" },
];

const sortTypes = [
  {
    value: "Newest",
    label: "Newest",
  },
  {
    value: "Rating",
    label: "Rating",
  },
  {
    value: "Price: Low to High",
    label: "LTH",
  },
  {
    value: "Price: High to Low",
    label: "HTL",
  },
];

export {
  bikeCategories,
  carCategories,
  tourCategories,
  offRoadCategories,
  sortTypes,
};
