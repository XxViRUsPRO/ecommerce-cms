import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      billboardId: string;
    };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Missing billboardId", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`API>[STOREID]>BILLBOARDS>[BILLBOARDID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { label, imgUrl } = await req.json();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!label || !imgUrl) {
      return new NextResponse("Missing label or imgUrl", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Missing billboardId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imgUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(
      `API>[STOREID]>BILLBOARDS>[BILLBOARDID]>PATCH - ERROR: ${error}`
    );
  }
}

export async function DELETE(
  _: unknown,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.billboardId)
      return new NextResponse("Missing billboardId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(
      `API>[STOREID]>BILLBOARDS>[BILLBOARDID]>DELETE - ERROR: ${error}`
    );
  }
}
