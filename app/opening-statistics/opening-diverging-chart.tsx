"use client";

import { useMemo } from "react";
import { OpeningStatDTO } from "../../lib/axios/backendApi";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  RenderableText,
  TooltipValueType,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  totalGames: {
    label: "Total Games",
    color: "#cc0000",
  },
  whiteWins: {
    label: "White Wins",
    color: "#eee",
  },
  blackWins: {
    label: "Black Wins",
    color: "#555",
  },
  draws: {
    label: "Draws",
    color: "#00cccc",
  },
} satisfies ChartConfig;

function formatPercent(val: RenderableText | TooltipValueType): string {
  return `${Math.abs(Number(val)).toFixed(1)}%`;
}

export default function OpeningDivergingBarChart({ statistics }: { statistics: OpeningStatDTO[] }) {
  const chartData = useMemo(() => {
    return statistics.map((row) => ({
      ...row,
      // Add new percentage fields directly to the object
      white_wins_pct: (row.white_wins / row.total_games) * 100,
      black_wins_pct: (row.black_wins / row.total_games) * -100,
      draws_pct: (row.draws / row.total_games) * 100,
    }));
  }, [statistics]);

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 20 }}
          responsive
          stackOffset="sign"
          barCategoryGap={1}
        >
          <CartesianGrid vertical={false} />

          <XAxis dataKey="year" tickMargin={10} />

          {/* Format the Y-Axis to strip the minus sign using Math.abs */}
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => Math.abs(value).toString()} />

          {/* A ReferenceLine draws a bold zero-line so the split is obvious */}
          <ReferenceLine y={0} stroke="#000" />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                // Strip the minus sign from the tooltip hover as well!
                formatter={(value, name, item, index) => {
                  return (
                    <div className="flex items-center gap-2 w-full">
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

          {/* Draw the positive bar */}
          <Bar name="White Wins" dataKey="white_wins_pct" stackId="a" fill="var(--color-whiteWins)" radius={[4, 4, 0, 0]} />
          {/* Draw the negative bar */}
          <Bar name="Black Wins" dataKey="black_wins_pct" stackId="a" fill="var(--color-blackWins)" radius={[4, 4, 0, 0]} />
          
          <Legend verticalAlign="top" align="right" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
