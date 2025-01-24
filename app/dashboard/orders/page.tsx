import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import prisma from "@/lib/prisma";
import { updateOrderStatus } from "@/lib/actions";
import OrderStatusSelect from "@/components/order-status";

async function fetchOrders() {
  return await prisma.order.findMany({
    select: {
      id: true,
      totalPrice: true,
      createdAt: true,
      status: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function OrderTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-40 hidden md:flex" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function OrderTable() {
  const data = await fetchOrders();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <p className="font-medium">{item.user?.name}</p>
              <p className="hidden md:flex text-sm text-muted-foreground">
                {item.user?.email}
              </p>
            </TableCell>
            <TableCell>Order</TableCell>
            <TableCell>
              <OrderStatusSelect
                orderId={item.id}
                currentStatus={item.status}
              />
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-US").format(item.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              ${new Intl.NumberFormat("en-US").format(item.totalPrice / 100)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OrdersPage() {
  return (
    <div>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store!</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<OrderTableSkeleton />}>
          <OrderTable />
        </Suspense>
      </CardContent>
    </div>
  );
}
