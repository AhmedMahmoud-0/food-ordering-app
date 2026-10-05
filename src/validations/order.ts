import * as z from "zod";

export const orderSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone is required" })
    .min(7, { message: "Invalid phone number" }),

  address: z.string().trim().min(1, { message: "Address is required" }),

  building: z.string().trim().min(1, { message: "Building is required" }),

  city: z.string().trim().min(1, { message: "City is required" }),

  notes: z.string().trim().optional(),
});

export type OrderData = z.infer<typeof orderSchema>;
