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

export function getGames(url?: string, params?: {}): Promise<CursorPaginated<GameDetail>>{
  if (url) return djangoApi.get(url, { params });
  else return djangoApi.get("games/", { params });
}

