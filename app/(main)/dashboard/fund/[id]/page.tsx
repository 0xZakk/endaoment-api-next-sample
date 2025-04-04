import { notFound } from 'next/navigation'
import { getFund, getFundActivity, getFundTransfers, getBookmarks } from '@/utils/endaoment/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Compass, CircleDollarSign } from 'lucide-react';
import { OrganizationCard } from '@/components/organization-card';
import { ActivityItem, TransferItem } from '@/types/dashboard';

type FundPageProps = {
  params: { id: string }
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
  const { data: bookmarks, error: bookmarksError } = await getBookmarks(id)

  if (fundError || activityError || transfersError || bookmarksError) {
    console.error("Error fetching fund data:", fundError, activityError, transfersError, bookmarksError)
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
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/dashboard/fund/${id}/explore`}>
                  <Compass className="w-4 h-4 mr-2" />
                  Explore
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/fund/${id}/contribute`}>
                  <CircleDollarSign className="w-4 h-4 mr-2" />
                  Contribute
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">USDC Balance</p>
              <p className="text-2xl font-semibold">
                {formatUsdc(fund?.usdcBalance || "0")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Granted</p>
              <p className="text-2xl font-semibold">
                {formatUsdc(fund?.totalGrantedUsdc || "0")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Grants Given</p>
              <p className="text-2xl font-semibold">{fund?.grantsGiven || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookmarked Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>Bookmarked Organizations</CardTitle>
          <CardDescription>Organizations you've saved for future reference</CardDescription>
        </CardHeader>
        <CardContent>
          {bookmarks && bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((org) => (
                <OrganizationCard
                  key={org.organization_id}
                  id={org.organization_id}
                  name={org.name}
                  description={org.description}
                  logo={org.logo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No bookmarked organizations
            </div>
          )}
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
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(item.occurredAtUtc), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">
                      {item.type === "donation" &&
                        `Donation of ${formatUsdc(item.usdcAmount)}`}
                      {item.type === "grant" &&
                        `Grant of ${formatUsdc(item.usdcAmount)}`}
                      {item.type === "portfolio_trade" &&
                        `Portfolio trade of ${formatUsdc(item.usdcAmount)}`}
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
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{transfer.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transfer.createdAtUtc), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">
                      {transfer.destinationOrg?.name ||
                        transfer.destinationSubproject?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatUsdc(transfer.requestedAmount.toString())}
                    </p>
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
  );
}
