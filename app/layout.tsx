import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import "./globals.css";

import { ClerkProvider } from "@/providers/clerk-provider";
import ComponentProvider from "@/providers/component-provider";
import { StoreModal } from "@/components/modals/store-modal";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-w-[992px]", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ComponentProvider>
              <StoreModal />
              <Toaster />
            </ComponentProvider>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
