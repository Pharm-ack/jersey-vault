import Link from "next/link";
import Image from "next/image";

interface RelatedProductsProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  }>;
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="aspect-square relative mb-2 overflow-hidden rounded-lg">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-primary">₦{product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
