import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: NextRequest,
  { params: { storeId } }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Products ids are required", {
      status: 400,
    });
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price.toNumber() * 100,
    },
    quantity: 1,
  }));

  const order = await prisma.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: products.map((product) => ({
          product: {
            connect: {
              id: product.id,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.STRIPE_FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.STRIPE_FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    {
      url: session.url,
    },
    { headers: corsHeaders }
  );
}
