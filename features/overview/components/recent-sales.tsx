import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      totalPrice: true,
      id: true,
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
    take: 7,
  });

  return data;
}

export async function RecentSales() {
  const data = await getData();
  const totalSales = data.length;

  const sampleImages = [
    "https://api.slingacademy.com/public/sample-users/1.png",
    "https://api.slingacademy.com/public/sample-users/2.png",
    "https://api.slingacademy.com/public/sample-users/3.png",
    "https://api.slingacademy.com/public/sample-users/4.png",
    "https://api.slingacademy.com/public/sample-users/5.png",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          You made {totalSales} sales this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {data.map((item, index) => (
            <div className="flex items-center gap-3" key={item.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={sampleImages[index]} alt="Avatar" />
                <AvatarFallback>
                  {item.user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.user?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.user?.email}
                </p>
              </div>
              <div className="ml-auto font-medium">
                +&#8358;
                {new Intl.NumberFormat("en-US").format(item.totalPrice / 100)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
