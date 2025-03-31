import { SignupForm } from '@/components/forms/signup'
import { signup } from '@/app/actions'

export default function SignupPage() {
  return (
    <SignupForm signupActions={signup} />
  )
}
