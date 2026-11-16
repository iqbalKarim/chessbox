interface GameDetail {
  id: number;
  game_id: string | null;
  date: string | null;
  result: string;
  ply_count: number | null;
  moves: string;
  white_player: Player;
  black_player: Player;
  event: Event;
  opening: Opening;
}

export interface Player {
  id: number;
  surname: string;
  first_name: string;
  middle_name: string | null;
  fide_id: string | null;
}

export interface Event {
  id: number;
  name: string;
  site: string | null;
  country: string | null;
}

export interface Opening {
  id: number;
  eco_code: string;
  name: string | null;
}

export default GameDetail