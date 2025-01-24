import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  { name: "Jersey", image: "/jersey.jpg" },
  { name: "Shorts", image: "/shorts.jpg" },
  { name: "Joggers", image: "/jorgers.jpg" },
  { name: "Caps", image: "/caps.jpg" },
];

export default function CategorySelection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8"> Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${category.name.toLowerCase()}`}
            >
              <CategoryCard {...category} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  name: string;
  image: string;
}

function CategoryCard({ name, image }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <Image
        src={image}
        alt={name}
        width={300}
        height={300}
        className="w-full h-64 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-center">{name}</h3>
      </CardContent>
    </Card>
  );
}
