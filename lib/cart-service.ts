"use server";

import { redis } from "@/lib/redis";

import { CartItem } from "@/types";

const CART_TTL = 60 * 60 * 24 * 30; // 30 days

export async function getCart(userId: string): Promise<CartItem[]> {
  const cart = (await redis.get<CartItem[]>(`cart:${userId}`)) || [];
  return cart;
}

export async function updateCart(userId: string, items: CartItem[]) {
  await redis.set(`cart:${userId}`, items, { ex: CART_TTL });
}
