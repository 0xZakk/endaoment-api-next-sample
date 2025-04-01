"use client"
/*
 * Show a message here that they'll be redirected
 * - hit the /api/auth/init-login endpoint
 */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react";

export default function EndaomentLogin() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/init-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json();
      console.log(data)
      // redirect the user to data.url:
      window.location.href = data.url;
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Connect Endaoment Account</CardTitle>
        <CardDescription>
          <p className="mb-4">
            You must connect your Endaoment account
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="default"
          className="w-full"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Your Endaoment Account"}
        </Button>
      </CardContent>
    </Card>
  );
}


