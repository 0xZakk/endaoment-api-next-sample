"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { DonationModal } from "./donation-modal";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface OrganizationCardProps {
  id: string;
  name: string;
  description: string;
  logo?: string;
  disabled?: boolean;
}

export function OrganizationCard({ id, name, description, logo, disabled }: OrganizationCardProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const params = useParams();
  const fundId = params.id as string;
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    }

    getUser();
  }, [supabase]);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      const { data, error } = await supabase
        .from("bookmarked_organizations")
        .select("*")
        .eq("organization_id", id)
        .eq("fund_id", fundId)
        .single();

      if (!error && data) {
        setIsBookmarked(true);
      }
    };

    if (fundId && id) {
      checkIfBookmarked();
    }
  }, [fundId, id]);  

  const handleBookmarkToggle = async () => {
    setIsLoading(true);

    if (isBookmarked) {
      const { error } = await supabase
        .from("bookmarked_organizations")
        .delete()
        .eq("organization_id", id)
        .eq("fund_id", fundId);

      if (error) throw error;

      setIsBookmarked(false);
      toast.success("Organization removed from bookmarks");
    } else {
      const bookmark = {
        organization_id: id,
        fund_id: fundId,
        user_id: user?.id,
        name,
        description,
        logo,
      };

      const { data, error } = await supabase
        .from("bookmarked_organizations")
        .insert(bookmark)
        .select();

      if (error) {
        console.error("Error fetching bookmark:", error);
      }

      setIsBookmarked(true);
      toast.success("Organization bookmarked successfully");
    }


    setIsLoading(false);
  };

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
              onClick={handleBookmarkToggle}
              disabled={isLoading}
            >
              <Bookmark 
                className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} 
              />
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