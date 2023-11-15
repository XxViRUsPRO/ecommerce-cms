import React from "react";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { UserButton, auth } from "@clerk/nextjs";
import NavbarRoutes from "@/components/navbar-routes";
import StoreSelector from "@/components/store-selector";
import { ModeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

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
        <div className="flex lg:hidden ml-auto">
          <Sheet>
            <SheetTrigger>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center justify-between px-2 pr-10">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-lg font-bold">Menu</span>
                    <span></span>
                  </div>
                </SheetTitle>
                <SheetDescription asChild>
                  <div>
                    <NavbarRoutes className="mt-6 flex-col space-y-4 items-start justify-center" />
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:flex items-center w-full">
          <NavbarRoutes className="mx-6" />
          <div className="flex-1 flex items-center justify-end space-x-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
