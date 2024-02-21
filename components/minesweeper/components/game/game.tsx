import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/button';

import { useMineSweeper } from './hooks/useMinesweeper';
import { useIsSmallDevice } from './hooks/useIsSmallDevice';

export const Game = () => {
  const {
    canvasRef,
    width,
    height,
    remainingFlags,
    lost,
    won,
    reset,
    isDigMode,
    setDigMode,
    setFlagMode,
  } = useMineSweeper();

  const { isSmallDevice } = useIsSmallDevice();

  return (
    <>
      <p className="text-3xl font-semibold">Flags: {remainingFlags}</p>
      {(won || lost) && (
        <div className="flex flex-col items-center gap-6">
          <p
            className={twMerge(
              'text-5xl font-bold',
              won ? 'text-green-400' : 'text-red-400',
            )}
          >
            {won ? 'Congrats you won!' : 'Game over...'}
          </p>
          <Button onClick={reset}>Play Again!</Button>
        </div>
      )}
      <div id="game">
        {isSmallDevice && (
          <div className="flex items-center justify-center gap-5 p-6 ">
            <span className="text-lg font-semibold">Mode:</span>
            <Button
              customClassNames={twMerge(
                'm-0',
                isDigMode &&
                  'border-white focus:border-white active:border-white hover:border-white',
              )}
              onClick={setDigMode}
            >
              👁
            </Button>
            <Button
              customClassNames={twMerge(
                'm-0',
                !isDigMode &&
                  'border-white focus:border-white active:border-white hover:border-white',
              )}
              onClick={setFlagMode}
            >
              🚩
            </Button>
          </div>
        )}
        <canvas
          className="md:rounded md:border md:border-gray-400 md:transition-shadow md:delay-0 md:duration-300 md:ease-linear md:hover:shadow-lg md:hover:shadow-gray-400/50"
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
    </>
  );
};
