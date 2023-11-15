import prisma from "@/lib/prisma";

export default async function getStockCount(storeId: string) {
  const stockCount = await prisma.product.count({
    where: {
      storeId,
      isAvailable: true,
    },
  });

  return stockCount;
}
