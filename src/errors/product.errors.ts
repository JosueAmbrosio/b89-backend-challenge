import { Errors } from "moleculer";

export const ProductErrors = {
  Unauthorized() {
    return new Errors.MoleculerError(
      "Unauthorized",
      401,
      "UNAUTHORIZED"
    );
  },

  ProductNotFound() {
    return new Errors.MoleculerError(
      "Producto no encontrado",
      404,
      "PRODUCT_NOT_FOUND"
    );
  },

  ProductAlreadyExists() {
    return new Errors.MoleculerError(
      "El producto ya existe",
      409,
      "PRODUCT_ALREADY_EXISTS"
    );
  },

  ValidationError(message: string) {
    return new Errors.MoleculerError(
      message,
      400,
      "VALIDATION_ERROR"
    );
  },
};