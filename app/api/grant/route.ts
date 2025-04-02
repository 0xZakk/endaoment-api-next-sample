import { NextResponse } from "next/server";
import { staticEndaomentURLs } from "@/utils/endaoment/constants";
import { createClient } from '@/utils/supabase/server'
import { getUserToken } from "@/utils/supabase/utils";
import crypto from "crypto";

export async function POST(request: Request) {
    const supabase = await createClient();

    const data = await request.json();

    // Validate required fields
    const { amount, fund, org, purpose } = data;
    if (!amount || !fund || !org || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user's access token
    const { data: token, error: tokenError } = await getUserToken();
    if (tokenError || !token) {
      return NextResponse.json(
        { error: "Failed to get user token" },
        { status: 401 }
      );
    }

    // Generate idempotency key
    const idempotencyKey = crypto.randomUUID();

    // Convert amount to microdollars (1 USD = 1,000,000 microdollars)
    const requestedAmount = (BigInt(Math.round(parseFloat(amount) * 1000000))).toString();

    // Get the Endaoment Fund ID (instead of our ID for the fund)
    const { data: fundData, error: fundError } = await supabase
      .from('funds')
      .select('*')
      .eq('id', fund)
      .single();

    if (fundError || !fundData) {
      return NextResponse.json(
        { error: "Failed to get fund" },
        { status: 400 }
      );
    }

    // Make request to Endaoment API
    const response = await fetch(
      `${staticEndaomentURLs.api}/v1/transfers/async-grants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          originFundId: fundData.endaoment_uuid,
          destinationOrgId: org,
          requestedAmount,
          purpose,
          idempotencyKey,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Endaoment API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create grant" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
}
