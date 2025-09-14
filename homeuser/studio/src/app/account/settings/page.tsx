
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Enhance your account's security by enabling two-factor authentication. This will be required for developers/administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card/50">
            <div className="flex items-start md:items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary mt-1 md:mt-0" />
              <div>
                <h3 className="font-semibold">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-muted-foreground">
                  Protect your account with an extra layer of security.
                </p>
              </div>
            </div>
            <Button disabled className="mt-4 md:mt-0 shrink-0">Enable 2FA</Button>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end">
            <p className="text-sm text-muted-foreground">
                2FA feature is coming soon.
            </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all of your content. This action is not reversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Button variant="destructive" disabled>Delete Account</Button>
        </CardContent>
        <CardFooter className="flex justify-end">
            <p className="text-sm text-muted-foreground">
                Account deletion feature is coming soon.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
