import { body, param, query } from "express-validator";
import { AvailableBookingStatus } from "../models/bookings.model";

const getAllBookingsValidators = () => {
  return [
    query("status").optional().isIn(AvailableBookingStatus),
    query("bookingDate").optional().isISO8601().toDate(),
    query("customerId").optional().isMongoId(),
    query("motorcycleId").optional().isMongoId(),
  ];
};

const createBookingValidators = () => {
  return [
    body("motorcycleId").exists().isMongoId(),
    body("quantity").exists().isInt({ min: 1 }),
    body("startDate").exists().isISO8601().toDate(),
    body("endDate").exists().isISO8601().toDate(),
    body("promoCode").optional().isString().trim(),
  ];
};

const modifyBookingValidators = () => {
  return [
    param("bookingId").exists().isMongoId(),
    body("status")
      .exists()
      .toUpperCase()
      .isIn(AvailableBookingStatus)
      .withMessage(
        `Status must be one of: ${AvailableBookingStatus.join(", ")}`,
      ),
  ];
};

export {
  getAllBookingsValidators,
  createBookingValidators,
  modifyBookingValidators,
};
