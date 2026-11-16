/**
 * Games listing page with infinite scroll
 */

"use client";

import { useGamesInfinite } from "@/hooks/use-games-infinite";
import { GameFilterPanel } from "@/components/games/game-filters";
import { GameListInfinite } from "@/components/games/game-list-infinite";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function GamesInfinitePage() {
  const {
    games,
    hasMore,
    loading,
    error,
    filters,
    loadMore,
    applyFilters,
    clearFilters,
  } = useGamesInfinite();

  const handleGameClick = (game: any) => {
    // TODO: Navigate to game detail page
    console.log("Clicked game:", game);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Games Library (Infinite Scroll)</h1>
        <p className="text-gray-600 mt-2">
          Browse through our collection of chess games. Scroll down to load more
          games automatically.
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
          isLoading={loading && games.length === 0}
        />
      </div>

      {/* Infinite Scroll List */}
      <div>
        {loading && games.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <GameListInfinite
            games={games}
            hasMore={hasMore}
            isLoading={loading}
            onLoadMore={loadMore}
            onGameClick={handleGameClick}
            useIntersectionObserver={true}
          />
        )}
      </div>
    </div>
  );
}
