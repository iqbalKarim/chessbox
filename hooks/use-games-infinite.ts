/**
 * Custom hook for infinite scroll pagination
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Game, GameFilters, InfiniteGameListState } from "@/lib/types/game";
import { fetchGamesCursor, extractCursorFromUrl } from "@/lib/api/games";

export function useGamesInfinite() {
  const [state, setState] = useState<InfiniteGameListState>({
    games: [],
    nextCursor: null,
    hasMore: true,
    loading: false,
    error: null,
  });

  const [filters, setFilters] = useState<GameFilters>({});
  const isInitialLoad = useRef(true);

  /**
   * Load more games
   */
  const loadMore = useCallback(
    async (cursor?: string) => {
      // Prevent duplicate requests
      if (state.loading) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetchGamesCursor(cursor, filters);
        setState((prev) => ({
          games:
            cursor === undefined || isInitialLoad.current
              ? response.results
              : [...prev.games, ...response.results],
          nextCursor: response.next
            ? extractCursorFromUrl(response.next)
            : null,
          hasMore: response.next !== null,
          loading: false,
          error: null,
        }));

        isInitialLoad.current = false;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Error fetching games",
        }));
      }
    },
    [filters, state.loading]
  );

  /**
   * Load initial games on component mount
   */
  useEffect(() => {
    if (isInitialLoad.current) {
      loadMore();
    }
  }, [filters]); // Re-run when filters change

  /**
   * Apply filters and reset to initial load
   */
  const applyFilters = useCallback((newFilters: GameFilters) => {
    setFilters(newFilters);
    isInitialLoad.current = true;
    // loadMore will be called automatically via useEffect hook due to filters dependency
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    isInitialLoad.current = true;
  }, []);

  /**
   * Load next page
   */
  const fetchNext = useCallback(() => {
    if (state.nextCursor && state.hasMore && !state.loading) {
      loadMore(state.nextCursor);
    }
  }, [state.nextCursor, state.hasMore, state.loading, loadMore]);

  return {
    ...state,
    filters,
    loadMore: fetchNext,
    applyFilters,
    clearFilters,
    refetch: () => {
      isInitialLoad.current = true;
      loadMore();
    },
  };
}
