import { BarGraph } from "@/features/overview/components/bar-graph";
import prisma from "@/lib/prisma";
async function getData() {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const data = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const result = data.map((item) => ({
    date: new Intl.DateTimeFormat("en-US").format(item.createdAt),
    revenue: item.totalPrice / 100,
  }));

  return result;
}
export default async function BarStats() {
  const data = await getData();
  return <BarGraph data={data} />;
}
