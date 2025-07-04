import { body } from "express-validator";

const addOrUpdateMotorcycleToCartValidator = () => {
  return [
    body("quantity")
      .optional()
      .isInt({
        min: 1,
      })
      .withMessage("Quantity must be minimum 1"),
  ];
};

export { addOrUpdateMotorcycleToCartValidator };
