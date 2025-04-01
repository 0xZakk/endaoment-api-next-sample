'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { staticEndaomentURLs } from './utils';

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

  const supabase = await createClient()

  // Get the user's token from the request
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('endaoment_tokens')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching token data:", error);
  }

  const token = data[0];

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

  redirect('/dashboard/fund/' + fundCreationResponse.id);
}
