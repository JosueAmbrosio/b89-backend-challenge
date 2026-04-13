import { ZodType } from "zod";
import { handleZodError } from "../errors/zod.error";

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    throw handleZodError(err as any);
  }
}