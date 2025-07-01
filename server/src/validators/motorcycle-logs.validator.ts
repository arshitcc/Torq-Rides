import { body } from "express-validator";
import { MotorcycleStatusEnum } from "../models/motorcycles.model";

export const createMotorcycleLogValidator = () => {
  return [
    body("motorcycleId")
      .isMongoId()
      .withMessage("motorcycleId must be a valid ObjectId"),
    body("dateIn")
      .isISO8601()
      .toDate()
      .withMessage("dateIn must be a valid date"),
    body("serviceCentreName")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("serviceCentreName is required"),
    body("thingsToDo.odoReading")
      .isNumeric()
      .withMessage("odoReading must be a number"),
    body("thingsToDo.scheduledService").optional().isBoolean(),
    body("thingsToDo.brakePads").optional().isBoolean(),
    body("thingsToDo.chainSet").optional().isBoolean(),
    body("thingsToDo.damageRepair").optional().isBoolean(),
    body("thingsToDo.damageDetails").optional().isString().trim(),
    body("thingsToDo.clutchWork").optional().isBoolean(),
    body("thingsToDo.clutchDetails").optional().isString().trim(),
    body("thingsToDo.other").optional().isBoolean(),
    body("thingsToDo.otherDetails").optional().isString().trim(),
    body("status").optional().isIn(Object.values(MotorcycleStatusEnum)),
    body("dateOut").optional().isISO8601().toDate(),
    body("billAmount").optional().isNumeric(),
    body("isAvailable").optional().isBoolean(),
  ];
};

export const updateMotorcycleLogValidator = () => {
  return [
    ...createMotorcycleLogValidator().map((validator) => validator.optional()),
  ];
};
