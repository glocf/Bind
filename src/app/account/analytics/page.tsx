
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, MousePointerClick, Goal } from 'lucide-react';
import { Suspense } from 'react';
import AnalyticsChart from './analytics-chart';
import TopLinks from './top-links';
import { Skeleton } from "@/components/ui/skeleton";

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

export default function AnalyticsPage() {
  // Placeholder data
  const totalViews = 12345;
  const totalClicks = 2890;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
                title="Total Views" 
                value={totalViews.toLocaleString()} 
                icon={Eye}
                description="+20.1% from last month"
            />
            <MetricCard 
                title="Total Clicks" 
                value={totalClicks.toLocaleString()} 
                icon={MousePointerClick}
                description="+180.1% from last month"
            />
            <MetricCard 
                title="Click-Through Rate (CTR)" 
                value={`${ctr}%`}
                icon={Goal}
                description="+19% from last month"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Suspense fallback={<ChartSkeleton />}>
                        <AnalyticsChart />
                    </Suspense>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top Links</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<LinksSkeleton />}>
                        <TopLinks />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
