import { ReactNode } from "react";
import Navigation from "@/components/layout/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1 overflow-y-auto px-4 py-16 md:py-4">{children}</main>
      <Navigation />
    </>
  );
}
