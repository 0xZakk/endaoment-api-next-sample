import { NextResponse } from "next/server";
import { staticEndaomentURLs } from "@/utils/endaoment/constants";
import { getUserToken } from "@/utils/supabase/utils";
import crypto from "crypto";

export async function POST(request: Request) {
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
          originFundId: fund,
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
