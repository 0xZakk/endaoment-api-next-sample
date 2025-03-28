"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

const pages = [
  { name: "Fund 1", href: "/fund/1" },
  { name: "Fund 2", href: "/fund/2" },
  { name: "Fund 3", href: "/fund/3" },
];

export default function Sidebar() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }, [supabase, router])

  return (
    <>
      {/* Sidebar for md+ screens */}
      <aside className="hidden md:flex flex-col w-16 items-center justify-between bg-gray-100 border-r p-2">
        <div className="flex flex-col gap-4">
          {pages.map((page) => (
            <Link key={page.href} href={page.href}>
              <div className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center" />
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
      <div className="md:hidden absolute top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-48 p-4">
            <div className="flex flex-col gap-4 mt-4">
              {pages.map((page) => (
                <Link key={page.href} href={page.href} className="text-base font-medium">
                  {page.name}
                </Link>
              ))}
              <Link href="/create" className="mt-8 font-bold text-black">
                + Create
              </Link>
              <Button
                onClick={handleSignOut}
                variant="destructive"
                title="Sign out"
              >
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
