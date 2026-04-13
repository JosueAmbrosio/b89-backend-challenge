export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type MessageResponse = {
  message: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthMeta = {
  user: AuthUser;
};