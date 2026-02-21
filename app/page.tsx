"use client";

/** 
1. d4 d5 2. c4 dxc4 3. Nc3 g6 4. e4 Nc6 5. Nf3 Bg7 6. d5 Ne5 7. Nxe5 Bxe5 8.
Bxc4 Bxc3+ 9. bxc3 c5 10. O-O Nf6 11. e5 Ng4 12. Re1 Qc7 13. d6 Qd7 14. e6 fxe6
15. Qxg4 
*/
import { Chessboard } from "react-chessboard";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Chess } from "chess.js";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnalysisBox from "../components/analysis";

const pgnFormSchema = z.object({
  pgn: z
    .string()
    .min(1, { message: "PGN cannot be empty" })
    .superRefine((val, ctx) => {
      // 1. Check if empty
      if (!val || val.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "PGN cannot be empty",
        });
        return;
      }
      const chess = new Chess();
      try {
        // .loadPgn() throws an error in current versions if the PGN is invalid
        chess.loadPgn(val);

        // Additional Check: Ensure the PGN actually contains moves
        if (chess.history().length === 0 && !val.includes("[")) {
          ctx.addIssue({
            code: "custom",
            message: "The PGN contains no valid moves.",
          });
        }
      } catch (e) {
        // If loadPgn throws, we catch it here
        ctx.addIssue({
          code: "custom",
          message: "Invalid PGN: The moves provided are illegal or incorrectly formatted.",
        });
      }
    }),
});

export default function Home() {
  const [game, setGame] = useState(new Chess())
  const form = useForm<z.infer<typeof pgnFormSchema>>({
    resolver: zodResolver(pgnFormSchema),
    defaultValues: {
      // pgn:`1. d4 d5 2. c4 dxc4 3. Nc3 g6 4. e4 Nc6 5. Nf3 Bg7 6. d5 Ne5 7. Nxe5 Bxe5 8. Bxc4 Bxc3+ 9. bxc3 c5 10. O-O Nf6 11. e5 Ng4 12. Re1 Qc7 13. d6 Qd7 14. e6 fxe6 15. Qxg4 `,
      pgn:`1. d4 d5 2. c4 dxc4`,
    },
  });

  const pgnInput = form.watch("pgn")

  useEffect(() => {
    
    const newGame = new Chess()
    try {
      if (pgnInput) {
        newGame.loadPgn(pgnInput)
        setGame(newGame)
        // console.log('fen', newGame.fen())
      }
    } catch (e) {
      // If the manual input is mid-typing and invalid, we don't update the board yet
      console.log('Error', e)
    }
  }, [pgnInput])

  // function onMoveHandler(orig: string, dest: string, capturedPiece?: any){
  function onDrop(piece: { isSparePiece: boolean, pieceType: string, position: string }, sourceSquare: string, targetSquare: string | null) : boolean {
    console.log("onDrop", piece, sourceSquare, targetSquare)
    return true
    // const gameCopy = new Chess(game.pgn())
    // try {
    //   const move = gameCopy.move({
    //     from: sourceSquare,
    //     to: targetSquare!,
    //     promotion: "q", // always promote to queen for simplicity
    //   })

    //   if (move === null) return false // Invalid move

    //   setGame(gameCopy)
      
    //   // Update the ShadCN form field with the new PGN
    //   form.setValue("pgn", gameCopy.pgn(), { shouldValidate: true })
    //   return true
    // } catch (e) {
    //   return false
    // }
  }

  return (
    <div className="p-4 w-full h-full flex justify-between align-top gap-4">
      <div className="bg-gray-50 rounded shadow w-100 h-100">
        <Chessboard 
        options={{
          position: game.fen(),
          onPieceDrop: ({piece, sourceSquare, targetSquare}) => onDrop(piece, sourceSquare, targetSquare),
          boardOrientation: "white"
        }}
          />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Enter PGN infomation</CardTitle>
            <CardDescription>Enter the PGN information of your game. This information will be used to:
              <ul className="ml-6 list-disc [&>li]:mt-2">
                <li>Assess your opening and understand your game</li>
                <li>Translate the PGN to be shown on the board</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FenForm form={form}></FenForm>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="pgnSubmission">
              Submit
            </Button>
          </CardFooter>
        </Card>
        
        <AnalysisBox game={game} pgn={form.getValues().pgn}/>
      </div>
    </div>
  );
}

function FenForm({
  form,
  onSubmitPGN = () => {},
}: {
  form: UseFormReturn<
    {
      pgn: string;
    },
    any,
    {
      pgn: string;
    }
  >;
  onSubmitPGN?: SubmitHandler<{ pgn: string }>;
}) {
  return (
    <form id="pgnSubmission" onSubmit={form.handleSubmit(onSubmitPGN)}>
      <FieldGroup>
        <Controller
          name="pgn"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="PGN">PGN</FieldLabel>
              <Input {...field} id="PGN" aria-invalid={fieldState.invalid} placeholder="Enter PGN" autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
