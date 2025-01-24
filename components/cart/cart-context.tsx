"use client";

import React, { createContext, useState, useCallback, useEffect } from "react";
import { Product, Size } from "@prisma/client";
import { getCart, updateCart } from "@/lib/cart-service";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

export const SIZES = [
  { label: "XS", value: Size.XS },
  { label: "S", value: Size.S },
  { label: "M", value: Size.M },
  { label: "L", value: Size.L },
  { label: "XL", value: Size.XL },
  { label: "XXL", value: Size.XXL },
];

export interface CartItem {
  product: Product;
  quantity: number;
  size: Size;
}
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size) => void;
  updateQuantity: (id: string, size: Size, change: number) => void;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Generate a persistent guest ID
  const [guestId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("guestCartId");
      if (stored) return stored;
      const newId = uuidv4();
      localStorage.setItem("guestCartId", newId);
      return newId;
    }
    return "";
  });

  // Get cart ID based on session
  const cartId = session?.user?.id || guestId;

  // Load initial cart
  useEffect(() => {
    if (cartId) {
      setIsLoading(true);
      getCart(cartId)
        .then((savedCart) => {
          if (savedCart.length > 0) {
            setItems(savedCart);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [cartId]);

  // Save cart changes to Redis
  useEffect(() => {
    if (cartId && !isLoading) {
      updateCart(cartId, items);
    }
  }, [items, cartId, isLoading]);

  const addToCart = useCallback((product: Product, size: Size) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingItemIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1, size }];
      }
    });
  }, []);

  const updateQuantity = useCallback(
    (id: string, size: Size, change: number) => {
      setItems((prevItems) =>
        prevItems.reduce((acc, item) => {
          if (item.product.id === id && item.size === size) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0
              ? [...acc, { ...item, quantity: newQuantity }]
              : acc;
          }
          return [...acc, item];
        }, [] as CartItem[])
      );
    },
    []
  );

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, total, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
