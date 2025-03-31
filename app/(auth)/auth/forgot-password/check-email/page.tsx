import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Email Sent</CardTitle>
        <CardDescription>
          An email to reset your password was sent to the address you provided. Please check your inbox and follow the instructions in the email to reset your password.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}


