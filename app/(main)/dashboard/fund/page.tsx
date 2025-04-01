import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getMyFunds } from "@/utils/endaoment/server";

interface Fund {
  id: string;
  name: string;
  description: string;
  createdAtUtc: string;
  usdcBalance: string;
  category: string;
}

export default async function FundList() {
  const { data: funds, error } = await getMyFunds();

  if (error) {
    console.error("Error fetching funds:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-4 text-red-500">Failed to load funds. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Funds</h1>
        <Link 
          href="/dashboard/fund/create" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Create New Fund
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(funds as Fund[]).map((fund) => (
          <Link key={fund.id} href={`/dashboard/fund/${fund.id}`}>
            <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{fund.name}</CardTitle>
                <CardDescription>
                  Created {new Date(fund.createdAtUtc).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {fund.description || "No description available"}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{fund.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance:</span>
                    <span>${(parseInt(fund.usdcBalance) / 1000000).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(funds as Fund[]).length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You haven&apos;t created any funds yet.</p>
          <Link 
            href="/dashboard/fund/create" 
            className="text-primary hover:underline mt-2 inline-block"
          >
            Create your first fund
          </Link>
        </div>
      )}
    </div>
  );
}
