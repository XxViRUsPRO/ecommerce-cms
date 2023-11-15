import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      orderId: string;
    };
  }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Missing orderId", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log(`API>[STOREID]>ORDERS>[ORDERID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      orderId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!name || !value) {
      return new NextResponse("Missing name or value", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }
    if (!params.orderId) {
      return new NextResponse("Missing orderId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const order = await prisma.order.updateMany({
      where: {
        id: params.orderId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log(`API>[STOREID]>ORDERS>[ORDERID]>PATCH - ERROR: ${error}`);
  }
}

export async function DELETE(
  _: unknown,
  {
    params,
  }: {
    params: {
      storeId: string;
      orderId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.orderId)
      return new NextResponse("Missing orderId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const order = await prisma.order.deleteMany({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log(`API>[STOREID]>ORDERS>[ORDERID]>DELETE - ERROR: ${error}`);
  }
}
