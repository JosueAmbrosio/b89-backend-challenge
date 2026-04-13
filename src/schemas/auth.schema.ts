import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener mínimo 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

export const registerSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});