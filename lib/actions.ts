"use server";

import { parseWithZod } from "@conform-to/zod";

import { hash } from "bcrypt-ts";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "./prisma";
import {
  LoginSchema,
  ProductSchema,
  RegisterSchema,
  CheckoutSchema,
} from "./zodSchemas";
import { redirect } from "next/navigation";
import { generateOrderId, generateSlug } from "./utils";
import { revalidatePath } from "next/cache";
import { SubmissionResult } from "@conform-to/react";
import { initializePayment } from "./paystack";
import { z } from "zod";

type FormState = {
  status: "success" | "error" | undefined;
  message: string;
};

export async function register(
  prevState: unknown,
  formData: FormData
): Promise<FormState> {
  const submission = parseWithZod(formData, {
    schema: RegisterSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { name, email, password } = submission.value;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return {
        status: "error",
        message: "Email already exists",
      };
    }
    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return {
      status: "success",
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export async function login(
  prevState: unknown,
  formData: FormData
): Promise<FormState> {
  const submission = parseWithZod(formData, {
    schema: LoginSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { email, password } = submission.value;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      status: "success",
      message: "User logged in successfully",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            message: "Invalid email or password",
          };
        default:
          return {
            status: "error",
            message: "Something went wrong",
          };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut();
}

export async function createProduct(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: ProductSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const slug = generateSlug(submission.value.name);

  try {
    await prisma.product.create({
      data: {
        name: submission.value.name,
        description: submission.value.description,
        slug: slug,
        price: submission.value.price,
        images: flattenUrls,
        category: submission.value.category,
        size: submission.value.size,
        stock: submission.value.stock,
        isFeatured: submission.value.isFeatured === true,
      },
    });
  } catch (error) {
    console.error("Failed to create product:", error);
    // return { error: "Failed to create product. Please try again." };
  } finally {
    return redirect("/dashboard/products");
  }
}

export async function editProduct(
  prevState: unknown,
  formData: FormData
): Promise<SubmissionResult<string[]> | null | undefined> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: ProductSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const slug = generateSlug(submission.value.name);
  const productId = formData.get("productId") as string;

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      // Return null instead of an error object
      return null;
    }

    // Update the product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: submission.value.name,
        description: submission.value.description,
        slug: slug,
        price: submission.value.price,
        images: flattenUrls,
        category: submission.value.category,
        size: submission.value.size,
        stock: submission.value.stock,
        isFeatured: submission.value.isFeatured === true,
      },
    });
  } catch (error) {
    console.error("Failed to edit product:", error);
    // Return null on error
    return null;
  } finally {
    return redirect("/dashboard/products");
  }
}

export async function searchProducts(query: string) {
  if (!query) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return products;
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
}

export async function getAddresses() {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Not authenticated");
  }

  const addresses = await prisma.address.findMany({
    where: { user: { id: session?.user.id } },
    orderBy: { createdAt: "desc" },
  });

  return addresses;
}

export async function createOrder(formData: FormData, cartItems: any[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Convert FormData to a plain object
  const rawData: Record<string, string> = {};
  formData.forEach((value, key) => {
    rawData[key] = value.toString();
  });

  console.log("Processing form data:", rawData); // Debug log

  try {
    const validationResult = CheckoutSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Validation error details:", validationResult.error.errors);
      throw new Error(
        validationResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      useExistingAddress,
      selectedAddressId,
      street,
      city,
      state,
      country,
      postalCode,
      phone,
      saveAddress,
    } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) throw new Error("User not found");

    let addressId: string;
    let addressDetails: {
      street: string;
      city: string;
      state: string;
      country: string;
      phone: string;
      postalCode?: string;
    };

    if (useExistingAddress) {
      if (!selectedAddressId) {
        throw new Error("No address selected");
      }

      const existingAddress = await prisma.address.findFirst({
        where: {
          id: selectedAddressId,
          userId: user.id,
        },
      });

      if (!existingAddress) {
        throw new Error("Invalid address selected");
      }

      addressId = selectedAddressId;
      addressDetails = {
        street: existingAddress.street,
        city: existingAddress.city,
        state: existingAddress.state,
        country: existingAddress.country,
        phone: existingAddress.phone,
        postalCode: existingAddress.postalCode || undefined,
      };
    } else {
      // Create new address
      await prisma.$transaction(async (tx) => {
        const address = await tx.address.create({
          data: {
            userId: user.id,
            street: street!,
            city: city!,
            state: state!,
            country: country!,
            postalCode,
            phone: phone!,
            isDefault: saveAddress || false,
          },
        });

        addressId = address.id;
        addressDetails = {
          street: street!,
          city: city!,
          state: state!,
          country: country!,
          phone: phone!,
          postalCode,
        };
      });
    }
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const shipping = 8000;
    const tax = subtotal * 0.01;
    const totalPrice = shipping + tax + subtotal;

    const orderNumber = generateOrderId();

    const payment = await initializePayment(
      orderNumber,
      user.email,
      totalPrice
    );
    if (!payment.data?.authorization_url) {
      throw new Error("Failed to initialize payment");
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId,
          totalPrice,
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalPrice,
          currency: "NGN",
          accessCode: payment.data.access_code,
          reference: payment.data.reference,
          status: "PENDING",
        },
      });
    });

    revalidatePath("/checkout");
    return payment.data.authorization_url;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error;
  }
}

const UpdateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export async function updateOrderStatus(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return {
      message: "Unauthorized.",
      success: false,
    };
  }
  const validatedFields = UpdateOrderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to update order status.",
    };
  }

  const { orderId, status } = validatedFields.data;

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/dashboard/orders");
    return {
      message: "Order status successfully updated.",
      success: true,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      message: "Failed to update order status.",
      success: false,
    };
  }
}

export async function deleteProduct(productId: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return redirect("/dashboard/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}
