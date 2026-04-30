"use client";

import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table";
import GameDetail from "@/lib/types/gameDetail";
import { format, parse } from 'date-fns';

function formatDate(dateString: string): string {
  try {
    // Try to parse ISO date format
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}


export function formatFuzzyDate(dateString: string): string {
  // Split the string into [year, month, day]
  const [year, month, day] = dateString.split('.');

  // Scenario 1: Only the year is known (e.g., "2010.??.??")
  if (month === '??') {
    return year; // Output: "2010"
  }

  // Scenario 2: Year and month are known (e.g., "2010.03.??")
  if (day === '??') {
    // We create a valid date object using just the year and month
    const date = parse(`${year}-${month}`, 'yyyy-MM', new Date());
    // Format to "March, 2010"
    return format(date, 'MMMM, yyyy'); 
  }

  // Scenario 3: Full date is known (e.g., "2012.09.04")
  const date = parse(dateString, 'yyyy.MM.dd', new Date());
  // Format to "Sep 04, 2012"
  return format(date, 'MMM dd, yyyy'); 
}

export const columns: ColumnDef<GameDetail>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell:({getValue}) => <b>{formatFuzzyDate(getValue() as string)}</b>,
  },
  {
    accessorKey: "white_player.first_name",
    header: "White Player",
    cell: ({getValue}) => <b>{getValue() as string}</b>
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({getValue}) => {
        let value: string = getValue() as string
        var type: "destructive" | "secondary" | "outline" | "default"
        if (value == '1/2-1/2') type = 'destructive'
        else if (value == '1-0') type = 'default'
        else if (value == '0-1') type = 'secondary'
        else type = 'outline'
        return <Badge variant={type}><b>{value}</b></Badge>
    }
  },
  {
    accessorKey: "black_player.first_name",
    header: "Black Player",
    cell: ({getValue}) => <b>{getValue() as string}</b>
  },
  {
    accessorKey: "opening",
    header: "Black Player",
    cell: ({getValue}) => {
      let opening: {name: string, eco_code: string} = getValue() as any || null
      if (opening){

        return (
          <div>
            <Badge variant="default" className="bg-blue-500 mr-2">
              <b>{opening.eco_code}</b>
            </Badge>
            <b>{opening.name}</b>
            {/* <br /> */}
          </div>
        );
      }
      else{
        return <b className="text-neutral-300">No opening data</b>
      }
    }
  },
];
