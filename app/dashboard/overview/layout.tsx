import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { DollarSign, PartyPopper, ShoppingBag, User2 } from "lucide-react";
import React from "react";

async function getData() {
  const [user, products, order] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
      },
    }),

    prisma.product.findMany({
      select: {
        id: true,
      },
    }),

    prisma.order.findMany({
      select: {
        totalPrice: true,
      },
    }),
  ]);

  return {
    user,
    products,
    order,
  };
}

export default async function OverViewLayout({
  sales,

  bar_stats,
}: {
  sales: React.ReactNode;

  bar_stats: React.ReactNode;
}) {
  const { products, user, order } = await getData();

  const totalAmount = order.reduce((accumalator, currentValue) => {
    return accumalator + currentValue.totalPrice;
  }, 0);
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                &#8358;
                {new Intl.NumberFormat("en-US").format(totalAmount / 100)}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on 100 Charges
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Sales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">+{order.length}</p>
              <p className="text-xs text-muted-foreground">
                Total Sales on JerseyVault
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Products</CardTitle>
              <PartyPopper className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-xs text-muted-foreground">
                Total Products created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Users</CardTitle>
              <User2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{user.length}</p>
              <p className="text-xs text-muted-foreground">
                Total Users Signed Up
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{bar_stats}</div>
          <div className="col-span-4 md:col-span-3">{sales}</div>
        </div>
      </div>
    </PageContainer>
  );
}
