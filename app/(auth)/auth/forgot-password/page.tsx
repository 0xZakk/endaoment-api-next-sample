import { forgotPassword } from "@/app/actions";
import { ForgotPasswordForm } from "@/components/forms/forgot-password";

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordForm action={forgotPassword} />
  )
}
