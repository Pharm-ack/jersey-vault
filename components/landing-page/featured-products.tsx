import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { ProductGrid } from "../product-grid";
import prisma from "@/lib/prisma";

async function getData() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return data;
}

export default async function FeaturedProducts() {
  const products = await getData();
  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <Suspense fallback={<SkeletonGrid />}>
        <ProductGrid products={products} />
      </Suspense>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-64 bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted animate-pulse rounded" />
        <div className="h-5 w-24 bg-muted animate-pulse rounded" />
      </div>
    </Card>
  );
}
