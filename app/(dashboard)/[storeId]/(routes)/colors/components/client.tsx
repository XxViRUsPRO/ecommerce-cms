"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface ColorClientProps {
  colors: ColorColumn[];
}

export const ColorClient: React.FC<ColorClientProps> = ({ colors }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage your colors"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable indexColumnName="name" columns={columns} data={colors} />
      <Heading title="API" description="API endpoints for colors" />
      <Separator />
      <ApiList entity={{ name: "colors", id: "colorId" }} />
    </>
  );
};
