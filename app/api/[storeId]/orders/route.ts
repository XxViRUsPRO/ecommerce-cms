import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  _: unknown,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log(`API>[STOREID]>ORDERS>GET - ERROR: ${error}`);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
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

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const order = await prisma.order.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log(`API>[STOREID]>ORDERS>POST - ERROR: ${error}`);
  }
}
