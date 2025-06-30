import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import {
  addNewReviewValidators,
  updateReviewValidators,
} from "../validators/reviews.validator";
import { validate } from "../middlewares/validator.middleware";
import {
  getAllReviewsOfMotorcycleById,
  addNewReviewToMotorcycleById,
  updateReviewById,
  deleteReviewById,
} from "../controllers/reviews.controller";
import { UserRolesEnum } from "../constants/constants";

const router = Router();

router.use(authenticateUser);

router
  .route("/:motorcycleId")
  .get(getAllReviewsOfMotorcycleById)
  .post(
    verifyPermission([UserRolesEnum.CUSTOMER]),
    addNewReviewValidators(),
    validate,
    addNewReviewToMotorcycleById,
  );

router
  .route("/:reviewId")
  .put(
    verifyPermission([UserRolesEnum.CUSTOMER]),
    updateReviewValidators(),
    validate,
    updateReviewById,
  )
  .delete(
    verifyPermission([UserRolesEnum.CUSTOMER, UserRolesEnum.ADMIN]),
    deleteReviewById,
  );

export default router;
