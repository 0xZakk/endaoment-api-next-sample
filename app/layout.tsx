"use client";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const pages = [
  { name: "Fund 1", href: "/fund/1" },
  { name: "Fund 2", href: "/fund/2" },
  { name: "Fund 3", href: "/fund/3" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar for md+ screens */}
        <aside className="hidden md:flex flex-col w-16 items-center justify-between bg-gray-100 border-r p-2">
          <div className="flex flex-col gap-4">
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
              >
                {/* Ideally you'd put icons here instead of text */}
              </Link>
            ))}
          </div>
          <Link
            href="/fund/create"
            className="w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
          >
            +
          </Link>
        </aside>

        {/* Mobile menu */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-48 p-4">
              <div className="flex flex-col gap-4 mt-4">
                {pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="text-base font-medium"
                  >
                    {page.name}
                  </Link>
                ))}
                <Link href="/create" className="mt-8 font-bold text-black">
                  + Create
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </body>
    </html>
  );
}
