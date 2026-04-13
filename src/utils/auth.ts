import { Context, Errors } from "moleculer";
import { AuthMeta, AuthUser } from "../types/common.types";
import { AuthErrors } from "../errors/auth.errors";

export function getUser(ctx: Context<any, AuthMeta>): AuthUser | null {
  return ctx.meta.user || null;
}

export function requireAuth(ctx: Context<any, AuthMeta>): AuthUser {
  const user = getUser(ctx);

  if (!user || !user.id) {
    throw AuthErrors.unauthorized();
  }

  return user;
}

export function requireOwnership(
  userId: string,
  resourceUserId: string
) {
  if (userId !== resourceUserId) {
    throw new Errors.MoleculerError("Forbidden", 403);
  }
}