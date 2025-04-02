"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName: string;
  organizationId: string;
  fundId: string;
}

export function DonationModal({
  isOpen,
  onClose,
  organizationName,
  organizationId,
  fundId,
}: DonationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: formData.get("amount"),
      purpose: formData.get("purpose"),
      fund: fundId,
      org: organizationId,
    };

    try {
      const response = await fetch("/api/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create donation");
      }

      const result = await response.json();
      setIsSuccess(true);

      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating donation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Donate to {organizationName}
          </DialogTitle>
        </DialogHeader>
        {isSuccess ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">Success!</div>
              <div className="text-sm text-muted-foreground">
                Your donation was created. You will receive an email when it settles.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose (Optional)</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="Why are you donating?"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Donation..." : "Submit Donation"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 
