"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface SizeClientProps {
  sizes: SizeColumn[];
}

export const SizeClient: React.FC<SizeClientProps> = ({ sizes }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage your sizes"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable indexColumnName="name" columns={columns} data={sizes} />
      <Heading title="API" description="API endpoints for sizes" />
      <Separator />
      <ApiList entity={{ name: "sizes", id: "sizeId" }} />
    </>
  );
};
