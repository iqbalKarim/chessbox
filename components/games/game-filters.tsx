/**
 * Game filters component for searching and filtering games
 */

"use client";

import { useState } from "react";
import { GameFilters } from "@/lib/types/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GameFiltersProps {
  onApplyFilters: (filters: GameFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function GameFilterPanel({
  onApplyFilters,
  onClearFilters,
  isLoading = false,
}: GameFiltersProps) {
  const [playerName, setPlayerName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [result, setResult] = useState<"" | "1-0" | "0-1" | "1/2-1/2">("");
  const [opening, setOpening] = useState("");
  const [event, setEvent] = useState("");

  const handleApply = () => {
    const filters: GameFilters = {};

    if (playerName.trim()) {
      filters.playerName = playerName.trim();
    }

    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }

    if (dateTo) {
      filters.dateTo = dateTo;
    }

    if (result) {
      filters.result = result;
    }

    if (opening.trim()) {
      filters.opening = opening.trim();
    }

    if (event.trim()) {
      filters.event = event.trim();
    }

    onApplyFilters(filters);
  };

  const handleClear = () => {
    setPlayerName("");
    setDateFrom("");
    setDateTo("");
    setResult("");
    setOpening("");
    setEvent("");
    onClearFilters();
  };

  const hasFilters =
    playerName || dateFrom || dateTo || result || opening || event;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Games</CardTitle>
        <CardDescription>
          Filter games by player, date, opening, result, or event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Player Name Filter */}
          <div className="space-y-2">
            <Label htmlFor="player-name">Player Name</Label>
            <Input
              id="player-name"
              placeholder="Search by player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Opening Filter */}
          <div className="space-y-2">
            <Label htmlFor="opening">Opening (ECO Code)</Label>
            <Input
              id="opening"
              placeholder="e.g., E00, D45..."
              value={opening}
              onChange={(e) => setOpening(e.target.value.toUpperCase())}
              disabled={isLoading}
              maxLength={3}
            />
          </div>

          {/* Result Filter */}
          <div className="space-y-2">
            <Label htmlFor="result">Result</Label>
            <Select value={result} onValueChange={(value: any) => setResult(value)} disabled={isLoading}>
              <SelectTrigger id="result">
                <SelectValue placeholder="All results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-0">White Win (1-0)</SelectItem>
                <SelectItem value="0-1">Black Win (0-1)</SelectItem>
                <SelectItem value="1/2-1/2">Draw (1/2-1/2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Filter */}
          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Input
              id="event"
              placeholder="e.g., World Championship..."
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleApply}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            {hasFilters && (
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
