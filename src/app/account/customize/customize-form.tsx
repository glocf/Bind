
'use client'

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ImageIcon, FolderKanban, MousePointer2, Diamond, TriangleAlert, Star, MapPin, Settings, X, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Profile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateCustomization, removeBackground, updateAvatar, updateBackground } from '../actions';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';

const CustomizationControl = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon?: React.ElementType }) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground flex items-center">
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {label}
        </Label>
        {children}
    </div>
);

export function CustomizeForm({ profile }: { profile: Profile }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isRemoving, setIsRemoving] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isBgUploading, setIsBgUploading] = React.useState(false);

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const backgroundInputRef = React.useRef<HTMLInputElement>(null);

    const [currentBio, setCurrentBio] = React.useState(profile.bio || '');

    const debouncedUpdate = useDebouncedCallback(async (data: Partial<Profile>) => {
        const result = await updateCustomization(data);
        if (result?.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Saved!", description: "Your customization has been saved." });
            router.refresh();
        }
    }, 1000);

    const handleRemoveBackground = async () => {
        setIsRemoving(true);
        const result = await removeBackground();
        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Background Removed" });
            router.refresh();
        }
        setIsRemoving(false);
    }
    
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        const result = await updateAvatar(formData);

        if (result.error) {
            toast({ title: "Error uploading avatar", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Avatar updated successfully!" });
            router.refresh();
        }
        setIsUploading(false);
    };

    const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsBgUploading(true);
        const formData = new FormData();
        formData.append('background', file);

        const result = await updateBackground(formData);

        if (result.error) {
            toast({ title: "Error uploading background", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Background updated successfully!" });
            router.refresh();
        }
        setIsBgUploading(false);
    };
    
    return (
        <div className="container mx-auto py-12 px-4 space-y-12 text-white">
            <div>
                <h2 className="text-xl font-bold mb-4">Assets Uploader</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-card/50 border-white/10 aspect-video flex flex-col">
                        <CardContent className="p-3 flex-grow flex flex-col">
                            <p className="font-semibold mb-2 text-sm">Background</p>
                            <div 
                                className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer relative"
                                onClick={() => backgroundInputRef.current?.click()}
                            >
                                {isBgUploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : profile.background_image_url ? (
                                    <>
                                        <Image src={profile.background_image_url} alt="Background Preview" layout="fill" objectFit="cover" className="rounded-md"/>
                                        <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                className="h-6 w-6 bg-red-500/80 hover:bg-red-500"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveBackground(); }}
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? <Loader2 className="h-3 w-3 animate-spin"/> : <X className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-sm">Click to upload a file</span>
                                    </>
                                )}
                            </div>
                             <input 
                                type="file" 
                                ref={backgroundInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                onChange={handleBackgroundUpload}
                                disabled={isBgUploading}
                            />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-white/10 aspect-video flex flex-col items-center justify-center text-center p-4">
                        <p className="font-semibold mb-2">Audio</p>
                        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                            <FolderKanban className="h-8 w-8 mb-2" />
                            <span className="text-sm">Click to open audio manager</span>
                        </div>
                    </Card>
                    <Card className="bg-card/50 border-white/10 aspect-video flex flex-col">
                         <CardContent className="p-3 flex-grow flex flex-col">
                            <p className="font-semibold mb-2 text-sm">Profile Avatar</p>
                             <div 
                                className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer relative"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt="Avatar Preview" layout="fill" objectFit="cover" className="rounded-md"/>
                                ) : (
                                    <>
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-sm">Click to upload a file</span>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={avatarInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                            />
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-white/10 aspect-video flex flex-col items-center justify-center text-center p-4">
                        <p className="font-semibold mb-2">Custom Cursor</p>
                        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                            <MousePointer2 className="h-8 w-8 mb-2" />
                            <span className="text-sm">Click to upload a file</span>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/30 to-purple-500/30 flex items-center justify-center text-center">
                <Diamond className="h-5 w-5 mr-3 text-primary" />
                <p className="font-semibold">Want exclusive features? Unlock more with <span className="text-primary font-bold">Premium</span></p>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-6">General Customization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">

                    <CustomizationControl label="Description" icon={TriangleAlert}>
                        <Input 
                            className="bg-zinc-800 border-zinc-700" 
                            placeholder="Maybe we'll see each other in an..." 
                            defaultValue={currentBio}
                            onChange={(e) => {
                                setCurrentBio(e.target.value);
                                debouncedUpdate({ bio: e.target.value });
                            }}
                        />
                    </CustomizationControl>
                    
                    <CustomizationControl label="Discord Presence">
                        <Select 
                            defaultValue={profile.discord_presence || 'enabled'}
                            onValueChange={(value) => debouncedUpdate({ discord_presence: value })}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="enabled">Enabled</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </CustomizationControl>

                    <CustomizationControl label="Profile Opacity">
                        <div className="pt-2">
                            <Slider 
                                defaultValue={[profile.profile_opacity || 80]} 
                                max={100} 
                                step={1}
                                onValueChange={(value) => debouncedUpdate({ profile_opacity: value[0] })}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>20%</span>
                                <span>50%</span>
                                <span>80%</span>
                            </div>
                        </div>
                    </CustomizationControl>

                    <CustomizationControl label="Profile Blur">
                        <div className="pt-2">
                            <Slider 
                                defaultValue={[profile.profile_blur || 10]} 
                                max={80} 
                                step={1} 
                                onValueChange={(value) => debouncedUpdate({ profile_blur: value[0] })}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>20px</span>
                                <span>50px</span>
                                <span>80px</span>
                            </div>
                        </div>
                    </CustomizationControl>

                    <CustomizationControl label="Background Effects">
                        <Select 
                            defaultValue={profile.background_effects || 'none'}
                            onValueChange={(value) => debouncedUpdate({ background_effects: value })}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rain">Rain</SelectItem>
                                <SelectItem value="snow">Snow</SelectItem>
                                <SelectItem value="stars">Stars</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </CustomizationControl>

                    <CustomizationControl label="Username Effects">
                        <Button className="w-full justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            Choose Username Effects
                        </Button>
                    </CustomizationControl>
                    
                    <CustomizationControl label="Location" icon={MapPin}>
                        <Input 
                            className="bg-zinc-800 border-zinc-700" 
                            placeholder="Afghanistan" 
                            defaultValue={profile.location || ''}
                            onChange={(e) => debouncedUpdate({ location: e.target.value })}
                        />
                    </CustomizationControl>
                    
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center">
                        Glow Settings
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <Settings className="h-3 w-3 ml-1.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Manage glow effects for different elements.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        </Label>
                        <div className="flex items-center gap-2 pt-1">
                            <Button variant="secondary" className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 flex-1">
                            Username
                            </Button>
                            <Button variant="secondary" className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 flex-1">
                            Socials
                            </Button>
                        </div>
                        <Button variant="secondary" className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30">
                        Badges
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
