import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { FormValues } from "@/schemas/product-form-schema";

export async function GET(
  _: unknown,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`API>[STOREID]>PRODUCTS>[PRODUCTID]>GET - ERROR: ${error}`);
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const {
      name,
      price,
      images,
      isFeatured,
      isAvailable,
      categoryId,
      sizeId,
      colorId,
    }: FormValues = await req.json();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!name || !price || !images || !categoryId || !sizeId || !colorId) {
      return new NextResponse("Missing fields", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isAvailable,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          create: images,
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`API>[STOREID]>PRODUCTS>[PRODUCTID]>PATCH - ERROR: ${error}`);
  }
}

export async function DELETE(
  _: unknown,
  {
    params,
  }: {
    params: {
      storeId: string;
      productId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticaed", { status: 401 });
    if (!params.storeId)
      return new NextResponse("Missing storeId", { status: 400 });
    if (!params.productId)
      return new NextResponse("Missing productId", { status: 400 });

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`API>[STOREID]>PRODUCTS>[PRODUCTID]>DELETE - ERROR: ${error}`);
  }
}
