import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants/constants";
import {
  couponActivityStatusValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../validators/promo-codes.validator";

import { validate } from "../middlewares/validator.middleware";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  updateCouponActiveStatus,
} from "../controllers/promo-codes.controller";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb/mongodb.validators";

const router = Router();

router.use(authenticateUser);
router.use(verifyPermission([UserRolesEnum.ADMIN]));

router
  .route("/")
  .get(getAllCoupons)
  .post(createCouponValidator(), validate, createCoupon);

router
  .route("/:couponId")
  .get(mongoIdPathVariableValidator("couponId"), validate, getCouponById)
  .patch(
    mongoIdPathVariableValidator("couponId"),
    updateCouponValidator(),
    validate,
    updateCoupon,
  )
  .delete(mongoIdPathVariableValidator("couponId"), validate, deleteCoupon);

router
  .route("/status/:couponId")
  .patch(
    mongoIdPathVariableValidator("couponId"),
    couponActivityStatusValidator(),
    validate,
    updateCouponActiveStatus,
  );

export default router;
