import { auth } from "@/auth";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";
import { redis } from "@/lib/redis";
import { CartItem } from "@/types";
import { ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getOrders(userId: string) {
  try {
    let cartItems = await redis.get<CartItem[]>(`cart:${userId}`);

    if (!cartItems) {
      throw new Error("No Cart found with this user");
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const shipping = 8000;
    const tax = subtotal * 0.01;

    return {
      items: cartItems,
      summary: {
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax,
      },
    };
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error;
  }
}

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/checkout");
  }

  const { items, summary } = await getOrders(session?.user?.id ?? "");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow order-2 lg:order-1">
            <CheckoutForm />
          </div>
          <div className="w-full lg:w-[400px] order-1 lg:order-2">
            <Suspense fallback={<OrderSummarySkeleton />}>
              <OrderSummary items={items} summary={summary} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-20 w-20 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
        <div className="space-y-3 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
