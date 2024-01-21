import { Minesweeper } from "@/components/minesweeper/minesweeper";

const Game = () => {
  return (
    <section className="flex flex-col items-center gap-5">
      <h1 className="text-4xl font-bold">
        Hello and welcome to the Game itself, enjoy!
      </h1>
      <Minesweeper />
    </section>
  );
};

export default Game;
