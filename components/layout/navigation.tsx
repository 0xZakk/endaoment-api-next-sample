"use client";

import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { Compass, Sparkle, LogOut, House, Plus } from "lucide-react";

export default function Navigation() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }, [supabase, router])

  // Check if we're on a fund detail page
  const isFundDetailPage = pathname?.match(/^\/dashboard\/fund\/[^/]+$/)
  const fundId = isFundDetailPage ? pathname.split('/').pop() : null

  const menuOptions = [
    {
      label: "Home",
      Icon: <House className="w-4 h-4" />,
      onClick: () => router.push("/dashboard"),
    },
    {
      label: "Funds",
      Icon: <Sparkle className="w-4 h-4" />,
      onClick: () => router.push("/dashboard/fund"),
    },
    // TODO: Come back and add an Account screen + flow (?)
    // {
    //   label: "Account",
    //   Icon: <User className="w-4 h-4" />,
    //   onClick: () => console.log("Account clicked"),
    // },
    {
      label: "Create a New DAF",
      Icon: <Plus className="w-4 h-4" />,
      onClick: () => router.push("/dashboard/fund/create"),
    },
    {
      label: "Logout",
      Icon: <LogOut className="w-4 h-4" />,
      onClick: handleSignOut,
    },
  ];

  // Add Explore option only when on a fund detail page
  if (isFundDetailPage && fundId) {
    menuOptions.splice(2, 0, {
      label: "Explore",
      Icon: <Compass className="w-4 h-4" />,
      onClick: () => router.push(`/dashboard/fund/${fundId}/explore`),
    })
  }

  return (
    <>
      <FloatingActionMenu
        className=""
        options={menuOptions}
      />
    </>
  );
}
