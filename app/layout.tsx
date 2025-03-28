// TODO: don't show this on the Login page, but do show it on every other page (once the user has signed in)
import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-16 md:py-4">{children}</main>
      </body>
    </html>
  );
}
