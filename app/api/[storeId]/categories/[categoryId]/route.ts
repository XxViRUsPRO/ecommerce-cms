import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Missing categoryId", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`API>[STOREID]>CATEGORIES>[CATEGORYID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      categoryId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!name || !billboardId) {
      return new NextResponse("Missing name or billboardId", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Missing billboardId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(
      `API>[STOREID]>CATEGORIES>[CATEGORYID]>PATCH - ERROR: ${error}`
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
      categoryId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(
      `API>[STOREID]>CATEGORIES>[CATEGORYID]>DELETE - ERROR: ${error}`
    );
  }
}
