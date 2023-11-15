import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(3).max(255),
});

export type FormValues = z.infer<typeof FormSchema>;
