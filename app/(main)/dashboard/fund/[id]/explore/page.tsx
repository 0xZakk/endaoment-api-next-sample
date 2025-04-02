"use client";

import { useState } from "react";
import { OrganizationSearchForm } from "@/components/forms/organization-search";
import { OrganizationResults } from "@/components/organization-results";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  // TODO: Type this
  const handleSearchResults = (results: any[]) => {
    setOrganizations(results);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Search Organizations</h2>
        <OrganizationSearchForm 
          onSearchStart={() => setIsLoading(true)}
          onSearchComplete={handleSearchResults}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
        <OrganizationResults 
          organizations={organizations} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 