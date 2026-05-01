"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import GameDetail from "@/lib/types/gameDetail";
import { format, parse } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import eco_codes from "./eco_codes.json";

// Pre-sort eco_codes once at module load time
const sortedEcoCodes = [...eco_codes].sort((a, b) =>
  a.eco_code.localeCompare(b.eco_code)
);

export function formatFuzzyDate(dateString: string): string {
  // Split the string into [year, month, day]
  const [year, month, day] = dateString.split(".");

  // Scenario 1: Only the year is known (e.g., "2010.??.??")
  if (month === "??") {
    return year; // Output: "2010"
  }

  // Scenario 2: Year and month are known (e.g., "2010.03.??")
  if (day === "??") {
    // We create a valid date object using just the year and month
    const date = parse(`${year}-${month}`, "yyyy-MM", new Date());
    // Format to "March, 2010"
    return format(date, "MMMM, yyyy");
  }

  // Scenario 3: Full date is known (e.g., "2012.09.04")
  const date = parse(dateString, "yyyy.MM.dd", new Date());
  // Format to "Sep 04, 2012"
  return format(date, "MMM dd, yyyy");
}


export const columns: ColumnDef<GameDetail>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => <b>{formatFuzzyDate(getValue() as string)}</b>,
  },
  {
    accessorKey: "white_player.first_name",
    header: "White Player",
    cell: ({ getValue }) => <b>{getValue() as string}</b>,
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ getValue }) => {
      let value: string = getValue() as string;
      var type: "destructive" | "secondary" | "outline" | "default";
      if (value == "1/2-1/2") type = "destructive";
      else if (value == "1-0") type = "default";
      else if (value == "0-1") type = "secondary";
      else type = "outline";
      return (
        <Badge variant={type}>
          <b>{value}</b>
        </Badge>
      );
    },
  },
  {
    accessorKey: "black_player.first_name",
    header: "Black Player",
    cell: ({ getValue }) => <b>{getValue() as string}</b>,
  },
  {
    accessorKey: "opening",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="inline-block flex-1">Opening</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open filter menu</span>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="h-100">
              <DropdownMenuLabel>Filter by ECO Code</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {sortedEcoCodes.map((opening) => {
                return (
                  <DropdownMenuItem key={opening.eco_code} onClick={() => column.setFilterValue(opening.eco_code)}>
                    {opening.eco_code}
                    <br />
                    <span className="text-neutral-500 text-xs">{opening.name}</span>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ getValue }) => {
      let opening: { name: string; eco_code: string } = (getValue() as any) || null;
      if (opening) {
        return (
          <div>
            <Badge variant="default" className="bg-blue-500 mr-2">
              <b>{opening.eco_code}</b>
            </Badge>
            <b>{opening.name}</b>
            {/* <br /> */}
          </div>
        );
      } else {
        return <b className="text-neutral-300">No opening data</b>;
      }
    },
  },
];
