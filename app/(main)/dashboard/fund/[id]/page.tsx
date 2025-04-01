import { notFound } from 'next/navigation'
import { getFund, getFundActivity, getFundTransfers } from '@/utils/endaoment/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type FundPageProps = {
  params: { id: string }
}

type ActivityItem = {
  type: string;
  occurredAtUtc: string;
  usdcAmount: string;
}

type TransferItem = {
  type: string;
  createdAtUtc: string;
  netAmount: number;
  destinationOrg?: {
    name: string;
  };
  destinationSubproject?: {
    name: string;
  };
}

function formatUsdc(amount: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount) / 1000000);
}

export default async function FundDetail({ params }: FundPageProps) {
  const { id } = await params

  if (!id) { notFound() }

  const { data: fund, error: fundError } = await getFund(id)
  const { data: activity, error: activityError } = await getFundActivity(id)
  const { data: transfers, error: transfersError } = await getFundTransfers(id)

  if (fundError || activityError || transfersError) {
    console.error("Error fetching fund data:", fundError, activityError, transfersError)
    return <div>Error fetching fund data</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Fund Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{fund?.name}</CardTitle>
              <CardDescription>{fund?.description}</CardDescription>
            </div>
            <Button asChild>
              <Link href={`/dashboard/fund/${id}/contribute`}>Contribute</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">USDC Balance</p>
              <p className="text-2xl font-semibold">{formatUsdc(fund?.usdcBalance || "0")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Granted</p>
              <p className="text-2xl font-semibold">{formatUsdc(fund?.totalGrantedUsdc || "0")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Grants Given</p>
              <p className="text-2xl font-semibold">{fund?.grantsGiven || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity && activity.length > 0 ? (
            <div className="space-y-4">
              {activity.map((item: ActivityItem, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(item.occurredAtUtc), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">
                      {item.type === 'donation' && `Donation of ${formatUsdc(item.usdcAmount)}`}
                      {item.type === 'grant' && `Grant of ${formatUsdc(item.usdcAmount)}`}
                      {item.type === 'portfolio_trade' && `Portfolio trade of ${formatUsdc(item.usdcAmount)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatUsdc(item.usdcAmount)}</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {transfers && transfers.length > 0 ? (
            <div className="space-y-4">
              {transfers.map((transfer: TransferItem, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{transfer.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transfer.createdAtUtc), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">
                      {transfer.destinationOrg?.name || transfer.destinationSubproject?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatUsdc(transfer.netAmount.toString())}</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent transfers
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
