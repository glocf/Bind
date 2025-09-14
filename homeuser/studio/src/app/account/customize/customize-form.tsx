'use client'

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ImageIcon, FolderKanban, MousePointer2, Diamond, TriangleAlert, Star, MapPin, Settings, X, Sparkles, Loader2, HelpCircle, Bot } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Profile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateCustomization, removeBackground, updateAvatar, updateBackground } from '../actions';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { type User } from '@supabase/supabase-js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { customizationAssistant } from '@/ai/flows/customization-assistant-flow';

const CustomizationControl = ({ label, children, icon: Icon, tooltip }: { label: string, children: React.ReactNode, icon?: React.ElementType, tooltip?: string }) => (
    <div className="space-y-2">
        <div className="flex items-center">
            <Label className="text-sm font-medium text-muted-foreground flex items-center">
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {label}
            </Label>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        {children}
    </div>
);

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
        <div className="relative">
            <Input 
                type="color" 
                className="absolute h-full w-10 p-1 bg-transparent border-none cursor-pointer"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Input 
                className="bg-zinc-800 border-zinc-700 pl-12" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};


export function CustomizeForm({ profile, user }: { profile: Profile, user: User }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isRemoving, setIsRemoving] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isBgUploading, setIsBgUploading] = React.useState(false);

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const backgroundInputRef = React.useRef<HTMLInputElement>(null);

    const [currentBio, setCurrentBio] = React.useState(profile.bio || '');

    const discordIdentity = user.identities?.find(i => i.provider === 'discord');

    const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
    const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
    const [isAssistantLoading, setIsAssistantLoading] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');

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

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim() || isAssistantLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: currentMessage };
        setChatMessages(prev => [...prev, newUserMessage]);
        setCurrentMessage('');
        setIsAssistantLoading(true);

        try {
            const profileContext = {
                username: profile.username,
                bio: profile.bio,
                accent_color: profile.accent_color,
            };
            const response = await customizationAssistant({ prompt: currentMessage, profile: profileContext });
            const assistantMessage: ChatMessage = { role: 'assistant', content: response };
            setChatMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Assistant error:", error);
            const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAssistantLoading(false);
        }
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
                <h2 className="text-xl font-bold mb-6">Color Customization</h2>
                <Card className="bg-card/50 border-white/10 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Accent Color" value={profile.accent_color || '#1b1b1b'} onChange={(v) => debouncedUpdate({ accent_color: v })} />
                            <ColorInput label="Text Color" value={profile.text_color || '#ffffff'} onChange={(v) => debouncedUpdate({ text_color: v })} />
                            <ColorInput label="Background Color" value={profile.background_color || '#080808'} onChange={(v) => debouncedUpdate({ background_color: v })} />
                            <ColorInput label="Icon Color" value={profile.icon_color || '#ffffff'} onChange={(v) => debouncedUpdate({ icon_color: v })} />
                        </div>
                        <div className="flex items-center justify-center">
                             <div className="flex items-center space-x-2">
                                <Switch id="profile-gradient" checked={profile.enable_profile_gradient || false} onCheckedChange={(v) => debouncedUpdate({ enable_profile_gradient: v })} />
                                <Label htmlFor="profile-gradient">Enable Profile Gradient</Label>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-6">Other Customization</h2>
                <Card className="bg-card/50 border-white/10 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                             <Label htmlFor="monochrome-icons" className="flex items-center text-sm font-medium">Monochrome Icons <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground" /></Label>
                             <Switch id="monochrome-icons" checked={profile.monochrome_icons || false} onCheckedChange={(v) => debouncedUpdate({ monochrome_icons: v })} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                             <Label htmlFor="animated-title" className="text-sm font-medium">Animated Title</Label>
                             <Switch id="animated-title" checked={profile.animated_title || false} onCheckedChange={(v) => debouncedUpdate({ animated_title: v })}/>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                             <Label htmlFor="swap-box-colors" className="flex items-center text-sm font-medium">Swap Box Colors <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground" /></Label>
                             <Switch id="swap-box-colors" checked={profile.swap_box_colors || false} onCheckedChange={(v) => debouncedUpdate({ swap_box_colors: v })}/>
                        </div>
                         <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                             <Label htmlFor="volume-control" className="text-sm font-medium">Volume Control</Label>
                             <Switch id="volume-control" disabled checked={profile.volume_control || false} onCheckedChange={(v) => debouncedUpdate({ volume_control: v })}/>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center justify-between w-full">
                                            <Label htmlFor="use-discord-avatar" className="text-sm font-medium">Use Discord Avatar</Label>
                                            <Switch id="use-discord-avatar" checked={profile.use_discord_avatar || false} onCheckedChange={(v) => debouncedUpdate({ use_discord_avatar: v })} disabled={!discordIdentity}/>
                                        </div>
                                    </TooltipTrigger>
                                    {!discordIdentity && <TooltipContent><p>You need to connect your Discord account first.</p></TooltipContent>}
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50">
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center justify-between w-full">
                                            <Label htmlFor="discord-avatar-decoration" className="text-sm font-medium">Discord Avatar Decoration</Label>
                                            <Switch id="discord-avatar-decoration" checked={profile.discord_avatar_decoration || false} onCheckedChange={(v) => debouncedUpdate({ discord_avatar_decoration: v })} disabled={!discordIdentity}/>
                                        </div>
                                    </TooltipTrigger>
                                    {!discordIdentity && <TooltipContent><p>You need to connect your Discord account first.</p></TooltipContent>}
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </Card>
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

            <Button
                onClick={() => setIsAssistantOpen(true)}
                className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-transform hover:scale-110"
            >
                <Sparkles className="h-8 w-8" />
                <span className="sr-only">Open AI Assistant</span>
            </Button>

            <Sheet open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Customization Assistant</SheetTitle>
                        <SheetDescription>
                            Get ideas and suggestions for your profile from our AI assistant.
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-grow my-4 pr-4">
                        <div className="space-y-4">
                            {chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 text-sm ${
                                        message.role === 'user' ? 'justify-end' : ''
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <Avatar className="w-8 h-8">
                                            <AvatarContent>
                                                <Bot />
                                            </AvatarContent>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isAssistantLoading && (
                                <div className="flex gap-3 text-sm">
                                     <Avatar className="w-8 h-8">
                                        <AvatarContent>
                                            <Bot />
                                        </AvatarContent>
                                    </Avatar>
                                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <SheetFooter>
                        <form onSubmit={handleChatSubmit} className="flex w-full space-x-2">
                            <Input
                                value={currentMessage}
                                onChange={e => setCurrentMessage(e.target.value)}
                                placeholder="Ask for customization ideas..."
                                disabled={isAssistantLoading}
                            />
                            <Button type="submit" disabled={isAssistantLoading}>
                                {isAssistantLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                            </Button>
                        </form>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

        </div>
    );
}

// Dummy component, replace with actual Avatar content if available
const AvatarContent = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center h-full w-full bg-muted rounded-full">
        {children}
    </div>
);
