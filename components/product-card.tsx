"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { AddToCart } from "./cart/add-to-cart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug?: string;
  category?: string;
}

export function ProductCard({
  name,
  slug,
  price,
  images,
  category,
}: ProductCardProps) {
  return (
    <div className="p-2 overflow-hidden border border-gray-200 rounded-md">
      <Link href={`/product/${slug}`} prefetch>
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={images?.[0]}
            alt={name}
            fill
            className="rounded-md object-cover transition-transform hover:scale-100 duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-primary font-bold">&#8358;{price.toFixed(2)}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {category}
          </p>
        </div>
      </CardContent>
    </div>
  );
}
