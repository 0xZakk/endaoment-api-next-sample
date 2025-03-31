"use client";

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { Compass, Sparkle, LogOut, House } from "lucide-react";

const dafs = [
  { label: "Fund 1", id: "1", Icon: <Sparkle className="w-4 h-4" /> },
  { label: "Fund 2", id: "2", Icon: <Sparkle className="w-4 h-4" /> },
  { label: "Fund 3", id: "3", Icon: <Sparkle className="w-4 h-4" /> },
];

export default function Navigation() {
  const supabase = createClient()
  const router = useRouter()

  const options = dafs.map(daf => {
    return {
      label: daf.label,
      Icon: daf.Icon,
      onClick: () => router.push(`/fund/${daf.id}`),
    }
  })

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }, [supabase, router])

  return (
    <>
      <FloatingActionMenu
        className=""
        options={[
          {
            label: "Home",
            Icon: <House className="w-4 h-4" />,
            onClick: () => router.push("/dashboard"),
          },
          ...options,
          // TODO: Come back and add an Account screen + flow (?)
          // {
          //   label: "Account",
          //   Icon: <User className="w-4 h-4" />,
          //   onClick: () => console.log("Account clicked"),
          // },
          {
            label: "Explore",
            Icon: <Compass className="w-4 h-4" />,
            onClick: () => console.log("Settings clicked"),
          },
          {
            label: "Logout",
            Icon: <LogOut className="w-4 h-4" />,
            onClick: handleSignOut,
          },
        ]}
      />
    </>
  )
}
