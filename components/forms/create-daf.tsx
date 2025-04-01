import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateDafFormProps extends React.ComponentPropsWithoutRef<"div"> {
  action: (formData: FormData) => Promise<void>
}

export function CreateDafForm({
  className,
  action,
  ...props
}: CreateDafFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a new DAF</CardTitle>
          <CardDescription>
            Enter your email below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">

              <hr />
              <div className="grid gap-2">
                <h2>Fund</h2>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Fund Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  type="text"
                  placeholder="Fund Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Fund Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Fund Description"
                  className="resize-none"
                  required
                />
              </div>

              <hr />
              <div className="grid gap-2">
                <h2>Fund Advisor</h2>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.firstName">First Name</Label>
                <Input 
                  id="fundAdvisor.firstName" 
                  name="fundAdvisor.firstName"
                  type="text"
                  placeholder="Advisor First Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.lastName">Last Name</Label>
                <Input 
                  id="fundAdvisor.lastName" 
                  name="fundAdvisor.lastName"
                  type="text"
                  placeholder="Advisor Last Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.email">Email</Label>
                <Input 
                  id="fundAdvisor.email" 
                  name="fundAdvisor.email"
                  type="email"
                  placeholder="Advisor Email"
                  required
                />
              </div>

              <hr />
              <div className="grid gap-2">
                <h2>Fund Advisor Address </h2>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.line1">Advisor Address Line 1</Label>
                <Input 
                  id="fundAdvisor.address.line1" 
                  name="fundAdvisor.address.line1"
                  type="text"
                  placeholder="Address Line 1"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.line2">Advisor Address Line 2</Label>
                <Input 
                  id="fundAdvisor.address.line2" 
                  name="fundAdvisor.address.line2"
                  type="text"
                  placeholder="Address Line 2"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.city">City</Label>
                <Input 
                  id="fundAdvisor.address.city" 
                  name="fundAdvisor.address.city"
                  type="text"
                  placeholder="Advisor city"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.state">State</Label>
                <Input 
                  id="fundAdvisor.address.state" 
                  name="fundAdvisor.address.state"
                  type="text"
                  placeholder="Advisor state"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.zip">Zip</Label>
                <Input 
                  id="fundAdvisor.address.zip" 
                  name="fundAdvisor.address.zip"
                  type="text"
                  placeholder="Advisor Zip"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.address.country">Country</Label>
                <Input 
                  id="fundAdvisor.address.country" 
                  name="fundAdvisor.address.country"
                  type="text"
                  placeholder="Advisor Country"
                  required
                />
              </div>

              <Button type="submit" className="w-full" formAction={action}>
                Create Fund
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
};
