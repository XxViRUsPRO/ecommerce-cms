import prisma from "@/lib/prisma";

export default async function getSalesCount(storeId: string) {
  const salesCount = await prisma.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
}
