"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps {
  products: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ products }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Products (${products.length})`}
          description="Manage your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable indexColumnName="name" columns={columns} data={products} />
      <Heading title="API" description="API endpoints for products" />
      <Separator />
      <ApiList entity={{ name: "products", id: "productId" }} />
    </>
  );
};
