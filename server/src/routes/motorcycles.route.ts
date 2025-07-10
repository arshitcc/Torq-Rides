import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants/constants";
import { upload } from "../middlewares/multer.middleware";
import {
  addMotorcycleValidators,
  getAllMotorcyclesValidtors,
  updateMotorcycleByIdValidators,
} from "../validators/motorcycles.validator";
import { validate } from "../middlewares/validator.middleware";
import {
  getAllMotorcycles,
  getMotorcycleById,
  addMotorcycle,
  updateMotorcycleDetails,
  deleteMotorcycle,
  updateMotorcycleAvailability,
  deleteMotorcycleImage,
} from "../controllers/motorcycles.controller";
import logsRouter from "./motorcycle-logs.route";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb/mongodb.validators";

const router = Router();

router
  .route("/")
  .get(getAllMotorcyclesValidtors(), validate, getAllMotorcycles)
  .post(
    authenticateUser,
    verifyPermission([UserRolesEnum.ADMIN]),
    upload.array("images", 5),
    addMotorcycleValidators(),
    validate,
    addMotorcycle,
  );

router.use("/logs", logsRouter);

router
  .route("/:motorcycleId")
  .get(
    mongoIdPathVariableValidator("motorcycleId"),
    validate,
    getMotorcycleById,
  )
  .post(
    authenticateUser,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("motorcycleId"),
    validate,
    updateMotorcycleAvailability,
  )
  .patch(
    authenticateUser,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("motorcycleId"),
    validate,
    deleteMotorcycleImage,
  )
  .put(
    authenticateUser,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("motorcycleId"),
    upload.array("images", 5),
    updateMotorcycleByIdValidators(),
    validate,
    updateMotorcycleDetails,
  )
  .delete(
    authenticateUser,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("motorcycleId"),
    validate,
    deleteMotorcycle,
  );

export default router;
