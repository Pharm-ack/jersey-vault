import { ProductCard } from "@/components/product-card";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { Category, Prisma, Size } from "@prisma/client";
import { FilterSidebar } from "@/components/filters/filter-siderbar";
import { ProductSkeleton } from "@/components/product-skeleton";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
  }>;
}

async function getProducts(searchParams: ProductsPageProps["searchParams"]) {
  const params = await searchParams;
  const { category, minPrice, maxPrice, size } = params;

  const conditions: Prisma.ProductWhereInput = {};

  if (category && category !== "all") {
    conditions.category = category.toLowerCase() as Category;
  }

  if (minPrice || maxPrice) {
    conditions.price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  if (size) {
    conditions.size = {
      hasSome: [size.toUpperCase() as Size],
    };
  }

  const products = await prisma.product.findMany({
    where: conditions,
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      slug: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const count = await prisma.product.count({ where: conditions });
  return { products, count };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "all";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden w-[250px] md:block">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <FilterSidebar
                categories={category}
                sizes={resolvedParams.size}
                minPrice={resolvedParams.minPrice}
                maxPrice={resolvedParams.maxPrice}
              />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden w-full mb-4 bg-white shadow-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle></DrawerTitle>
              <div className="px-6 py-6 h-[80vh] overflow-y-auto">
                <FilterSidebar
                  categories={category}
                  sizes={resolvedParams.size}
                  minPrice={resolvedParams.minPrice}
                  maxPrice={resolvedParams.maxPrice}
                />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <div className="flex-grow">
            <Suspense fallback={<ProductsHeaderSkeleton />}>
              <ProductsHeader category={category} />
            </Suspense>
            <div className="mt-6">
              <Suspense fallback={<ProductsGridSkeleton />}>
                <ProductsGrid searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

async function ProductsHeader({ category }: { category: string }) {
  const { count } = await getProducts(Promise.resolve({ category }));
  return (
    <div>
      <h1 className="text-2xl font-bold capitalize mb-2">
        {category === "all" ? "All Products" : category}
      </h1>
      <p className="text-muted-foreground">{count} products</p>
    </div>
  );
}

async function ProductsGrid({
  searchParams,
}: {
  searchParams: ProductsPageProps["searchParams"];
}) {
  const resolvedParams = await searchParams;
  const { products } = await getProducts(Promise.resolve(resolvedParams));

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          images={[product.images[0]]}
          slug={product.slug}
          category={product.category}
        />
      ))}
    </div>
  );
}
function ProductsGridSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

function ProductsHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="h-5 w-24 bg-muted rounded animate-pulse" />
    </div>
  );
}
