export const UserRolesEnum = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  SUPPORT: "SUPPORT",
} as const;

export const AvailableUserRoles = Object.values(UserRolesEnum);
export type UserRoles = (typeof AvailableUserRoles)[number];

export interface File {
  public_id: string;
  url: string;
  resource_type: string;
  format: string;
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
};

export const MotorcycleStatusEnum = {
  OK: "OK",
  DUE: "DUE-SERVICE",
  IN_SERVICE: "IN-SERVICE",
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

export const AvailableMotorcycleStatus = Object.values(MotorcycleStatusEnum);
export const AvailableMotorcycleCategories = Object.values(
  MotorcycleCategoryEnum
);
export const AvailableBookingStatus = Object.values(BookingStatusEnum);

export type MotorcycleStatus = (typeof AvailableMotorcycleStatus)[number];
export type MotorcycleCategory = (typeof AvailableMotorcycleCategories)[number];
export type BookingStatus = (typeof AvailableBookingStatus)[number];

export type AdminMotorcycle = {
  _id: string;
  make: string;
  vehicleModel: string;
  year: number;
  pricePerDay: number;
  description: string;
  category: string;
  image: File;
  specs: {
    engine: string;
    power: string;
    weight: string;
  };
  engine: string;
  power: string;
  weight: string;
  maintainanceLogs: {
    date: Date;
    reportMessage: string;
    status: MotorcycleStatus;
    cost: number;
  }[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerMotorcycle = Omit<AdminMotorcycle, "maintainanceLogs">;

export type Booking = {
  _id: string;
  customerId: string;
  motorcycleId: string;
  quantity: number;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  bookingDate: Date;
  motorcycle: CustomerMotorcycle;
  customer: User;
  isAvailable: boolean;
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
