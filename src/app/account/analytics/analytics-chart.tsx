
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, Legend } from "recharts"

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
}

export default function AnalyticsChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <LineChart
            accessibilityLayer
            data={data}
            margin={{
            left: 12,
            right: 12,
            }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Line
                dataKey="views"
                type="natural"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={{
                    fill: "var(--color-views)",
                }}
                activeDot={{
                    r: 6,
                }}
            />
            <Line
                dataKey="clicks"
                type="natural"
                stroke="var(--color-clicks)"
                strokeWidth={2}
                dot={{
                    fill: "var(--color-clicks)",
                }}
                activeDot={{
                    r: 6,
                }}
            />
        </LineChart>
    </ChartContainer>
  )
}
