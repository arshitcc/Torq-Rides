export const UserRolesEnum = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  SUPPORT: "SUPPORT",
} as const;

export const DocumentTypes = {
  E_KYC: "E-KYC",
  PAN_CARD: "PAN-CARD",
  AADHAR_CARD: "AADHAR-CARD",
  DRIVING_LICENSE: "DRIVING-LICENSE",
};

export const DocumentTypesEnum = {
  E_KYC: "E-KYC",
  PAN_CARD: "PAN-CARD",
  AADHAR_CARD: "AADHAR-CARD",
  DRIVING_LICENSE: "DRIVING-LICENSE",
} as const;

export const PaymentProvidersEnum = {
  RAZORPAY: "RAZORPAY",
  UPI: "UPI",
  CASH: "CASH",
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
  _id: string;
  type: DocumentTypes;
  name?: string;
  file: File;
}

export type User = {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  phone: string;
  address: string;
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
  SUPERBIKE: "SUPERBIKE",
  CRUISER: "CRUISER",
  ADVENTURE: "ADVENTURE",
  SCOOTER: "SCOOTER",
  ELECTRIC: "ELECTRIC",
} as const;

export const BookingStatusEnum = {
  PENDING: "PENDING",
  RESERVED: "RESERVED",
  CONFIRMED: "CONFIRMED",
  STARTED: "STARTED",
  CANCELLATION_REQUESTED: "CANCELLATION REQUESTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PaymentStatusEnum = {
  PARTIAL_PAID: "PARTIAL-PAID",
  FULLY_PAID: "FULLY-PAID",
  UNPAID: "UNPAID",
  REFUND_INITIATED: "REFUND-INITIATED",
  REFUND_IN_PROGRESS: "REFUND-IN-PROGRESS",
  FULLY_REFUNDED: "REFUNDED",
} as const;

export const AvailableMotorcycleStatus = Object.values(MotorcycleStatusEnum);
export const AvailableMotorcycleCategories = Object.values(
  MotorcycleCategoryEnum
);
export const AvailableBookingStatus = Object.values(BookingStatusEnum);
export const AvailablePaymentStatus = Object.values(PaymentStatusEnum);

export type MotorcycleStatus = (typeof AvailableMotorcycleStatus)[number];
export type MotorcycleCategory = (typeof AvailableMotorcycleCategories)[number];
export type BookingStatus = (typeof AvailableBookingStatus)[number];
export type PaymentStatus = (typeof AvailablePaymentStatus)[number];

export type Motorcycle = {
  _id: string;
  make: string;
  vehicleModel: string;
  pricePerDayMonThu: number;
  pricePerDayFriSun: number;
  pricePerWeek: number;
  description: string;
  categories: MotorcycleCategory[];
  availableInCities: { branch: string; quantity: number }[];
  specs: {
    engine: number;
    power: number;
    weight: number;
    seatHeight: number;
  };
  variant: string;
  color: string;
  securityDeposit: number;
  kmsLimitPerDay: number;
  extraKmsCharges: number;
  images: File[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface PaymentTransaction {
  paymentId: string;
  amount: number;
  provider: PaymentProviders;
  status: string;
}

export type Booking = {
  _id: string;
  customerId: string;
  status: BookingStatus;
  bookingDate: Date;
  rentTotal: number;
  securityDepositTotal: number;
  cartTotal: number;
  discountedTotal: number;
  paidAmount: number;
  remainingAmount: number;
  totalTax: number;
  customer: User;
  items: CartItem[];
  paymentProvider: PaymentProviders;
  payments: PaymentTransaction[];
  paymentStatus: PaymentStatus;
  couponId: string;
  cancellationCharge: number;
  cancellationReason: string;
  cancelledBy: {
    role: UserRoles;
  };
  refundAmount: number;
  coupon?: PromoCode;
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
  type: "FLAT" | "PERCENTAGE";
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
  pickupLocation: string;
  dropoffLocation: string;
  motorcycle: Motorcycle;
  duration: string;
  taxPercentage: number;
  totalTax: number;
  totalHours: number;
  rentAmount: number;
  discountedRentAmount: number;
};

export type Cart = {
  _id: string;
  customerId: string;
  items: CartItem[];
  couponId: string;
  coupon: PromoCode;
  securityDepositTotal: number;
  rentTotal: number;
  totalTax: number;
  discountedRentTotal: number;
  discountedTotal: number;
  cartTotal: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MotorcycleLog = {
  _id: string;
  motorcycleId: string;
  registrationNumber: string;
  branch: string;
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
  motorcycle: Motorcycle;
};
