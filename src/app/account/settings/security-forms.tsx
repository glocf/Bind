
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, ShieldCheck, QrCode } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { enrollTwoFactorAuth, verifyTwoFactorAuth, disableTwoFactorAuth, updatePassword } from '../actions'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import type { Factor } from '@/lib/types'

const passwordSchema = z.object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecurityForms({ totpFactor }: { totpFactor: Factor | undefined }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [enrollmentData, setEnrollmentData] = useState<{ qr_code: string, factor_id: string } | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('newPassword', data.newPassword);
            const result = await updatePassword(formData);
            if (result?.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Your password has been updated." });
                passwordForm.reset();
            }
        });
    };

    const handleEnroll = async () => {
        setIsEnrolling(true);
        const result = await enrollTwoFactorAuth();
        if (result?.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else if (result?.data) {
            setEnrollmentData({
                qr_code: result.data.totp.qr_code,
                factor_id: result.data.id,
            });
        }
        setIsEnrolling(false);
    };

    const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsVerifying(true);
        const formData = new FormData(event.currentTarget);
        const result = await verifyTwoFactorAuth(formData);
        if (result?.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: '2FA has been enabled.' });
            setEnrollmentData(null);
        }
        setIsVerifying(false);
    };

    const handleDisable = async () => {
        if (!totpFactor) return;
        setIsDisabling(true);
        const result = await disableTwoFactorAuth(totpFactor.id);
        if (result?.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: '2FA has been disabled.' });
        }
        setIsDisabling(false);
    };

    return (
        <div className="space-y-10">
            {/* 2FA Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-start md:items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-primary mt-1 md:mt-0 shrink-0" />
                    <div>
                        <h3 className="font-semibold">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-muted-foreground">
                            {totpFactor
                                ? "2FA is currently enabled on your account."
                                : "Protect your account with an extra layer of security."
                            }
                        </p>
                    </div>
                </div>
                {totpFactor ? (
                     <Button 
                        onClick={handleDisable} 
                        disabled={isDisabling} 
                        variant="destructive"
                        className="mt-4 md:mt-0 shrink-0"
                    >
                        {isDisabling ? <Loader2 className="animate-spin" /> : 'Disable 2FA'}
                    </Button>
                ) : (
                    <Dialog open={!!enrollmentData} onOpenChange={(open) => !open && setEnrollmentData(null)}>
                        <DialogTrigger asChild>
                            <Button onClick={handleEnroll} disabled={isEnrolling} className="mt-4 md:mt-0 shrink-0">
                                {isEnrolling ? <Loader2 className="animate-spin" /> : 'Enable 2FA'}
                            </Button>
                        </DialogTrigger>
                        {enrollmentData && (
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                                    <DialogDescription>
                                        Scan the QR code with your authenticator app, then enter the verification code below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center p-4 my-4 bg-white rounded-md">
                                    <Image src={enrollmentData.qr_code} alt="2FA QR Code" width={200} height={200} />
                                </div>
                                <form onSubmit={handleVerify} className="space-y-4">
                                     <input type="hidden" name="factorId" value={enrollmentData.factor_id} />
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Verification Code</Label>
                                        <Input id="code" name="code" required placeholder="123456" />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isVerifying}>
                                        {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2"/>}
                                        Verify and Enable
                                    </Button>
                                </form>
                            </DialogContent>
                        )}
                    </Dialog>
                )}
            </div>

            <Separator />

            {/* Password Change Section */}
            <div>
                 <h3 className="font-semibold text-lg mb-2">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Choose a new password for your account. It must be at least 6 characters long.
                </p>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-sm">
                        <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
