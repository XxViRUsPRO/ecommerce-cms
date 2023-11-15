import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

const validateColor = (value: string) => {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return regex.test(value);
};

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      colorId: string;
    };
  }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Missing colorId", { status: 400 });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`API>[STOREID]>COLORS>[COLORID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
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
    if (!validateColor(value)) {
      return new NextResponse("Invalid color value", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Missing colorId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prisma.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`API>[STOREID]>COLORS>[COLORID]>PATCH - ERROR: ${error}`);
  }
}

export async function DELETE(
  _: unknown,
  {
    params,
  }: {
    params: {
      storeId: string;
      colorId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.colorId)
      return new NextResponse("Missing colorId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prisma.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`API>[STOREID]>COLORS>[COLORID]>DELETE - ERROR: ${error}`);
  }
}
