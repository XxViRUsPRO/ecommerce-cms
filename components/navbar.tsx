import React from "react";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { UserButton, auth } from "@clerk/nextjs";
import NavbarRoutes from "@/components/navbar-routes";
import StoreSelector from "@/components/store-selector";
import { ModeToggle } from "./theme-toggle";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="rounded-b-3xl border-b">
      <div className="flex items-center h-16 px-4">
        <StoreSelector items={stores} />
        <NavbarRoutes className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
