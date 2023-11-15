import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1).max(255),
  value: z.string().min(4).max(7),
});

export type FormValues = z.infer<typeof FormSchema>;
