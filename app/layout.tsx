// TODO: don't show this on the Login page, but do show it on every other page (once the user has signed in)
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body className="flex h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
