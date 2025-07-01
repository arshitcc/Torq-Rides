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
  getMotorcycleLogById,
  updateMotorcycleLog,
} from "../controllers/motorcycle-logs.controller";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb/mongodb.validators";
import {
  createMotorcycleLogValidator,
  updateMotorcycleLogValidator,
} from "../validators/motorcycle-logs.validator";

const router = Router();

router.use(authenticateUser);

router.post(
  "/",
  verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.SUPPORT]),
  createMotorcycleLogValidator(),
  validate,
  createMotorcycleLog,
);
router.get(
  "/",
  verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.SUPPORT]),
  getAllMotorcycleLogs,
);
router.get(
  "/:motorcycleId",
  verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.SUPPORT]),
  mongoIdPathVariableValidator("motorcycleId"),
  getMotorcycleLogById,
);
router.put(
  "/:motorcycleId",
  verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.SUPPORT]),
  mongoIdPathVariableValidator("motorcycleId"),
  updateMotorcycleLogValidator(),
  validate,
  updateMotorcycleLog,
);
router.delete(
  "/:motorcycleId",
  verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.SUPPORT]),
  deleteMotorcycleLog,
);

export default router;
