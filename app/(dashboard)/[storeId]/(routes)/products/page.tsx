import React from "react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const productRows: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatCurrency(product.price.toNumber()),
    isFeatured: product.isFeatured,
    isAvailable: product.isAvailable,
    category: product.category.name,
    size: product.size.name,
    color: product.color.name,
    createdAt: format(product.createdAt, "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={productRows} />
      </div>
    </div>
  );
};

export default ProductsPage;
