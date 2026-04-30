/**
 * Infinite scroll games list component
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { Game } from "@/lib/types/game";
import { GameListTable } from "./game-list-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GameListInfiniteProps {
  games: Game[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onGameClick?: (game: Game) => void;
  useIntersectionObserver?: boolean;
}

export function GameListInfinite({
  games,
  hasMore,
  isLoading,
  onLoadMore,
  onGameClick,
  useIntersectionObserver = true,
}: GameListInfiniteProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  /**
   * Setup intersection observer for auto-loading on scroll
   */
  useEffect(() => {
    if (!useIntersectionObserver || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, useIntersectionObserver]);

  if (games.length === 0 && !isLoading) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-500">No games found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <GameListTable games={games} isLoading={isLoading} onGameClick={onGameClick} />

      {/* Load More Trigger */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more games...</span>
          </div>
        ) : hasMore ? (
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        ) : (
          <p className="text-gray-500">No more games to load</p>
        )}
      </div>
    </div>
  );
}
