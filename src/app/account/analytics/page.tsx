
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, MousePointerClick, Goal } from 'lucide-react';
import { Suspense } from 'react';
import AnalyticsChart from './analytics-chart';
import TopLinks from './top-links';
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { subDays, format } from 'date-fns';

function MetricCard({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
    return <Skeleton className="h-[450px] w-full" />;
}

function LinksSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const today = new Date();
  const last7Days = subDays(today, 7);

  const { data: analyticsData, error: analyticsError } = await supabase
    .from('analytics')
    .select('event_type, created_at, link_id')
    .eq('user_id', user.id)
    .gte('created_at', last7Days.toISOString());

  if (analyticsError) {
    console.error("Error fetching analytics:", analyticsError);
  }

  const totalViews = analyticsData?.filter(e => e.event_type === 'profile_view').length || 0;
  const totalClicks = analyticsData?.filter(e => e.event_type === 'link_click').length || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;
  
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const dateString = format(date, 'yyyy-MM-dd');
    const views = analyticsData?.filter(e => e.event_type === 'profile_view' && format(new Date(e.created_at), 'yyyy-MM-dd') === dateString).length || 0;
    const clicks = analyticsData?.filter(e => e.event_type === 'link_click' && format(new Date(e.created_at), 'yyyy-MM-dd') === dateString).length || 0;
    return { date: dateString, views, clicks };
  });

  const { data: links } = await supabase
    .from('links')
    .select('id, title, url')
    .eq('user_id', user.id);

  const topLinksData = links?.map(link => {
    const clicks = analyticsData?.filter(e => e.event_type === 'link_click' && e.link_id === link.id).length || 0;
    return { ...link, clicks };
  }).sort((a, b) => b.clicks - a.clicks).slice(0, 5) || [];

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
                title="Total Views (Last 7 Days)" 
                value={totalViews.toLocaleString()} 
                icon={Eye}
                description="Total profile visits"
            />
            <MetricCard 
                title="Total Clicks (Last 7 Days)" 
                value={totalClicks.toLocaleString()} 
                icon={MousePointerClick}
                description="Total link clicks"
            />
            <MetricCard 
                title="Click-Through Rate (CTR)" 
                value={`${ctr}%`}
                icon={Goal}
                description="Clicks / Views"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Performance (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Suspense fallback={<ChartSkeleton />}>
                        <AnalyticsChart data={chartData} />
                    </Suspense>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top Links</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<LinksSkeleton />}>
                        <TopLinks data={topLinksData} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
