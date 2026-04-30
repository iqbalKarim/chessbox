/**
 * Games listing page with cursor-based pagination and next/previous buttons
 */

"use client";

import { useGamesCursor } from "@/hooks/use-games-cursor";
import { GameFilterPanel } from "@/components/games/game-filters";
import { GameListTable } from "@/components/games/game-list-table";
import { PaginationControls } from "@/components/games/pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function GamesPage() {
  const {
    games,
    nextCursor,
    previousCursor,
    loading,
    error,
    filters,
    goNext,
    goPrevious,
    applyFilters,
    clearFilters,
  } = useGamesCursor();

  const handleGameClick = (game: any) => {
    // TODO: Navigate to game detail page
    console.log("Clicked game:", game);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Games Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and search through our collection of chess games
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 p-4 border-red-200 bg-red-50">
          <p className="text-red-800 font-semibold">Error: {error}</p>
          <p className="text-red-700 text-sm mt-1">
            Please try again or adjust your search filters.
          </p>
        </Card>
      )}

      {/* Filter Panel */}
      <div className="mb-6">
        <GameFilterPanel
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          isLoading={loading}
        />
      </div>

      {/* Games Table */}
      <div className="mb-6">
        {loading && games.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <GameListTable
            games={games}
            isLoading={loading}
            onGameClick={handleGameClick}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {games.length > 0 && (
        <PaginationControls
          canGoNext={!!nextCursor}
          canGoPrevious={!!previousCursor}
          onNext={goNext}
          onPrevious={goPrevious}
          isLoading={loading}
          pageSize={50}
        />
      )}
    </div>
  );
}
