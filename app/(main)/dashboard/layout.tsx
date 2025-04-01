import { ReactNode } from "react";
import Navigation from "@/components/layout/navigation";
import { createClient } from "@/utils/supabase/server";
import { staticEndaomentURLs } from "@/utils/endaoment/utils";


export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  const { data: tokenData, error: tokenError } = await supabase
    .from("endaoment_tokens")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (tokenError) {
    console.error("Error fetching token data:", tokenError);
  }

  const response = await fetch(`${staticEndaomentURLs.api}/v1/funds/mine`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData?.access_token}`,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json();

  const funds = data.map(fund => ({
    label: fund.name,
    id: fund.id,
  }))

  return (
    <>
      <main className="flex-1 overflow-y-auto px-4 py-16 md:py-4">{children}</main>
      <Navigation funds={funds} />
    </>
  );
}
