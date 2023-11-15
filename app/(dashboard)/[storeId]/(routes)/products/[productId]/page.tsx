import React from "react";

import prisma from "@/lib/prisma";
import ProductForm from "./components/product-form";

interface ProductPageProps {
  params: {
    storeId: string;
    productId: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      images: true,
    },
  });
  const parsedPrice = parseFloat(product?.price.toString() ?? "0");

  const categories = await prisma.category.findMany({
    where: { storeId: params.storeId },
  });
  const sizes = await prisma.size.findMany({
    where: { storeId: params.storeId },
  });
  const colors = await prisma.color.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={
            {
              ...product,
              price: parsedPrice,
            } as any
          }
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
