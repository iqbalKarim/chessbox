"use client";

import { OpeningStatDTO } from "@/lib/axios/backendApi";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useMemo } from "react";


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
//   totalGames: {
//     label: "Total Games",
//     color: "#cc0000",
//   },
//   whiteWins: {
//     label: "White Wins",
//     color: "#00cc00",
//   },
//   blackWins: {
//     label: "Black Wins",
//     color: "#0000cc",
//   },
//   draws: {
//     label: "Draws",
//     color: "#00cccc",
//   },
// } satisfies ChartConfig;

export default function OpeningStatsLineCharts({ statistics }: { statistics: OpeningStatDTO[] }) {
  const chartData = useMemo(() => {
    return statistics.map((row) => ({
      ...row,
      // Add new percentage fields directly to the object
      white_wins_pct: row.total_games ? (row.white_wins / row.total_games) * 100 : 0,
      black_wins_pct: row.total_games ? (row.black_wins / row.total_games) * 100 : 0,
      draws_pct: row.total_games ? (row.draws / row.total_games) * 100 : 0,
    }));
  }, [statistics]);

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />

          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <ChartLegend />
          
          <Line dataKey="total_games" type="natural" stroke="var(--color-totalGames)" strokeWidth={2} dot={false} />
          <Line dataKey="white_wins" type="natural" stroke="var(--color-whiteWins)" strokeWidth={2} dot={false} />
          <Line dataKey="black_wins" type="natural" stroke="var(--color-blackWins)" strokeWidth={2} dot={false} />
          <Line dataKey="draws" type="natural" stroke="var(--color-draws)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
