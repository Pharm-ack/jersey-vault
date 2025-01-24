import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/image-gallery";
import { RelatedProducts } from "@/components/related-products";
import { ReviewsSection } from "@/components/review-section";
import prisma from "@/lib/prisma";
import { ProductSkeleton } from "@/components/product-skeleton";
import { AddToCart } from "@/components/cart/add-to-cart";
import { Package2, Star, Truck } from "lucide-react";

async function getProductData(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      price: true,
    },
  });

  return { product, relatedProducts };
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}
export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<ProductSkeleton />}>
          <AsyncProductContent slug={slug} />
        </Suspense>
      </main>
    </div>
  );
}

async function AsyncProductContent({ slug }: { slug: string }) {
  const { product, relatedProducts } = await getProductData(slug);

  return (
    <>
      <div className="rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-4">
            <ImageGallery images={product.images} />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4 border-t border-b py-6">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    2-3 business days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free Returns</p>
                  <p className="text-sm text-muted-foreground">
                    30-day return window
                  </p>
                </div>
              </div>
            </div>

            <AddToCart product={product} />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
          </div>
          <ReviewsSection reviews={product.reviews} />
        </div>

        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="rounded-lg p-6">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </>
  );
}
