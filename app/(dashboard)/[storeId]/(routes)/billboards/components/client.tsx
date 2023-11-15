"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps {
  billboards: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage your billboards"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>
      <Separator />
      <DataTable indexColumnName="label" columns={columns} data={billboards} />
      <Heading title="API" description="API endpoints for billboards" />
      <Separator />
      <ApiList entity={{ name: "billboards", id: "billboardId" }} />
    </>
  );
};
