// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { cn } from "@/lib/utils";

// interface CategoryFilterProps {
//   categories: string[];
// }

// export function CategoryFilter({ categories }: CategoryFilterProps) {
//   const searchParams = useSearchParams();
//   const activeCategory = searchParams.get("category") || "all";

//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold">Categories</h3>
//       <div className="space-y-2">
//         <Link
//           href="/products"
//           className={cn(
//             "block w-full px-2 py-1.5 text-sm rounded-md transition-colors",
//             activeCategory === "all"
//               ? "bg-primary text-primary-foreground"
//               : "hover:bg-muted"
//           )}
//         >
//           All Products
//         </Link>
//         {categories.map((category) => (
//           <Link
//             key={category}
//             href={`/products?category=${category.toLowerCase()}`}
//             className={cn(
//               "block w-full px-2 py-1.5 text-sm rounded-md transition-colors",
//               category.toLowerCase() === activeCategory
//                 ? "bg-primary text-primary-foreground"
//                 : "hover:bg-muted"
//             )}
//           >
//             {category}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
