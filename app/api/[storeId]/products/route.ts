import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { FormValues } from "@/schemas/product-form-schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isAvailable: true,
        storeId: params.storeId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(`API>[STOREID]>PRODUCTS>GET - ERROR: ${error}`);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
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

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isFeatured,
        isAvailable,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: images,
          },
        },
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`API>[STOREID]>PRODUCTS>POST - ERROR: ${error}`);
  }
}
