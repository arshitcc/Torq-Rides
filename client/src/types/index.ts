export const UserRolesEnum = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  SUPPORT: "SUPPORT",
} as const;

export const DocumentTypesEnum = {
  E_KYC: "E-KYC",
  PAN_CARD: "PAN-CARD",
  AADHAR_CARD: "AADHAR-CARD",
  DRIVING_LICENSE: "DRIVING-LICENSE",
} as const;

export const PaymentProvidersEnum = {
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
  UNKNOWN: "UNKNOWN",
} as const;

export const AvailableUserRoles = Object.values(UserRolesEnum);
export const AvailableDocumentTypes = Object.values(DocumentTypesEnum);
export const AvailablePaymentProviders = Object.values(PaymentProvidersEnum);

export type DocumentTypes = (typeof AvailableDocumentTypes)[number];
export type UserRoles = (typeof AvailableUserRoles)[number];
export type PaymentProviders = (typeof AvailablePaymentProviders)[number];

export interface File {
  public_id: string;
  url: string;
  resource_type: string;
  format: string;
}

export interface IDocument {
  type: DocumentTypes;
  name: string;
  file: File;
}

export type User = {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  loginType: string;
  avatar: File;
  role: UserRoles;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  documents: IDocument[];
};

export const MotorcycleStatusEnum = {
  OK: "OK",
  DUE: "DUE-SERVICE",
  IN_SERVICE: "IN-SERVICE",
  IN_REPAIR: "IN-REPAIR",
} as const;

export const MotorcycleCategoryEnum = {
  TOURING: "TOURING",
  SPORTS: "SPORTS",
  CRUISER: "CRUISER",
  ADVENTURE: "ADVENTURE",
  SCOOTER: "SCOOTER",
} as const;

export const BookingStatusEnum = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PaymentStatusEnum = {
  PARTIAL: "PARTIAL",
  REFUNDED: "REFUNDED",
  PARTIAL_REFUNDED: "PARTIAL-REFUNDED",
  FULLY_REFUNDED: "FULLY-REFUNDED",
  FULLY_PAID: "FULLY-PAID",
  UNPAID: "UNPAID",
} as const;

export const AvailableInCitiesEnum = {
  JANAKPURI: "JANAKPURI",
  GURUGRAM_MGROAD: "GURUGRAM-MGROAD",
  GURUGRAM_FARIDABAD: "GURUGRAM-FARIDABAD",
  DELHI: "DELHI",
  NOIDA: "NOIDA",
  NEW_DELHI: "NEW DELHI",
} as const;

export const AvailableMotorcycleMakesEnum = {
  ROYAL_ENFIELD: "Royal Enfield",
  KTM: "KTM",
  BMW: "BMW",
  YAMAHA: "Yamaha",
  HONDA: "Honda",
  SUZUKI: "Suzuki",
  KAWASAKI: "Kawasaki",
  TVS: "TVS",
} as const;

export const AvailableMotorcycleStatus = Object.values(MotorcycleStatusEnum);
export const AvailableMotorcycleCategories = Object.values(
  MotorcycleCategoryEnum
);
export const AvailableMotorcycleMakes = Object.values(
  AvailableMotorcycleMakesEnum
);
export const AvailableBookingStatus = Object.values(BookingStatusEnum);
export const AvailablePaymentStatus = Object.values(PaymentStatusEnum);
export const AvailableInCities = Object.values(AvailableInCitiesEnum);

export type MotorcycleStatus = (typeof AvailableMotorcycleStatus)[number];
export type MotorcycleCategory = (typeof AvailableMotorcycleCategories)[number];
export type MotorcycleMake = (typeof AvailableMotorcycleMakes)[number];
export type BookingStatus = (typeof AvailableBookingStatus)[number];
export type PaymentStatus = (typeof AvailablePaymentStatus)[number];
export type AvailableInCities = (typeof AvailableInCities)[number];


export type CityStock = {
  city: AvailableInCities;
  quantity: number;
};

export type Motorcycle = {
  _id: string;
  make: string;
  vehicleModel: string;
  year: number;
  rentPerDay: number;
  description: string;
  category: MotorcycleCategory;
  image: File;
  specs: {
    engine: string;
    power: string;
    weight: string;
  };
  isAvailable: boolean;
  availableQuantity: number;
  variant: string;
  color: string;
  securityDeposit: number;
  kmsLimitPerDay: number;
  extraKmsCharges: number;
  images: File[];
  createdAt: Date;
  updatedAt: Date;
  availableInCities: CityStock[];
  rating: number;
  registrationNumber: string;
};

export type CustomerMotorcycle = Motorcycle;
export type AdminMotorcycle = Omit<Motorcycle, "registrationNumber">;

export type Booking = {
  _id: string;
  customerId: string;
  status: BookingStatus;
  rentTotal: number;
  securityDepositTotal: number;
  cartTotal: number;
  discountedTotal: number;
  location: AvailableInCities;
  paymentProvider: PaymentProviders;
  paymentId: string;
  bookingDate: Date;
  customer: User;
  isAvailable: boolean;
  items: CartItem[];
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  _id: string;
  userId: string;
  bookingId: string;
  motorcycleId: string;
  rating: number;
  comment: string;
  customer: User;
  createdAt: Date;
  updatedAt: Date;
};

export type PromoCode = {
  _id: string;
  name: string;
  promoCode: string;
  type: string;
  discountValue: number;
  isActive: boolean;
  minimumCartValue: number;
  startDate: Date;
  expiryDate: Date;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  motorcycleId: string;
  quantity: number;
  pickupDate: Date;
  dropoffDate: Date;
  pickupTime: string;
  dropoffTime: string;
  motorcycle: Motorcycle;
};

export type Cart = {
  _id: string;
  customerId: string;
  items: CartItem[];
  couponId: string;
  coupon: PromoCode;
  rentTotal: number;
  securityDepositTotal: number;
  cartTotal: number;
  discountedTotal: number;
};

export type MotorcycleLog = {
  _id: string;
  motorcycleId: string;
  dateIn: Date;
  serviceCentreName: string;
  thingsToDo: {
    scheduledService: boolean;
    odoReading: number;
    brakePads: boolean;
    chainSet: boolean;
    damageRepair: boolean;
    damageDetails?: string;
    clutchWork: boolean;
    clutchDetails?: string;
    other: boolean;
    otherDetails?: string;
  };
  status: MotorcycleStatus;
  dateOut?: Date;
  billAmount?: number;
  billCopy?: File;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};
