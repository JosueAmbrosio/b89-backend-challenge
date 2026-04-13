export interface RegisterParams {
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string,
  refreshToken: string,
}

export interface JwtPayload {
  id: string;
  email: string;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenParams = {
  refreshToken: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  token: string;
  password: string;
};

export type TokenPayload = {
  id: string;
  email: string;
};