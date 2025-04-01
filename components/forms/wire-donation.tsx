'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { WireInstructions } from "@/utils/endaoment/server"

interface WireDonationFormProps extends React.ComponentPropsWithoutRef<"div"> {
  fundId: string;
  wireInstructions: {
    data: WireInstructions | null;
    error: Error | null;
  };
  action: (formData: FormData) => Promise<void>;
}

export function WireDonationForm({
  className,
  fundId,
  wireInstructions,
  action,
  ...props
}: WireDonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await action(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (wireInstructions.error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading wire instructions: {wireInstructions.error.message}
      </div>
    );
  }

  if (!wireInstructions.data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading wire instructions...
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Wire Transfer Instructions</CardTitle>
          <CardDescription>
            Please use the following information to complete your wire transfer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Beneficiary Name</Label>
            <p className="text-sm">{wireInstructions.data.beneficiary.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Routing Number</Label>
              <p className="text-sm">{wireInstructions.data.receivingBank.abaRoutingNumber}</p>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <p className="text-sm">{wireInstructions.data.beneficiary.accountNumber}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <p className="text-sm">{wireInstructions.data.beneficiary.typeOfAccount}</p>
          </div>
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <p className="text-sm">{wireInstructions.data.receivingBank.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bank Address</Label>
              <p className="text-sm">{wireInstructions.data.receivingBank.address}</p>
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Address</Label>
              <p className="text-sm">{wireInstructions.data.beneficiary.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation Amount</CardTitle>
          <CardDescription>
            Enter the amount you would like to donate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <input type="hidden" name="fundId" value={fundId} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Submit Donation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 