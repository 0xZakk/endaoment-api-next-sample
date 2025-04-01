'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { staticEndaomentURLs } from './utils';
import { getUserToken } from '@/utils/supabase/utils';

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

type FundAdvisor = {
  firstName: string;
  lastName?: string;
  email: string;
  address: Address;
}

type Fund = {
  name: string;
  description: string;
  advisor: FundAdvisor;
}

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

  const fundCreationRequest = await fetch(`${staticEndaomentURLs.api}/funds`, {
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
  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const response = await fetch(`${staticEndaomentURLs.api}/funds/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
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
  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const response = await fetch(`${staticEndaomentURLs.api}/activity/fund/${id}`, {
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
  const { data: token, error: tokenError } = await getUserToken()

  if (tokenError) {
    console.error("Error fetching token:", tokenError);
    throw new Error(tokenError.message);
  }

  const response = await fetch(`${staticEndaomentURLs.api}/transfers/grants/fund/${id}`, {
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
