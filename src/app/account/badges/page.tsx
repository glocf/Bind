
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge, CheckCircle2, ShieldCheck, Gem, Sparkles, User, Crown, Ghost } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// In a real app, this would likely come from a database or a config file
const allBadges = [
  { id: 'pioneer', name: 'Pioneer', description: 'One of the first 1,000 users to join Bind.', icon: <Crown className="h-6 w-6 text-amber-400" /> },
  { id: 'verified', name: 'Verified', description: 'This user has been verified as a notable individual.', icon: <ShieldCheck className="h-6 w-6 text-blue-500" /> },
  { id: 'supporter', name: 'Supporter', description: 'A user who supports Bind through a premium subscription.', icon: <Gem className="h-6 w-6 text-purple-500" /> },
  { id: 'creator', name: 'Content Creator', description: 'Has more than 5 links and 1,000 total views.', icon: <User className="h-6 w-6 text-green-500" /> },
  { id: 'ai-enthusiast', name: 'AI Enthusiast', description: 'Has used the AI background generation feature.', icon: <Sparkles className="h-6 w-6 text-pink-500" /> },
  { id: 'haunted', name: 'Haunted', description: 'Visited the site during the Halloween 2024 event.', icon: <Ghost className="h-6 w-6 text-gray-400" /> },
];

function BadgeCard({ badge, isUnlocked, isEquipped }: { badge: typeof allBadges[0], isUnlocked: boolean, isEquipped: boolean }) {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 bg-card">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{badge.icon}</TooltipTrigger>
                <TooltipContent>
                <p>{badge.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col">
          <label htmlFor={`badge-${badge.id}`} className={`font-medium ${isUnlocked ? 'text-card-foreground' : 'text-muted-foreground/50'}`}>
            {badge.name}
          </label>
          <p className={`text-sm ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{badge.description}</p>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger>
                <div className={!isUnlocked ? 'cursor-not-allowed' : ''}>
                    <Switch
                        id={`badge-${badge.id}`}
                        checked={isEquipped}
                        disabled={!isUnlocked}
                        aria-label={`Equip ${badge.name} badge`}
                    />
                </div>
            </TooltipTrigger>
            {!isUnlocked && (
                 <TooltipContent>
                    <p>You haven't unlocked this badge yet.</p>
                </TooltipContent>
            )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}


export default async function BadgesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('unlocked_badges, equipped_badges').single();

  // Mock logic for which badges are unlocked. In a real app, this would be determined by user actions.
  const unlockedBadges = new Set(profile?.unlocked_badges || ['pioneer', 'ai-enthusiast']);
  const equippedBadges = new Set(profile?.equipped_badges || ['pioneer']);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Badges</CardTitle>
          <CardDescription>
            Select which of your unlocked badges you'd like to display on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Your Unlocked Badges</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {allBadges.filter(b => unlockedBadges.has(b.id)).map(badge => (
                        <BadgeCard 
                            key={badge.id} 
                            badge={badge} 
                            isUnlocked={true} 
                            isEquipped={equippedBadges.has(b.id)} 
                        />
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Locked Badges</h3>
                 <div className="grid gap-4 md:grid-cols-2">
                    {allBadges.filter(b => !unlockedBadges.has(b.id)).map(badge => (
                        <BadgeCard 
                            key={badge.id} 
                            badge={badge} 
                            isUnlocked={false} 
                            isEquipped={false} 
                        />
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
