import prisma from "@/lib/prisma";

type GraphData = {
  name: string;
  value: number;
};

export default async function getGraphRevenue(storeId: string) {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenue = 0;

    for (const orderItem of order.orderItems) {
      revenue += +orderItem.product.price;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenue;
  }

  const graphData: GraphData[] = [];

  for (let month = 0; month < 12; month++) {
    graphData.push({
      name: new Date(0, +month).toLocaleString("default", { month: "short" }),
      value: monthlyRevenue[month] || 0,
    });
  }

  return graphData;
}
