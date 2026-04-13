import { Errors } from "moleculer";

export const AuthErrors = {
  unauthorized() {
    return new Errors.MoleculerError(
      "No autorizado",
      401,
      "UNAUTHORIZED"
    );
  },
  
  invalidCredentials() {
    return new Errors.MoleculerError(
      "Credenciales incorrectas",
      401,
      "INVALID_CREDENTIALS"
    );
  },

  userAlreadyExists() {
    return new Errors.MoleculerError(
      "El usuario ya existe",
      409,
      "USER_ALREADY_EXISTS"
    );
  },

  tokenExpired() {
    return new Errors.MoleculerError(
      "El token ha expirado",
      401,
      "TOKEN_EXPIRED"
    );
  },

  invalidToken() {
    return new Errors.MoleculerError(
      "Token inválido",
      401,
      "INVALID_TOKEN"
    );
  },

  refreshTokenRequired() {
    return new Errors.MoleculerError(
      "Refresh token requerido",
      400,
      "REFRESH_TOKEN_REQUIRED"
    );
  },

  validationError(message: string) {
    return new Errors.MoleculerError(
      message,
      400,
      "VALIDATION_ERROR"
    );
  }
};