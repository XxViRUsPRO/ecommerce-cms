import prisma from "@/lib/prisma";

export default async function getTotalRevenue(storeId: string) {
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

  const totalRevenue = paidOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((acc, orderItem) => {
      return acc + +orderItem.product.price;
    }, 0);
    return acc + orderTotal;
  }, 0);

  return totalRevenue;
}
