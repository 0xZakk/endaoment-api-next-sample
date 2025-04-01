import { createClient } from '@/utils/supabase/server'
import { staticEndaomentURLs } from '../endaoment/constants';

export type EndaomentUser = {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export async function getUserToken() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      data: null,
      error: userError,
    }
  }

  const { data: tokenData, error: tokenError } = await supabase
    .from('endaoment_tokens')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (tokenError || !tokenData) {
    return {
      data: null,
      error: tokenError,
    }
  }

  return {
    data: tokenData,
    error: null,
  }
}