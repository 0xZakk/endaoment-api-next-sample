"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { DonationModal } from "./donation-modal";
import { useParams } from "next/navigation";

interface OrganizationCardProps {
  id: string;
  name: string;
  description: string;
  logo?: string;
  disabled?: boolean;
}

export function OrganizationCard({ id, name, description, logo, disabled }: OrganizationCardProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const params = useParams();
  const fundId = params.id as string;

  return (
    <>
      <Card className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            {logo ? (
              <div className="relative h-12 w-12">
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-md bg-muted" />
            )}
            <div>
              <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
            </div>
          </div>
          {!disabled && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => console.log("Bookmarked")}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        {!disabled && (
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => setIsDonationModalOpen(true)}
            >
              Donate
            </Button>
          </CardFooter>
        )}
      </Card>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        organizationName={name}
        organizationId={id}
        fundId={fundId}
      />
    </>
  );
} 