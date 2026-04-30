import GameDetail from "@/lib/types/gameDetail";
import { djangoApi } from "./axios";

export interface Paginated<T>{
  next: string | null,
  previous: string | null,
  count: number,
  results: T[]
}

export interface CursorPaginated<T>{
  next: string | null,
  previous: string | null,
  results: T[]
}

export function getGames(url?: string): Promise<CursorPaginated<GameDetail>>{
  return djangoApi.get(url || "games/");
}

