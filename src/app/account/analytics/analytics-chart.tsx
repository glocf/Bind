
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, Legend } from "recharts"

const chartData = [
  { date: "2024-07-15", views: 186, clicks: 80 },
  { date: "2024-07-16", views: 305, clicks: 200 },
  { date: "2024-07-17", views: 237, clicks: 120 },
  { date: "2024-07-18", views: 73, clicks: 190 },
  { date: "2024-07-19", views: 209, clicks: 130 },
  { date: "2024-07-20", views: 214, clicks: 140 },
  { date: "2024-07-21", views: 345, clicks: 210 },
]

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

export default function AnalyticsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <LineChart
            accessibilityLayer
            data={chartData}
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
