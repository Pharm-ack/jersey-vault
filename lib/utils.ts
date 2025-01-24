import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
export const categories = [
  {
    id: 0,
    title: "Jersey",
    name: "jersey",
  },
  {
    id: 1,
    title: "Shorts",
    name: "shorts",
  },
  {
    id: 3,
    title: "Joggers",
    name: "joggers",
  },
  {
    id: 4,
    title: "Caps",
    name: "caps",
  },
];

export const generateOrderId = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return id;
};
