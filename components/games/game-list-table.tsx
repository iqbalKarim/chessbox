/**
 * Games list table component
 */

"use client";

import { Game } from "@/lib/types/game";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface GameListTableProps {
  games: Game[];
  isLoading?: boolean;
  onGameClick?: (game: Game) => void;
}

function getResultColor(result: string): "default" | "secondary" | "destructive" | "outline" {
  switch (result) {
    case "1-0":
      return "default"; // White win
    case "0-1":
      return "destructive"; // Black win
    case "1/2-1/2":
      return "secondary"; // Draw
    default:
      return "outline";
  }
}

function formatDate(dateString: string): string {
  try {
    // Try to parse ISO date format
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}

function getResultLabel(result: string): string {
  switch (result) {
    case "1-0":
      return "White Win";
    case "0-1":
      return "Black Win";
    case "1/2-1/2":
      return "Draw";
    default:
      return result;
  }
}

export function GameListTable({
  games,
  isLoading = false,
  onGameClick,
}: GameListTableProps) {
  if (games.length === 0 && !isLoading) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-500">No games found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="min-w-max">White Player</TableHead>
              <TableHead className="min-w-max">Black Player</TableHead>
              <TableHead className="w-24">Result</TableHead>
              <TableHead className="min-w-max">Opening</TableHead>
              <TableHead className="min-w-max">Event</TableHead>
              <TableHead className="w-20 text-right">Moves</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow
                key={game.id}
                onClick={() => onGameClick?.(game)}
                className={onGameClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                <TableCell className="font-medium">
                  {formatDate(game.date)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {game.white_player.first_name} {game.white_player.surname}
                  </div>
                  {game.white_player.rating && (
                    <div className="text-sm text-gray-500">
                      {game.white_player.rating}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {game.black_player.first_name} {game.black_player.surname}
                  </div>
                  {game.black_player.rating && (
                    <div className="text-sm text-gray-500">
                      {game.black_player.rating}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getResultColor(game.result)}>
                    {getResultLabel(game.result)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {game.opening ? (
                    <>
                      <div className="font-medium">{game.opening.eco_code}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {game.opening.name}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">No opening data</span>
                  )}
                </TableCell>
                <TableCell className="text-sm truncate">
                  {game.event.name}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {game.ply_count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
