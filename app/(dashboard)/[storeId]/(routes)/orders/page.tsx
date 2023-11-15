import React from "react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatCurrency } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const orderRows: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    products: order.orderItems.map((item) => item.product.name).join(", "),
    address: order.address,
    phone: order.phone,
    totalPrice: formatCurrency(
      order.orderItems.reduce((acc, item) => acc + +item.product.price, 0)
    ),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={orderRows} />
      </div>
    </div>
  );
};

export default OrdersPage;
