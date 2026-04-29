"use client";

import { Toaster } from "sonner";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { Navbar } from "@/components/layout/Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="mx-auto min-h-screen max-w-7xl px-4 pb-16 pt-20 md:px-6">{children}</main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(33,29,25,0.9)",
            color: "#F5F0EB",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </>
  );
}
