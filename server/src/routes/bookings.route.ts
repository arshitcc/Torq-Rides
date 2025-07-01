import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants/constants";
import {
  getAllBookingsValidators,
  createBookingValidators,
  modifyBookingValidators,
} from "../validators/bookings.validator";
import { validate } from "../middlewares/validator.middleware";
import {
  getAllBookings,
  createBooking,
  modifyBooking,
  cancelBooking,
} from "../controllers/bookings.controller";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb/mongodb.validators";

const router = Router();

router.use(authenticateUser);

router
  .route("/")
  .get(
    verifyPermission([UserRolesEnum.CUSTOMER, UserRolesEnum.ADMIN]),
    getAllBookingsValidators(),
    validate,
    getAllBookings,
  )
  .post(
    verifyPermission([UserRolesEnum.CUSTOMER]),
    createBookingValidators(),
    validate,
    createBooking,
  );

router
  .route("/:bookingId")
  .put(
    verifyPermission([UserRolesEnum.ADMIN]),
    modifyBookingValidators(),
    validate,
    modifyBooking,
  )
  .delete(
    verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.CUSTOMER]),
    mongoIdPathVariableValidator("bookingId"),
    validate,
    cancelBooking,
  );

export default router;
