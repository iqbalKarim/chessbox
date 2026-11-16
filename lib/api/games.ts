/**
 * Games API utilities
 */

import { djangoApi } from "@/lib/axios/axios";
import { Game, CursorPaginationResponse, GameFilters } from "@/lib/types/game";

const API_ENDPOINT = "/api/games/";

/**
 * Fetch games with cursor-based pagination
 * @param cursor - Optional cursor URL (from next/previous links)
 * @param filters - Optional filters to apply
 * @returns Pagination response with games
 */
export async function fetchGamesCursor(
  cursor?: string,
  filters?: GameFilters
): Promise<CursorPaginationResponse<Game>> {
  try {
    let url = cursor || API_ENDPOINT;

    // If cursor is a full URL, use it directly
    // Otherwise, start with the base endpoint and apply filters
    if (!cursor) {
      const params = new URLSearchParams();

      if (filters?.playerName) {
        // Assuming API supports filtering by player name
        params.append("player_name", filters.playerName);
      }

      if (filters?.dateFrom) {
        params.append("date_from", filters.dateFrom);
      }

      if (filters?.dateTo) {
        params.append("date_to", filters.dateTo);
      }

      if (filters?.result && (filters.result === "1-0" || filters.result === "0-1" || filters.result === "1/2-1/2")) {
        params.append("result", filters.result);
      }

      if (filters?.opening) {
        params.append("opening", filters.opening);
      }

      if (filters?.event) {
        params.append("event", filters.event);
      }

      const queryString = params.toString();
      if (queryString) {
        url = `${API_ENDPOINT}?${queryString}`;
      }
    }
    // If cursor is already a full URL from the API, extract path and query
    // djangoApi will use baseURL + path
    if (cursor && cursor.startsWith("http")) {
      // Extract path and query from full URL
      const urlObj = new URL(cursor);
      url = `${urlObj.pathname}${urlObj.search}`.replace(
        /^\/api\/api\/games/,
        "/api/games"
      ); // Avoid double /api/api/
    }

    const response = await djangoApi.get<CursorPaginationResponse<Game>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}

/**
 * Apply filters to a base URL (for manual URL construction if needed)
 * @param baseUrl - Base API URL
 * @param filters - Filters to apply
 * @returns URL with query parameters
 */
export function applyFiltersToUrl(
  baseUrl: string,
  filters: GameFilters
): string {
  const params = new URLSearchParams();

  if (filters.playerName) {
    params.append("player_name", filters.playerName);
  }

  if (filters.dateFrom) {
    params.append("date_from", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.append("date_to", filters.dateTo);
  }

  if (filters.result && (filters.result === "1-0" || filters.result === "0-1" || filters.result === "1/2-1/2")) {
    params.append("result", filters.result);
  }

  if (filters.opening) {
    params.append("opening", filters.opening);
  }

  if (filters.event) {
    params.append("event", filters.event);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Extract cursor from pagination response
 * @param url - Full URL from next/previous field
 * @returns Path and query suitable for djangoApi.get()
 */
export function extractCursorFromUrl(url: string): string {
  if (!url) return "";

  // If it's already a relative path, return as-is
  if (!url.startsWith("http")) {
    return url;
  }

  // Parse full URL and extract path + query
  try {
    const urlObj = new URL(url);
    return `${urlObj.pathname}${urlObj.search}`.replace(
      /^\/api\/api\/games/,
      "/api/games"
    );
  } catch {
    return "";
  }
}
