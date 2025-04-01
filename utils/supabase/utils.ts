import { createClient } from '@/utils/supabase/server'

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
