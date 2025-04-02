"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { staticEndaomentURLs } from "@/utils/endaoment/constants";

interface OrganizationSearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (results: any[]) => void;
}

export function OrganizationSearchForm({ onSearchStart, onSearchComplete }: OrganizationSearchFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    onSearchStart();

    const formData = new FormData(e.currentTarget);

    // Get checkbox values
    const isClaimed = formData.get("claimed") === "on";
    const isUnclaimed = formData.get("unclaimed") === "on";

    // Format status string according to API requirements
    let status = "";
    if (isClaimed && isUnclaimed) {
      status = "claimed,unclaimed";
    } else if (isClaimed) {
      status = "claimed";
    } else if (isUnclaimed) {
      status = "unclaimed";
    }

    const data = {
      searchTerm: formData.get("searchTerm"),
      nteeMajorCodes: formData.get("nteeMajorCodes"),
      nteeMinorCodes: formData.get("nteeMinorCodes"),
      countries: formData.get("countries"),
      subdivisions: formData.get("subdivisions"),
      status,
    };

    const searchTerm = data.searchTerm as string;
    const response = await fetch(
      `${staticEndaomentURLs.api}/v2/orgs/search?searchTerm=${encodeURIComponent(searchTerm)}`);

    if (!response.ok) {
      console.error("Error searching organizations:", response.statusText);
      setIsLoading(false);
      onSearchComplete([]);
      return;
    }

    const results = await response.json();

    console.log("Search results:", results);

    setIsLoading(false);
    onSearchComplete(results);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="searchTerm">Search Term</Label>
        <Input
          id="searchTerm"
          name="searchTerm"
          placeholder="e.g. Fire Prevention, Conservancy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nteeMajorCodes">NTEE Major Code(s)</Label>
        <Input
          id="nteeMajorCodes"
          name="nteeMajorCodes"
          placeholder="Comma-separated codes"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nteeMinorCodes">NTEE Minor Code(s)</Label>
        <Input
          id="nteeMinorCodes"
          name="nteeMinorCodes"
          placeholder="Comma-separated codes"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="countries">Country</Label>
        <Input
          id="countries"
          name="countries"
          placeholder="e.g. USA, CAN"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subdivisions">Subdivisions</Label>
        <Input
          id="subdivisions"
          name="subdivisions"
          placeholder="e.g. CA, NY"
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="claimed" name="claimed" disabled />
            <Label htmlFor="claimed">Claimed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="unclaimed" name="unclaimed" disabled />
            <Label htmlFor="unclaimed">Unclaimed</Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
} 
