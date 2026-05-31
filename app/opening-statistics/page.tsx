"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import ecoCodes from "../games/eco_codes.json";
import { useQuery } from "@tanstack/react-query";
import { getOpeningStats } from "../../lib/axios/backendApi";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import OpeningStatsBarChart from "./opening-stats-bar-chart";
import OpeningStatsLineCharts from "./opening-stats-line-charts";
import OpeningDivergingBarChart from "./opening-diverging-chart";
import OpeningStackedBar from "./opening-stacked-bar";

export default function OpeningStatistics() {
  const [selectedEcoCode, setSelectedEcoCode] = useState<string>("");
  const [yearRange, setYearRange] = useState<number[]>([1950, 2009]);

  const ecoOptions = useMemo(() => [...ecoCodes].sort((a, b) => a.eco_code.localeCompare(b.eco_code)), []);

  const { data: openingsData, isLoading } = useQuery({
    queryKey: ["opening-stats", selectedEcoCode],
    queryFn: async () => {
      if (!selectedEcoCode) return null;
      const result = await getOpeningStats(selectedEcoCode);
      return result;
    },
    enabled: !!selectedEcoCode,
  });

//   const openingsData : any = data
//   const isLoading : any = false

  const availableYears = useMemo(() => {
    if (!openingsData?.statistics) return [1950, 2009];
    const years = openingsData.statistics.map((stat: any) => parseInt(stat.year));
    return [Math.min(...years), Math.max(...years)];
  }, [openingsData]);

  const filteredStatistics = useMemo(() => {
    if (!openingsData?.statistics) return [];
    return openingsData.statistics.filter((stat: any) => {
      const year = parseInt(stat.year);
      return year >= yearRange[0] && year <= yearRange[1];
    });
  }, [openingsData, yearRange]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Opening Statistics</CardTitle>
          <CardDescription>
            Analyze opening performance including usage over time and winning percentages for both sides
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Opening Selection */}
          <div className="space-y-2">
            <Label htmlFor="eco-code">Select Opening</Label>
            <Select value={selectedEcoCode} onValueChange={setSelectedEcoCode} disabled={isLoading}>
              <SelectTrigger id="eco-code">
                <SelectValue placeholder="Choose an opening to analyze" />
              </SelectTrigger>
              <SelectContent>
                {ecoOptions.map((option) => (
                  <SelectItem key={option.eco_code} value={option.eco_code}>
                    {option.eco_code} - {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Range Selection */}
          {openingsData && (
            <div className="space-y-2">
              <Label>Year Range: {yearRange[0]} - {yearRange[1]}</Label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                min={availableYears[0]}
                max={availableYears[1]}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {openingsData && (
            <div className="space-y-2">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">{openingsData.opening.eco_code}</h3>
                <p className="text-sm text-muted-foreground">{openingsData.opening.name}</p>
                <p className="text-sm text-muted-foreground">{openingsData.opening.moves}</p>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="Opening Line Stats">Opening Line Stats</TabsTrigger>
                  <TabsTrigger value="Opening Bar Stats">Opening Bar Stats</TabsTrigger>
                  <TabsTrigger value="Opening Diverging Bar">Opening Diverging Bar</TabsTrigger>
                  <TabsTrigger value="Opening Stacked Bar">Opening Stacked Bar</TabsTrigger>
                </TabsList>
                <TabsContent value="Opening Line Stats">
                  <OpeningStatsLineCharts statistics={filteredStatistics} />
                </TabsContent>
                <TabsContent value="Opening Bar Stats">
                <OpeningStatsBarChart statistics={filteredStatistics} />
                </TabsContent>
                <TabsContent value="Opening Diverging Bar">
                  <OpeningDivergingBarChart statistics={filteredStatistics}/>
                </TabsContent>
                <TabsContent value="Opening Stacked Bar">
                  <OpeningStackedBar statistics={filteredStatistics}/>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!selectedEcoCode && (
            <div className="text-center py-8 text-muted-foreground">Select an opening to view statistics</div>
          )}

          {isLoading && <div className="text-center py-8 text-muted-foreground">Loading statistics...</div>}
        </CardContent>
      </Card>
    </div>
  );
}




var data = {
    "opening": {
        "id": 479,
        "eco_code": "A67",
        "name": "Benoni, Taimanov Variation",
        "moves": "1 d4 Nf6 2 c4 c5 3 d5 e6 4 Nc3 exd5 5 cxd5 d6 6 e4 g6 7 f4 Bg7 8 Bb5+"
    },
    "statistics": [
        {
            "year": "1950",
            "total_games": 1,
            "white_wins": 0,
            "black_wins": 0,
            "draws": 1
        },
        {
            "year": "1955",
            "total_games": 1,
            "white_wins": 0,
            "black_wins": 1,
            "draws": 0
        },
        {
            "year": "1956",
            "total_games": 2,
            "white_wins": 1,
            "black_wins": 0,
            "draws": 1
        },
        {
            "year": "1957",
            "total_games": 7,
            "white_wins": 5,
            "black_wins": 1,
            "draws": 1
        },
        {
            "year": "1958",
            "total_games": 13,
            "white_wins": 6,
            "black_wins": 2,
            "draws": 5
        },
        {
            "year": "1959",
            "total_games": 19,
            "white_wins": 8,
            "black_wins": 5,
            "draws": 6
        },
        {
            "year": "1960",
            "total_games": 13,
            "white_wins": 9,
            "black_wins": 2,
            "draws": 2
        },
        {
            "year": "1961",
            "total_games": 3,
            "white_wins": 1,
            "black_wins": 0,
            "draws": 2
        },
        {
            "year": "1962",
            "total_games": 8,
            "white_wins": 2,
            "black_wins": 3,
            "draws": 3
        },
        {
            "year": "1963",
            "total_games": 7,
            "white_wins": 4,
            "black_wins": 1,
            "draws": 2
        },
        {
            "year": "1964",
            "total_games": 3,
            "white_wins": 1,
            "black_wins": 1,
            "draws": 1
        },
        {
            "year": "1965",
            "total_games": 5,
            "white_wins": 3,
            "black_wins": 1,
            "draws": 1
        },
        {
            "year": "1966",
            "total_games": 4,
            "white_wins": 2,
            "black_wins": 1,
            "draws": 1
        },
        {
            "year": "1967",
            "total_games": 5,
            "white_wins": 1,
            "black_wins": 2,
            "draws": 2
        },
        {
            "year": "1968",
            "total_games": 5,
            "white_wins": 3,
            "black_wins": 1,
            "draws": 1
        },
        {
            "year": "1969",
            "total_games": 10,
            "white_wins": 6,
            "black_wins": 1,
            "draws": 3
        },
        {
            "year": "1970",
            "total_games": 9,
            "white_wins": 4,
            "black_wins": 4,
            "draws": 1
        },
        {
            "year": "1971",
            "total_games": 17,
            "white_wins": 7,
            "black_wins": 10,
            "draws": 0
        },
        {
            "year": "1972",
            "total_games": 16,
            "white_wins": 7,
            "black_wins": 3,
            "draws": 6
        },
        {
            "year": "1973",
            "total_games": 21,
            "white_wins": 7,
            "black_wins": 5,
            "draws": 9
        },
        {
            "year": "1974",
            "total_games": 17,
            "white_wins": 8,
            "black_wins": 5,
            "draws": 4
        },
        {
            "year": "1975",
            "total_games": 20,
            "white_wins": 11,
            "black_wins": 4,
            "draws": 5
        },
        {
            "year": "1976",
            "total_games": 16,
            "white_wins": 6,
            "black_wins": 5,
            "draws": 5
        },
        {
            "year": "1977",
            "total_games": 13,
            "white_wins": 8,
            "black_wins": 2,
            "draws": 3
        },
        {
            "year": "1978",
            "total_games": 17,
            "white_wins": 11,
            "black_wins": 5,
            "draws": 1
        },
        {
            "year": "1979",
            "total_games": 32,
            "white_wins": 12,
            "black_wins": 8,
            "draws": 12
        },
        {
            "year": "1980",
            "total_games": 26,
            "white_wins": 16,
            "black_wins": 7,
            "draws": 3
        },
        {
            "year": "1981",
            "total_games": 38,
            "white_wins": 18,
            "black_wins": 13,
            "draws": 7
        },
        {
            "year": "1982",
            "total_games": 46,
            "white_wins": 24,
            "black_wins": 17,
            "draws": 5
        },
        {
            "year": "1983",
            "total_games": 41,
            "white_wins": 22,
            "black_wins": 12,
            "draws": 7
        },
        {
            "year": "1984",
            "total_games": 40,
            "white_wins": 23,
            "black_wins": 7,
            "draws": 10
        },
        {
            "year": "1985",
            "total_games": 47,
            "white_wins": 28,
            "black_wins": 11,
            "draws": 8
        },
        {
            "year": "1986",
            "total_games": 42,
            "white_wins": 22,
            "black_wins": 9,
            "draws": 11
        },
        {
            "year": "1987",
            "total_games": 46,
            "white_wins": 26,
            "black_wins": 14,
            "draws": 6
        },
        {
            "year": "1988",
            "total_games": 63,
            "white_wins": 31,
            "black_wins": 16,
            "draws": 16
        },
        {
            "year": "1989",
            "total_games": 84,
            "white_wins": 43,
            "black_wins": 25,
            "draws": 16
        },
        {
            "year": "1990",
            "total_games": 54,
            "white_wins": 24,
            "black_wins": 19,
            "draws": 11
        },
        {
            "year": "1991",
            "total_games": 67,
            "white_wins": 43,
            "black_wins": 15,
            "draws": 9
        },
        {
            "year": "1992",
            "total_games": 100,
            "white_wins": 51,
            "black_wins": 30,
            "draws": 19
        },
        {
            "year": "1993",
            "total_games": 103,
            "white_wins": 48,
            "black_wins": 32,
            "draws": 23
        },
        {
            "year": "1994",
            "total_games": 83,
            "white_wins": 49,
            "black_wins": 23,
            "draws": 11
        },
        {
            "year": "1995",
            "total_games": 102,
            "white_wins": 57,
            "black_wins": 19,
            "draws": 26
        },
        {
            "year": "1996",
            "total_games": 108,
            "white_wins": 53,
            "black_wins": 30,
            "draws": 25
        },
        {
            "year": "1997",
            "total_games": 124,
            "white_wins": 52,
            "black_wins": 45,
            "draws": 27
        },
        {
            "year": "1998",
            "total_games": 101,
            "white_wins": 51,
            "black_wins": 27,
            "draws": 23
        },
        {
            "year": "1999",
            "total_games": 116,
            "white_wins": 53,
            "black_wins": 35,
            "draws": 28
        },
        {
            "year": "2000",
            "total_games": 107,
            "white_wins": 40,
            "black_wins": 43,
            "draws": 24
        },
        {
            "year": "2001",
            "total_games": 110,
            "white_wins": 51,
            "black_wins": 39,
            "draws": 20
        },
        {
            "year": "2002",
            "total_games": 135,
            "white_wins": 56,
            "black_wins": 49,
            "draws": 30
        },
        {
            "year": "2003",
            "total_games": 150,
            "white_wins": 76,
            "black_wins": 45,
            "draws": 29
        },
        {
            "year": "2004",
            "total_games": 139,
            "white_wins": 64,
            "black_wins": 52,
            "draws": 23
        },
        {
            "year": "2005",
            "total_games": 129,
            "white_wins": 54,
            "black_wins": 39,
            "draws": 36
        },
        {
            "year": "2006",
            "total_games": 127,
            "white_wins": 54,
            "black_wins": 49,
            "draws": 24
        },
        {
            "year": "2007",
            "total_games": 164,
            "white_wins": 70,
            "black_wins": 60,
            "draws": 34
        },
        {
            "year": "2008",
            "total_games": 184,
            "white_wins": 77,
            "black_wins": 63,
            "draws": 44
        },
        {
            "year": "2009",
            "total_games": 97,
            "white_wins": 39,
            "black_wins": 41,
            "draws": 17
        }
    ]
}