"use client";
import { useMemo } from "react";
import { OpeningStatDTO } from "../../lib/axios/backendApi";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, Brush, ReferenceLine, ComposedChart, Line, XAxis, YAxis } from "recharts";

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

export default function OpeningStackedBar({ statistics }: { statistics: OpeningStatDTO[] }) {
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
    <ChartContainer config={chartConfig} className="min-h-75 w-full">
      <BarChart accessibilityLayer data={chartData} barCategoryGap={-0}>
        <CartesianGrid vertical={false} />

        <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={10} domain={[2009]} />
        <YAxis tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              // Strip the minus sign from the tooltip hover as well!
              formatter={(value, name, item, index) => {
                return (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">
                      {typeof name === "string" ? chartConfig[name as keyof typeof chartConfig]?.label || name : name}
                    </span>
                    <span className="font-medium text-right flex-1">{Math.abs(Number(value)).toFixed(2)}%</span>
                  </div>
                );
              }}
            />
          }
        />

        <ChartLegend />

        {/* Adding stackId="a" (can be any string) to all of them 
          tells Recharts to stack them on top of each other.
          The order here determines bottom-to-top stacking! 
        */}
        <Bar name="White Wins" dataKey="white_wins_pct" stackId="a" fill="var(--color-whiteWins)" />
        <Bar name="Draws " dataKey="draws_pct" stackId="a" fill="var(--color-draws)" />
        <Bar name="Black Wins" dataKey="black_wins_pct" stackId="a" fill="var(--color-blackWins)" />

        <Brush 
            dataKey="year" 
            height={30} 
            // stroke="hsl(var(--muted-foreground))" 
            // fill="hsl(var(--background))"
            tickFormatter={(value) => value} // Keeps the text nice and clean
        />
      </BarChart>
    </ChartContainer>
  );
}
