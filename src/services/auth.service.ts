import { Context, ServiceSchema } from "moleculer";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { registerSchema, loginSchema, forgotPasswordSchema, passwordSchema } from "../schemas/auth.schema";
import { RegisterParams, LoginParams, TokenPair, RefreshTokenParams, ForgotPasswordParams, ResetPasswordParams, TokenPayload } from "../types/auth.types";
import { AuthMeta, MessageResponse } from "../types/common.types";
import { AuthErrors } from "../errors/auth.errors";
import { validate } from "../utils/validate";
import { generateResetToken } from "../utils/token";
import { sendResetPasswordEmail } from "../services/mail.service";
import { requireAuth } from "../utils/auth";

const AuthService: ServiceSchema = {
  name: "auth",

  actions: {
    async register(ctx: Context<RegisterParams>): Promise<MessageResponse> {
      const data = validate(registerSchema, ctx.params);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw AuthErrors.userAlreadyExists();
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });

      return { message: "Usuario creado correctamente" };
    },

    async login(ctx: Context<LoginParams>): Promise<TokenPair> {
      const data = validate(loginSchema, ctx.params);

      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) throw AuthErrors.invalidCredentials();

      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) throw AuthErrors.invalidCredentials();

      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return { accessToken, refreshToken };
    },

    async refreshToken(
      ctx: Context<RefreshTokenParams>
    ): Promise<TokenPair> {
      const { refreshToken } = ctx.params;

      if (!refreshToken) {
        throw AuthErrors.refreshTokenRequired();
      }

      let decoded: TokenPayload;

      try {
        decoded = verifyRefreshToken(refreshToken) as TokenPayload;
      } catch {
        throw AuthErrors.invalidToken();
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw AuthErrors.invalidToken();
      }

      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    },

    async logout(ctx: Context<{}, AuthMeta>): Promise<MessageResponse> {
      const user = requireAuth(ctx);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });

      return { message: "Logout exitoso" };
    },

    async forgotPassword(
      ctx: Context<ForgotPasswordParams>
    ): Promise<MessageResponse> {
      const { email } = validate(forgotPasswordSchema, ctx.params);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { message: "Si el correo existe, se enviará un enlace" };
      }

      const token = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiresAt: expiresAt,
        },
      });

      await sendResetPasswordEmail(user.email, token);

      return { message: "Si el correo existe, se enviará un enlace" };
    },

    async resetPassword(
      ctx: Context<ResetPasswordParams>
    ): Promise<MessageResponse> {
      const { token, password } = ctx.params;

      const result = passwordSchema.safeParse(password);
      if (!result.success) {
        throw AuthErrors.validationError(result.error.issues[0].message);
      }

      const user = await prisma.user.findFirst({
        where: { resetToken: token },
      });

      if (!user) throw AuthErrors.invalidToken();

      if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
        throw AuthErrors.tokenExpired();
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiresAt: null,
        },
      });

      return { message: "Contraseña actualizada correctamente" };
    },
  },
};

export default AuthService;