
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, FolderKanban, MousePointer2, Diamond, TriangleAlert, Star, MapPin, Settings, X, Social, Badge } from 'lucide-react';
import Image from 'next/image';


const CustomizationControl = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon?: React.ElementType }) => (
    <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground flex items-center">
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {label}
        </Label>
        {children}
    </div>
);

export default function CustomizePage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12 text-white">
        <div>
            <h2 className="text-xl font-bold mb-4">Assets Uploader</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/50 border-white/10 aspect-video flex flex-col">
                    <CardContent className="p-3 flex-grow flex flex-col">
                        <p className="font-semibold mb-2 text-sm">Background</p>
                        <div className="relative flex-grow rounded-md overflow-hidden bg-zinc-900 flex items-center justify-center">
                             <Image src="https://images.unsplash.com/photo-1582731518043-3c65c2a135e6?q=80&w=1932&auto=format&fit=crop" alt="Background Preview" layout="fill" objectFit="cover" />
                             <div className="absolute top-1 right-1 flex items-center gap-1">
                                <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">.MP4</span>
                                <Button variant="destructive" size="icon" className="h-6 w-6 bg-red-500/80 hover:bg-red-500">
                                    <X className="h-4 w-4" />
                                </Button>
                             </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 border-white/10 aspect-video flex flex-col items-center justify-center text-center p-4">
                    <p className="font-semibold mb-2">Audio</p>
                    <div className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                        <FolderKanban className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to open audio manager</span>
                    </div>
                </Card>
                 <Card className="bg-card/50 border-white/10 aspect-video flex flex-col items-center justify-center text-center p-4">
                    <p className="font-semibold mb-2">Profile Avatar</p>
                    <div className="w-full h-full border-2 border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to upload a file</span>
                    </div>
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
                    <Input className="bg-zinc-800 border-zinc-700" placeholder="Maybe we'll see each other in an..." />
                </CustomizationControl>
                
                <CustomizationControl label="Discord Presence">
                    <Select defaultValue="enabled">
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
                        <Slider defaultValue={[50]} max={100} step={1} />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>20%</span>
                            <span>50%</span>
                            <span>80%</span>
                        </div>
                    </div>
                </CustomizationControl>

                <CustomizationControl label="Profile Blur">
                    <div className="pt-2">
                        <Slider defaultValue={[40]} max={100} step={1} />
                         <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>20px</span>
                            <span>50px</span>
                            <span>80px</span>
                        </div>
                    </div>
                </CustomizationControl>

                <CustomizationControl label="Background Effects">
                    <Select defaultValue="rain">
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
                    <Input className="bg-zinc-800 border-zinc-700" placeholder="Afghanistan" />
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
