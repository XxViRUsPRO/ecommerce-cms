"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface CategoryClientProps {
  categories: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage your categories"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable indexColumnName="name" columns={columns} data={categories} />
      <Heading title="API" description="API endpoints for categories" />
      <Separator />
      <ApiList entity={{ name: "categories", id: "categoryId" }} />
    </>
  );
};
