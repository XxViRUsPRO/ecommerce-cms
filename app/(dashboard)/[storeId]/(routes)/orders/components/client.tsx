"use client";

import React from "react";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface OrderClientProps {
  orders: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage your orders"
      />
      <Separator />
      <DataTable indexColumnName="products" columns={columns} data={orders} />
    </>
  );
};
