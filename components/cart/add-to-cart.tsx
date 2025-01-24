"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "./cart-context";
import type { Product, Size } from "@prisma/client";
import { Cart } from "./cart";
import { Button } from "@/components/ui/button";

export function AddToCart({ product }: { product: Product }) {
  const [isSelectingSize, setIsSelectingSize] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useCart();
  const availableSizes = product.size.map((size) => ({
    label: size,
    value: size,
  }));

  const handleAddToCart = useCallback(
    (size: Size) => {
      addToCart(product, size);
      setIsSelectingSize(false);
      setIsCartOpen(true);
    },
    [addToCart, product]
  );

  return (
    <div className="w-full mx-auto">
      <AnimatePresence>
        {isSelectingSize ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSelectingSize(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((sizeOption) => (
                <Button
                  key={sizeOption.value}
                  onClick={() => handleAddToCart(sizeOption.value)}
                  variant="outline"
                >
                  {sizeOption.label}
                </Button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Button
              onClick={() => setIsSelectingSize(true)}
              size="lg"
              className="w-full"
            >
              Add to Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
