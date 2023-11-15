import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isAvailable: z.boolean().default(true).optional(),
  categoryId: z.string().min(3).max(255),
  sizeId: z.string().min(3).max(255),
  colorId: z.string().min(3).max(255),
});

export type FormValues = z.infer<typeof FormSchema>;
