import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayment } from "@/lib/paystack";
import { PaymentChannel } from "@prisma/client";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  if (!reference) {
    console.error("No reference provided in callback");
    return new Response("No reference provided", { status: 400 });
  }

  try {
    const verification = await verifyPayment(reference);

    if (verification?.data?.status === "success") {
      // Validate payment and order records
      const payment = await prisma.payment.findUnique({
        where: { reference: verification.data.reference },
      });

      if (!payment) {
        console.error(
          "Payment record not found for reference:",
          verification.data.reference
        );
        throw new Error("Payment record not found");
      }

      const order = await prisma.order.findUnique({
        where: { id: payment.orderId },
      });

      if (!order) {
        console.error("Order record not found for orderId:", payment.orderId);
        throw new Error("Order record not found");
      }

      // Update payment and order status
      await prisma.$transaction([
        prisma.payment.update({
          where: { reference: verification.data.reference },
          data: {
            status: "SUCCESSFUL",
            gatewayResponse: verification.data.gateway_response,
            paymentChannel:
              verification.data.channel.toUpperCase() as PaymentChannel,
            transactionId: verification.data.id.toString(),
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PROCESSING" },
        }),
      ]);

      await redis.del(`cart:${verification?.data?.metadata?.userId}`);

      const successUrl = new URL(
        `${process.env.NEXT_PUBLIC_APP_URL}/order/success`
      );
      return Response.redirect(successUrl.toString());
    }

    const failureUrl = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL}/order/failed`
    );
    return Response.redirect(failureUrl.toString());
  } catch (error) {
    console.error("Payment verification error:", error);
  }
}
