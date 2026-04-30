/**
 * Game and pagination related types
 */

export interface Player {
  id: number;
  first_name: string;
  surname: string;
  rating?: number;
}

export interface Opening {
  id: number;
  eco_code: string;
  name: string;
}

export interface GameEvent {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  game_id: string;
  date: string; // ISO date string
  result: "1-0" | "0-1" | "1/2-1/2"; // White win, Black win, Draw
  moves: string;
  ply_count: number;
  white_player: Player;
  black_player: Player;
  event: GameEvent;
  opening: Opening | null;
}

export interface CursorPaginationResponse<T> {
  count: number;
  next: string | null; // Full URL or null
  previous: string | null; // Full URL or null
  results: T[];
}

export interface GameFilters {
  playerName?: string;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  result?: "1-0" | "0-1" | "1/2-1/2" | "";
  opening?: string;
  event?: string;
}

export type GameListState = {
  games: Game[];
  nextCursor: string | null;
  previousCursor: string | null;
  loading: boolean;
  error: string | null;
};

export type InfiniteGameListState = {
  games: Game[];
  nextCursor: string | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
};
