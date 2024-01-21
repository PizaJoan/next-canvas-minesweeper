import { Button } from "@/components/button";
import { useMineSweeper } from "./hooks/useMinesweeper";
import { twMerge } from "tailwind-merge";

export const Game = () => {
  const { canvasRef, width, height, remainingFlags, lost, won, reset } =
    useMineSweeper();

  return (
    <>
      <p className="text-3xl font-semibold">Flags: {remainingFlags}</p>
      {(won || lost) && (
        <div className="flex flex-col items-center gap-6">
          <p
            className={twMerge(
              "text-5xl font-bold",
              won ? "text-green-400" : "text-red-400",
            )}
          >
            {won ? "Congrats you won!" : "Game over..."}
          </p>
          <Button onClick={reset}>Play Again!</Button>
        </div>
      )}
      <div id="game">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
};
