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
        <CardTitle className="text-2xl">Password Reset</CardTitle>
        <CardDescription>
          <p className="mb-4">
            Your password has been successfully reset.
          </p>
          <div className="mt-4 text-center text-sm">
            <a href="/dashboard" className="underline underline-offset-4">
              Go to Home
            </a>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}


