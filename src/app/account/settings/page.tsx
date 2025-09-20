
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SecurityForms } from "./security-forms";
import type { Factor, Profile } from '@/lib/types';
import { AccountForm } from "../account-form";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) {
    console.error('Error listing MFA factors:', error);
  }

  const totpFactor = data?.totp[0] as Factor | undefined;

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm user={user} profile={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your password and two-factor authentication settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <SecurityForms totpFactor={totpFactor} />
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all of your content. This action is not reversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground">Account deletion feature is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
