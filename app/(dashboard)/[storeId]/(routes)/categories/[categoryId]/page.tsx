import React from "react";

import prisma from "@/lib/prisma";
import CategoryForm from "./components/category-form";

interface CategoryPageProps {
  params: {
    storeId: string;
    categoryId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const category = await prisma.category.findUnique({
    where: { id: params.categoryId },
  });

  const billboards = await prisma.billboard.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
