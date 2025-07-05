import { query, body } from "express-validator";
import {
  AvailableMotorcycleCategories,
  AvailableMotorcycleStatus,
} from "../models/motorcycles.model";

const getAllMotorcyclesValidtors = () => {
  return [
    query("make").optional().isString(),
    query("model").optional().isString(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("available").optional().isBoolean(),
  ];
};

const addMotorcycleValidators = () => {
  return [
    body("make")
      .exists({ checkNull: true })
      .withMessage("Make is required")
      .notEmpty()
      .withMessage("Make cannot be empty"),

    body("vehicleModel")
      .exists({ checkNull: true })
      .withMessage("Model is required")
      .notEmpty()
      .withMessage("Model cannot be empty"),

    body("rentPerDay")
      .exists({ checkNull: true })
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("description")
      .exists({ checkNull: true })
      .withMessage("Description is required")
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("category")
      .exists({ checkNull: true })
      .withMessage("Category is required")
      .toUpperCase()
      .isIn(AvailableMotorcycleCategories)
      .withMessage(
        `Category must be one of: ${AvailableMotorcycleCategories.join(", ")}`,
      ),

    body("specs")
      .exists({ checkNull: true })
      .withMessage("Specifications is required")
      .custom((val) => !Array.isArray(val))
      .withMessage("Specifications cannot be an array")
      .customSanitizer((val) => {
        try {
          if(!val) return {};
          return JSON.parse(val);
        } catch (err) {
          console.log(err)
          throw new Error("Specifications must be valid JSON");
        }
      }),

    body("specs.engine")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("engine must be a string"),
    body("specs.power")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("power must be a string"),
    body("specs.weight")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("weight must be a string"),

    body("availableQuantity")
      .isInt({ min: 1 })
      .withMessage("Vehicle quantity must be an integer"),

    body("isAvailable")
      .isBoolean()
      .withMessage("isAvailable must be a boolean"),

    body("color").isString().withMessage("Color must be a string"),

    body("extraKmsCharges")
      .isInt({ min: 1 })
      .withMessage("Extra kms charges must be a number"),

    body("securityDeposit")
      .isInt({ min: 1 })
      .withMessage("Security Deposit must be a number"),
  ];
};

const updateMotorcycleByIdValidators = () => {
  return [
    body("make")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Make must be a string"),

    body("vehicleModel")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Model must be a string"),

    body("rentPerDay")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("description")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Description must be a string"),

    body("category")
      .optional()
      .toUpperCase()
      .isIn(AvailableMotorcycleCategories)
      .withMessage(
        `Category must be one of: ${AvailableMotorcycleCategories.join(", ")}`,
      ),

    body("specs")
      .optional()
      .customSanitizer((val) => {
        try {
          if (typeof val === "string") return JSON.parse(val);
          else return val;
        } catch (err) {
          throw new Error("Specifications must be valid JSON");
        }
      })
      .isObject()
      .withMessage("Specifications must be an object")
      .custom((val) => !Array.isArray(val))
      .withMessage("Specifications cannot be an array"),

    body("specs.engine")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("engine must be a string"),

    body("specs.power")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("power must be a string"),

    body("specs.weight")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("weight must be a string"),
  ];
};

const updateMotorcycleMaintainanceValidators = () => {
  return [
    body("date")
      .exists({ checkFalsy: true })
      .withMessage("Service date is required")
      .isISO8601()
      .withMessage("date must be a valid ISO date"),

    body("reportMessage")
      .exists({ checkFalsy: true })
      .withMessage("Service Message is required")
      .notEmpty()
      .withMessage("Service Message cannot be empty")
      .isString()
      .withMessage("Service Message must be a string"),

    body("status")
      .exists({ checkFalsy: true })
      .withMessage("status is required")
      .toUpperCase()
      .isIn(AvailableMotorcycleStatus)
      .withMessage(
        `status must be one of: ${AvailableMotorcycleStatus.join(", ")}`,
      ),

    body("cost")
      .exists({ checkFalsy: true })
      .withMessage("cost is required")
      .isFloat({ min: 0 })
      .withMessage("Provide a valid cost"),
  ];
};

export {
  getAllMotorcyclesValidtors,
  addMotorcycleValidators,
  updateMotorcycleByIdValidators,
  updateMotorcycleMaintainanceValidators,
};
