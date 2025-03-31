import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-16 md:py-4">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </main>
  )
}
