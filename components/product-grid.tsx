import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
type ProductGridProps = {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  }[];
};

export async function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <div className="relative w-full h-64">
              {product.images?.[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={false}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-lg">₦{product.price.toFixed(2)}</p>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
