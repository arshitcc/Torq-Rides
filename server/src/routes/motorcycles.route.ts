import { Router } from "express";
import {
  authenticateUser,
  verifyPermission,
} from "../middlewares/auth.middleware";
import { UserRolesEnum } from "../constants/constants";
import { upload } from "../middlewares/multer.middleware";
import {
  addMotorcycleValidators,
  deleteMotorcycleByIdValidators,
  getAllMotorcyclesValidtors,
  getMotorcycleByIdValidators,
  updateMotorcycleByIdValidators,
  updateMotorcycleMaintainanceValidators,
} from "../validators/motorcycles.validator";
import { validate } from "../middlewares/validator.middleware";
import {
  getAllMotorcycles,
  getMotorcycleById,
  addMotorcycle,
  updateMotorcycleDetails,
  deleteMotorcycle,
  updateMotorcycleMaintainanceLogs,
} from "../controllers/motorcycles.controller";
import logsRouter from "./motorcycle-logs.route";

const router = Router();

router.use(authenticateUser);

router
  .route("/")
  .get(getAllMotorcyclesValidtors(), validate, getAllMotorcycles)
  .post(
    verifyPermission([UserRolesEnum.ADMIN]),
    upload.single("image"),
    addMotorcycleValidators(),
    validate,
    addMotorcycle,
  );

router.use("/logs", logsRouter);

router
  .route("/:motorcycleId")
  .get(getMotorcycleByIdValidators(), validate, getMotorcycleById)
  .put(
    verifyPermission([UserRolesEnum.ADMIN]),
    upload.single("image"),
    updateMotorcycleByIdValidators(),
    validate,
    updateMotorcycleDetails,
  )
  .patch(
    verifyPermission([UserRolesEnum.ADMIN]),
    updateMotorcycleMaintainanceValidators(),
    validate,
    updateMotorcycleMaintainanceLogs,
  )
  .delete(
    verifyPermission([UserRolesEnum.ADMIN]),
    deleteMotorcycleByIdValidators(),
    validate,
    deleteMotorcycle,
  );

export default router;
