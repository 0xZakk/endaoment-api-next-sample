import { LoginForm } from "@/components/forms/login"
import { login } from '@/app/actions'

export default function LoginPage() {
  return (
    <LoginForm logInAction={login} />
  )
}
