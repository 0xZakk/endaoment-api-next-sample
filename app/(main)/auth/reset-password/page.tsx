import { resetPassword } from "@/app/actions";
import { ResetPasswordForm } from "@/components/forms/reset-password";

export default async function ResetPasswordPage() {
  return (
    <ResetPasswordForm action={resetPassword} />
  );
}
