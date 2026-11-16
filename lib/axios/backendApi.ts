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

export interface OpeningStatDTO {
    "year": string,
    "total_games": number,
    "white_wins": number,
    "black_wins": number,
    "draws": number,
  }

export interface OpeningStatsResponse { 
  opening: {
    id: string,
    eco_code: string,
    name: string,
    moves: string
  }  
  statistics: OpeningStatDTO[]
}

export function getGames(url?: string, params?: {}): Promise<CursorPaginated<GameDetail>>{
  if (url) return djangoApi.get(url, { params });
  else return djangoApi.get("games/", { params });
}

export function getOpeningStats(eco_code: string): Promise<OpeningStatsResponse>{
  return djangoApi.get("games/stats/", { params: {eco_code} });
}


