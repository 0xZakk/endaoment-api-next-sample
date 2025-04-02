'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";
import { createClient } from '@/utils/supabase/server'
import { createWireDonation } from '@/utils/endaoment/server';
import { v4 as uuidv4 } from 'uuid';

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: validate inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log('login error', error)
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // TODO: validate inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient()
  const origin = (await headers()).get("origin");

  if (!email) {
    // TODO: come back and implement encodedRedirect()
    console.error('forgotPassword error: email is required')
    redirect('/error')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/auth/reset-password`,
  });

  if (error) {
    console.error(error.message)
    return redirect('/error')
  }

  return redirect('/auth/forgot-password/check-email')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password-confirm') as string

  if (!password || !passwordConfirm) {
    console.log('resetPassword error: password and passwordConfirm are required')
    redirect('/error')
  }

  if (password !== passwordConfirm) {
    console.log('resetPassword error: passwords do not match')
    redirect('/error')
  }

  const { error } = await supabase.auth.updateUser({
    password
  })

  if (error) {
    console.log('resetPassword error', error)
    redirect('/error')
  }

  return redirect('/auth/reset-password/success')
}

export async function wireDonation(formData: FormData) {
  const amount = formData.get('amount') as string;
  const fundId = formData.get('fundId') as string;

  if (!amount || !fundId) {
    throw new Error('Amount and fund ID are required');
  }

  // Convert amount to microdollars (1 USD = 1,000,000 microdollars)
  const pledgedAmountMicroDollars = (BigInt(Math.round(parseFloat(amount) * 1000000))).toString();

  const { data, error } = await createWireDonation({
    pledgedAmountMicroDollars,
    receivingFundId: fundId,
    idempotencyKey: uuidv4(),
  });

  if (error) {
    console.error('Wire donation error:', error);
    throw error;
  }

  return redirect(`/dashboard/fund/${fundId}`);
}

