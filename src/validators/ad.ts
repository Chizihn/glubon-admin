/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdPosition, AdTypeEnum, type CreateAdFormValues } from "@/types/ad";
import * as z from "zod";

export const createAdSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  type: z.nativeEnum(AdTypeEnum).default(AdTypeEnum.STANDARD),
  position: z.nativeEnum(AdPosition),
  budget: z.number().min(0, { message: "Budget cannot be negative" }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
  targetAudience: z.string(),
}) as z.ZodType<CreateAdFormValues>;
