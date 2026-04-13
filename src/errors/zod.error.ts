import { Errors } from "moleculer";
import { ZodError } from "zod";

export function handleZodError(error: ZodError) {
  const messages = error.issues.map((e) => e.message).join(", ");

  return new Errors.MoleculerClientError(
    messages,
    400,
    "VALIDATION_ERROR",
    { errors: error.issues }
  );
}