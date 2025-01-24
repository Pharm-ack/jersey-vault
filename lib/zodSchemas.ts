import { z } from "zod";

const SizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.number().positive("Price must be positive"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  category: z.enum(["jersey", "shorts", "joggers", "caps"]),
  isFeatured: z.boolean().optional(),
  size: z.array(SizeEnum).min(1, "At least one size is required"),
  // color: z.string().nullable(),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
});

export type Product = z.infer<typeof ProductSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// export const CheckoutSchema = z
//   .object({
//     street: z.string().optional(),
//     city: z.string().optional(),
//     state: z.string().optional(),
//     country: z.string().optional(),
//     postalCode: z.string().optional(),
//     phone: z.string().optional(),
//     saveAddress: z.boolean().optional(),
//     useExistingAddress: z.boolean(),
//     selectedAddressId: z.string().optional(),
//   })
//   .refine(
//     (data) => {
//       if (!data.useExistingAddress) {
//         return !!(
//           data.street &&
//           data.city &&
//           data.state &&
//           data.country &&
//           data.phone
//         );
//       }
//       return data.useExistingAddress ? !!data.selectedAddressId : true;
//     },
//     {
//       message:
//         "All address fields are required when not using an existing address",
//     }
//   );

export const CheckoutSchema = z
  .object({
    useExistingAddress: z.string().transform((val) => val === "true"),
    selectedAddressId: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    saveAddress: z
      .string()
      .optional()
      .transform((val) => val === "true"),
  })
  .superRefine((data, ctx) => {
    if (data.useExistingAddress) {
      // When using existing address, only selectedAddressId is required
      if (!data.selectedAddressId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An address must be selected when using existing address",
          path: ["selectedAddressId"],
        });
      }
    } else {
      // When not using existing address, validate required fields
      const requiredFields = {
        street: "Street",
        city: "City",
        state: "State",
        country: "Country",
        phone: "Phone",
      } as const;

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!data[field as keyof typeof requiredFields]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${label} is required`,
            path: [field],
          });
        }
      }
    }
  });
