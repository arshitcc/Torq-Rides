import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants/constants";
import { validate } from "../middlewares/validator.middleware";
import {
  createMotorcycleLog,
  deleteMotorcycleLog,
  getAllMotorcycleLogs,
  getMotorcycleLogs,
  updateMotorcycleLog,
} from "../controllers/motorcycle-logs.controller";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb/mongodb.validators";
import {
  createMotorcycleLogValidator,
  updateMotorcycleLogValidator,
} from "../validators/motorcycle-logs.validator";

const router = Router({ mergeParams: true });

router.use(authenticateUser);
router.use(verifyPermission([UserRolesEnum.ADMIN]));

router.route("/").get(getAllMotorcycleLogs);

router
  .route("/:motorcycleId")
  .post(
    mongoIdPathVariableValidator("motorcycleId"),
    createMotorcycleLogValidator(),
    validate,
    createMotorcycleLog,
  )
  .get(mongoIdPathVariableValidator("motorcycleId"), getMotorcycleLogs);

router
  .route("/:motorcycleId/:logId")
  .put(
    mongoIdPathVariableValidator("motorcycleId"),
    mongoIdPathVariableValidator("logId"),
    updateMotorcycleLogValidator(),
    validate,
    updateMotorcycleLog,
  )
  .delete(
    mongoIdPathVariableValidator("motorcycleId"),
    mongoIdPathVariableValidator("logId"),
    deleteMotorcycleLog,
  );

export default router;
