import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types";
import { ShoppingCart, Truck, CreditCard } from "lucide-react";

type OrderSummaryProps = {
  items: CartItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
};

export default function OrderSummary({
  items,
  summary: { subtotal, shipping, tax, total },
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={item.product.images[0] || "/placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate mb-1">
                {item.product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold text-primary">
                ₦{(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="pt-6 space-y-4">
          <Separator className="mb-6" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">₦{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">₦{tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              ₦{total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders over ₦30000</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
