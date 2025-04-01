import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WireDonationForm } from "@/components/forms/wire-donation";
import { getWireInstructions } from "@/utils/endaoment/server";
import { wireDonation } from "@/app/actions";

type ContributePageProps = {
  params: { id: string }
}

export default async function ContributePage({ params }: ContributePageProps) {
  const { id } = await params;
  const wireInstructions = await getWireInstructions();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Contribute to Fund</CardTitle>
          <CardDescription>
            Make a contribution to this fund using various payment methods including cryptocurrency, stocks, or traditional payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WireDonationForm
            fundId={id}
            wireInstructions={wireInstructions}
            action={wireDonation}
          />
        </CardContent>
      </Card>
    </div>
  )
} 