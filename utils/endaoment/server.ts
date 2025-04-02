'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { staticEndaomentURLs } from "./constants";
import { getUserToken } from "../supabase/utils";
import { 
  Fund,
  WireDonationRequest 
} from '@/types/endaoment';

// Create a new DAF in Endaoment
export async function createDaf(formData: FormData) {
  // TODO: find a better way to validate inputs
  const fund: Fund = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    advisor: {
      firstName: formData.get("fundAdvisor.firstName") as string,
      lastName: formData.get("fundAdvisor.lastName") as string,
      email: formData.get("fundAdvisor.email") as string,
      address: {
        line1: formData.get("fundAdvisor.address.line1") as string,
        line2: formData.get("fundAdvisor.address.line2") as string,
        city: formData.get("fundAdvisor.address.city") as string,
        state: formData.get("fundAdvisor.address.state") as string,
        zip: formData.get("fundAdvisor.address.zip") as string,
        country: formData.get("fundAdvisor.address.country") as string,
      }
    }
  };

  if (!fund.name || !fund.description || !fund.advisor.firstName) {
    throw new Error("Missing required fields");
  }

  const { data: token, error: tokenError } = await getUserToken()
  
  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const fundCreationRequest = await fetch(`${staticEndaomentURLs.api}/v1/funds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({
      fundInput: fund
    }),
  })

  const fundCreationResponse = await fundCreationRequest.json();

  if (fundCreationResponse.error) {
    console.error("Error creating fund:", fundCreationResponse.error);
    throw new Error(fundCreationResponse.error);
  }

  // Store some of the fund data in the database
  const { data: fundRecord, error: insertError } = await supabase
    .from('funds')
    .insert({
      user_id: user.id,
      name: fundCreationResponse.name,
      description: fundCreationResponse.description,
      endaoment_uuid: fundCreationResponse.id,
    })

  redirect('/dashboard/fund/' + fundCreationResponse.id);
}

// Get Fund
export async function getFund(id: string) {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      data: null,
      error: new Error(userError.message),
    }
  }

  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    return {
      data: null,
      error: new Error(tokenError.message),
    }
  }  

  const { data: fund, error: fundError } = await supabase
    .from('funds')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', id);

  if (fundError) {
    console.error("Error fetching fund:", fundError);
    return {
      data: null,
      error: new Error(fundError.message),
    }
  }

  const response = await fetch(`${staticEndaomentURLs.api}/v1/funds/${fund[0].endaoment_uuid}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error("Error fetching fund data:", response.error);
    return {
      data: null,
      error: new Error(`Failed to fetch fund data: ${response.statusText}`),
    }
  }

  const fundData = await response.json()

  return {
    data: fundData,
    error: null,
  }
}

// Get Fund Activity
export async function getFundActivity(id: string) {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      data: null,
      error: new Error(userError.message),
    }
  }

  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    return {
      data: null,
      error: new Error(tokenError.message),
    }
  }

  const { data: fund, error: fundError } = await supabase
    .from('funds')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', id);

  if (fundError) {
    console.error("Error fetching fund:", fundError);
    return {
      data: null,
      error: new Error(fundError.message),
    }
  }

  const response = await fetch(`${staticEndaomentURLs.api}/v1/activity/fund/${fund[0].endaoment_uuid}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return {
      data: null,
      error: new Error(`Failed to fetch fund activity: ${response.statusText}`),
    }
  }

  const activityData = await response.json()

  return {
    data: activityData,
    error: null,
  }
}

// Get Fund Transfers
export async function getFundTransfers(id: string) {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      data: null,
      error: new Error(userError.message),
    }
  }

  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const { data: fund, error: fundError } = await supabase
    .from('funds')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', id);

  if (fundError) {
    console.error("Error fetching fund:", fundError);
    return {
      data: null,
      error: new Error(fundError.message),
    }
  }


  const response = await fetch(`${staticEndaomentURLs.api}/v1/transfers/grants/fund/${fund[0].endaoment_uuid}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return {
      data: null,
      error: new Error(`Failed to fetch fund transfers: ${response.statusText}`),
    }
  }

  const transfersData = await response.json()

  return {
    data: transfersData,
    error: null,
  }
}

// Get Wire Instructions
export async function getWireInstructions() {
  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const response = await fetch(
    `${staticEndaomentURLs.api}/v1/donation-pledges/wire/details/domestic`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    return {
      data: null,
      error: new Error(`Failed to fetch wire instructions: ${response.statusText}`),
    }
  }

  const wireInstructions = await response.json();

  return {
    data: wireInstructions,
    error: null,
  };
}

// Create Wire Donation
export async function createWireDonation(request: Omit<WireDonationRequest, 'donorIdentity' | 'isRebalanceRequested'>) {
  const { data: token, error: tokenError } = await getUserToken();

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const response = await fetch(
    `${staticEndaomentURLs.api}/v1/donation-pledges/wire`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    return {
      data: null,
      error: new Error(`Failed to create wire donation: ${response.statusText}`),
    }
  }

  const donationData = await response.json();

  return {
    data: donationData,
    error: null,
  };
}

// Get My Funds
export async function getMyFunds() {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();

  console.log("User:", user);

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      data: null,
      error: new Error(userError.message),
    }
  }

  const { data: funds, error: fundsError } = await supabase
    .from('funds')
    .select('*')
    .eq('user_id', user?.id);

  if (fundsError) {
    console.error("Error fetching funds:", fundsError);
    return {
      data: null,
      error: new Error(fundsError.message),
    }
  }

  return {
    data: funds,
    error: null,
  }
}

// Get Bookmarks for a Fund
export async function getBookmarks(id: string) {
  const supabase = await createClient();

  const { data: {user}, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      data: null,
      error: new Error(userError.message),
    }
  }

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarked_organizations')
    .select('*')
    .eq('fund_id', id);

  if (bookmarksError) {
    console.error("Error fetching bookmarks:", bookmarksError);
    return {
      data: null,
      error: new Error(bookmarksError.message),
    }
  }

  return {
    data: bookmarks,
    error: null,
  }
}
