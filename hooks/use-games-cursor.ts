/**
 * Custom hook for cursor-based pagination
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Game, GameFilters, GameListState } from "@/lib/types/game";
import { fetchGamesCursor, extractCursorFromUrl } from "@/lib/api/games";

export function useGamesCursor() {
  const [state, setState] = useState<GameListState>({
    games: [],
    nextCursor: null,
    previousCursor: null,
    loading: false,
    error: null,
  });

  const [filters, setFilters] = useState<GameFilters>({});

  /**
   * Fetch games with current cursor and filters
   */
  const fetchGames = useCallback(
    async (cursor?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetchGamesCursor(cursor, filters);
        console.log('here', response)
        setState({
          games: response.results,
          nextCursor: response.next
            ? extractCursorFromUrl(response.next)
            : null,
          previousCursor: response.previous
            ? extractCursorFromUrl(response.previous)
            : null,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Error fetching games",
        }));
      }
    },
    [filters]
  );

  /**
   * Load initial games on component mount
   */
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  /**
   * Navigate to next page
   */
  const goNext = useCallback(() => {
    if (state.nextCursor) {
      fetchGames(state.nextCursor);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.nextCursor, fetchGames]);

  /**
   * Navigate to previous page
   */
  const goPrevious = useCallback(() => {
    if (state.previousCursor) {
      fetchGames(state.previousCursor);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.previousCursor, fetchGames]);

  /**
   * Apply filters and reset to first page
   */
  const applyFilters = useCallback((newFilters: GameFilters) => {
    setFilters(newFilters);
    // fetchGames will be called automatically via useEffect hook due to filters dependency
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    ...state,
    filters,
    goNext,
    goPrevious,
    applyFilters,
    clearFilters,
    refetch: () => fetchGames(),
  };
}
