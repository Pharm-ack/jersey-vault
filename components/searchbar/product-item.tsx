import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface ProductItemProps {
  product: Product;
  onClick: () => void;
}

export default function ProductItem({ product, onClick }: ProductItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
    >
      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
    </button>
  );
}
