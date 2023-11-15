import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      sizeId: string;
    };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Missing sizeId", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`API>[STOREID]>SIZES>[SIZEID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
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
    if (!params.sizeId) {
      return new NextResponse("Missing sizeId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`API>[STOREID]>SIZES>[SIZEID]>PATCH - ERROR: ${error}`);
  }
}

export async function DELETE(
  _: unknown,
  {
    params,
  }: {
    params: {
      storeId: string;
      sizeId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.sizeId)
      return new NextResponse("Missing sizeId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prisma.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`API>[STOREID]>SIZES>[SIZEID]>DELETE - ERROR: ${error}`);
  }
}
