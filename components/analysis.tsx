"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { getAnalysis, getOpening } from "../lib/api";
import { Fragment, useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface GamePlayer {
  name: string;
  rating: string;
}
interface HistoricalGame{
  id: string;
  winner: null;
  black: GamePlayer;
  white: GamePlayer;
  year: string;
  month: string;
}
interface OpeningData {
  opening: {
    eco: string;
    name: string;
  };
  topGames: {
    uci: string;
  } & HistoricalGame[];
  moves: {
    uci: string;
    san: string;
    averageRating: number;
    white: number;
    black: 1;
    game: null | HistoricalGame;
    opening: null;
  }[];
  [key: string]: any;
}

export default function AnalysisBox({ pgn, game }: { pgn: string; game: Chess }) {
  const [analysisData, setAnalysisData] = useState<object>();
  const [openingData, setOpeningData] = useState<OpeningData>();

  useEffect(() => {
    makeRequest();
  }, []);
  function makeRequest() {
    // getOpening(pgn).then((res) => {
    //   setOpeningData(res.data as OpeningData);
    // });

    getAnalysis(game.fen()).then((res) => {
      setAnalysisData(res.data);
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Analysis</CardTitle>
        <CardDescription>
          The entered PGN will be used here to request the masters dashboard for the results.
        </CardDescription>
        <CardAction>
          <Button onClick={makeRequest}>Request</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* <div className="flex">
          <div className="w-1/2">
            PGN
            <pre
                className="bg-[#eee] p-2.5 rounded-[5px] border border-[#ccc] whitespace-pre-wrap wrap-break-word"
            >
              {game.pgn()}
            </pre>
          </div>
          <div className="w-1/2">
            FEN
            <pre
            className="bg-[#eee] p-2.5 rounded-[5px] border border-[#ccc] whitespace-pre-wrap wrap-break-words"
            >
              {game.fen()}
            </pre>
          </div>
        </div> */}

        {openingData && (
          <>
            <section className="mb-2">
              <Badge className="bg-purple-50 text-purple-700 text-md mr-3">{openingData.opening?.eco}</Badge>
              {openingData.opening?.name}
            </section>

            <Separator className="my-2"/>
            <section>
              <h3 className="font-medium">Next Moves</h3>
              {
                openingData.moves.map((move, index) => {
                  return (
                    <Badge key={index} className="mr-2">{move.san}</Badge>
                  )
                })
              }
            </section>
            <Separator className="my-2"/>
            <section>
              {openingData.topGames.map((tg, index) => {
                const date = new Date(`${tg.month}-01`);
                const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
                const year = date.getFullYear();

                return (
                <Fragment key={index}>
                  <div className=" hover:bg-blue-50 cursor-pointer rounded-s relative">
                    <div className="w-fit shrink-0 text-xs text-gray-600 absolute right-1">
                      {formattedMonth} {year}
                    </div>
                    <div className="grid grid-cols-[1fr_50px_1fr] gap-4 w-full items-center">
                      <Player player={tg.white} className="text-right" />
                      <Badge className="m-auto">VS</Badge>
                      <Player player={tg.black} />
                    </div>
                  </div>
                </Fragment>
              )})}
            </section>
          </>
        )}
        <div className="flex">
          {/* <div className="w-1/2">
            {analysisData && (
              <pre className="bg-[#eee] p-2.5 rounded-[5px] border border-[#ccc] whitespace-pre-wrap wrap-break-words">
                {JSON.stringify(analysisData, null, 2)}
              </pre>
            )}
          </div> */}
          {/* <div className="w-1/2"> */}
          <div className="w-full text-xs">
            {openingData && (
              <pre className="bg-[#eee] p-2.5 rounded-[5px] border border-[#ccc] whitespace-pre-wrap wrap-break-words">
                {JSON.stringify(openingData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Player({ player, className }: { player: GamePlayer; className?: string }) {
  return (
    <div className={className}>
      <span>{player.name}</span>
      <br />
      <span className="text-sm text-gray-600">{player.rating}</span>
    </div>
  );
}
