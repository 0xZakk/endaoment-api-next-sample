import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function Hero() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  const link = session ? "/dashboard" : "/auth/signup";
  const buttonText = session ? "Go to Dashboard" : "Sign up here";

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">Start Giving</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                Give anything {" "}
                Grant anywhere
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Make in-app donations of stock, cash, crypto, private assets and more. Invest tax-free and grant when ready to any nonprofit.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Link href={link}>
                <Button size="lg" className="gap-4">
                  {buttonText} <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-muted rounded-md aspect-square"></div>
            <div className="bg-muted rounded-md row-span-2"></div>
            <div className="bg-muted rounded-md aspect-square"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero }
