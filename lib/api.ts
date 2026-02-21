import { Chess } from "chess.js";
import lichessApi from "./axios";

function pgnToUci(pgn: string): string {
  const game = new Chess();
  game.loadPgn(pgn);
  const moves = game.history({ verbose: true });
  const uciMoves: string[] = [];
  moves.forEach((move) => {
    uciMoves.push(`${move.from}${move.to}`); // Outputs: e2-e4, e7-e5, g1-f3, b8-c6, etc.
  });
  return uciMoves.join(",");
}

export async function getOpening(pgn: string) {
  const uci = pgnToUci(pgn);
  return lichessApi.get("/masters", {
    params: { play: uci },
  });
}

export async function getAnalysis(fen: string) {
  const boardOnly = fen.split(" ")[0];
  return lichessApi.get("/masters", {
    params: { fen: boardOnly },
  });
}
