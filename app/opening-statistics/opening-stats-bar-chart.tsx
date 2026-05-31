"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts";
import { OpeningStatDTO } from "../../lib/axios/backendApi";

const chartConfig = {
  totalGames: {
    label: "Total Games",
    color: "#cc0000",
  },
  whiteWins: {
    label: "White Wins",
    color: "#eab308",
  },
  blackWins: {
    label: "Black Wins",
    color: "#312e81",
  },
  draws: {
    label: "Draws",
    color: "#10b981",
  },
} satisfies ChartConfig;

// const chartConfig = {
//   white_wins: {
//     label: "White Wins",
//     color: "#aabb99",
//   },
//   black_wins: {
//     label: "Black Wins",
//     color: "#cc9988",
//   },
//   draws: {
//     label: "Draws",
//     color: "#881211",
//   },
// } satisfies ChartConfig;

export default function OpeningStatsBarChart({ statistics }: { statistics: OpeningStatDTO[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-50 w-full">
      {/* 4. The standard Recharts BarChart component */}
      <BarChart accessibilityLayer data={statistics} barGap={0}>
        <CartesianGrid vertical={false} />

        {/* X-Axis mapping to your 'year' string */}
        <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />

        {/* shadcn beautiful tooltips and legends */}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend />

        {/* The actual bars. Grouped side-by-side automatically */}
        {/* To stack them instead, add `stackId="a"` to each Bar */}
        <Bar name="White Wins" dataKey="white_wins" fill="var(--color-whiteWins)" radius={[2, 2, 0, 0]} />
        <Bar name="Black Wins" dataKey="black_wins" fill="var(--color-blackWins)" radius={[2, 2, 0, 0]} />
        <Bar name="Draws" dataKey="draws" fill="var(--color-draws)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
