import { Suspense } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DeleteProductModal } from "@/components/submit-buttons";

async function fetchProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

function ProductTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-16 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-end">
              <Skeleton className="h-8 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function ProductTable() {
  const products = await fetchProducts();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Image
                alt="Product Image"
                src={item.images[0]}
                height={64}
                width={64}
                className="rounded-md object-cover h-16 w-16"
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {item.stock > 0 ? (
                  <span className="text-green-500">In stock</span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
                {item.isFeatured && (
                  <span className="text-accent">Featured</span>
                )}
              </div>
            </TableCell>
            <TableCell> &#8358;{item.price}</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-US").format(item.createdAt)}
            </TableCell>
            <TableCell className="text-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      className="mb-2 flex items-center gap-x-1"
                      href={`/dashboard/products/${item.id}`}
                    >
                      Edit
                      <Edit />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <DeleteProductModal
                      productId={item.id}
                      productName={item.name}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ProductsRoute() {
  return (
    <ScrollArea className="h-[calc(100dvh-52px)]">
      <div className="flex p-6 items-start justify-between">
        <Heading
          title="Products"
          description="Manage products (Server side table functionalities.)"
        />
        <Link
          href="/dashboard/products/create"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Link>
      </div>
      <Separator />
      <div className="mt-3">
        <CardContent>
          <Suspense fallback={<ProductTableSkeleton />}>
            <ProductTable />
          </Suspense>
        </CardContent>
      </div>
    </ScrollArea>
  );
}
