import { generateOrderId } from "./utils";
import { auth } from "@/auth";

export async function initializePayment(
  orderNumber: string,
  email: string,
  amount: number
) {
  const session = await auth();
  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          callback_url: `${process.env.PAYSTACK_CALLBACK_URL}/api/payment/callback`,
          reference: generateOrderId(),
          metadata: {
            orderId: orderNumber,
            userId: session?.user?.id,
            custom_fields: [
              {
                display_name: "Order ID",
                variable_name: "orderId",
                value: orderNumber,
              },
              {
                display_name: "Email",
                variable_name: "email",
                value: session?.user?.email,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Payment initialization failed");
    }

    const data = await response.json();

    if (!data.status || !data.data?.authorization_url) {
      throw new Error("Invalid payment response");
    }

    return data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Payment verify failed");
    }

    const data = await response.json();

    if (!data.status) {
      throw new Error("Invalid payment response");
    }

    return data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
  }
}
