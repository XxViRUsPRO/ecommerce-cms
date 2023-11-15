import { z } from "zod";

export const FormSchema = z.object({
  label: z.string().min(3).max(255),
  imgUrl: z.string().min(1),
});

export type FormValues = z.infer<typeof FormSchema>;
