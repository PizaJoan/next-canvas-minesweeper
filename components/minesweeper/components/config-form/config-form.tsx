import { capitalize } from '@/lib/utils';
import { Cell, Difficulty } from '../../types';
import { IGameContext } from '../../context/types';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useToggle } from '@/hooks/useToggle';
import { HEIGHT, MINES, WIDTH } from '../../constants';
import { Button } from '@/components/button';

export const ConfigForm = ({
  configuration,
  updateConfiguration,
  isGameEnabled,
  toggleGameEnabled,
}: {
  configuration: IGameContext;
  updateConfiguration: Dispatch<SetStateAction<IGameContext>>;
  isGameEnabled: boolean;
  toggleGameEnabled: () => void;
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    configuration.difficulty,
  );
  const [isCustomMode, toggleCustomMode] = useToggle();

  const rowsRef = useRef<HTMLInputElement>(null);
  const colsRef = useRef<HTMLInputElement>(null);

  const handleChangeMode = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Difficulty;

    if (isCustomMode || value === Difficulty.custom) toggleCustomMode();

    setDifficulty(value);
  };

  const handleSubmitConfiguration = (e: FormEvent) => {
    e.preventDefault();

    const selectedConfig = {
      ...configuration,
      difficulty: difficulty,
    };

    if (isCustomMode) {
      selectedConfig.rows = +rowsRef.current!.value;
      selectedConfig.cols = +colsRef.current!.value;
    }

    fetch('/api/game/init', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(selectedConfig),
    })
      .then((res) => res.json())
      .then(({ board }) => {
        updateConfiguration({
          rows: board.rows,
          cols: board.cols,
          board: board.jsonBoard.map((row: number[]) =>
            row.map((col) => ({ num: col })),
          ),
          difficulty: board.difficulty,
          mines: board.mines,
        });

        if (!isGameEnabled) toggleGameEnabled();
      });
  };

  useEffect(() => {
    updateConfiguration((prevConfiguration) => ({
      ...prevConfiguration,
      difficulty: difficulty,
      rows: HEIGHT[difficulty],
      cols: WIDTH[difficulty],
    }));
  }, [difficulty, updateConfiguration]);

  return (
    <form
      onSubmit={handleSubmitConfiguration}
      className="flex flex-row flex-wrap items-end justify-center gap-x-6"
    >
      <div>
        <label className="mb-2 block font-medium text-gray-900 dark:text-white">
          Select difficulty
        </label>
        <select
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={handleChangeMode}
          defaultValue={difficulty}
        >
          {Object.values(Difficulty).map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {capitalize(difficulty)}
            </option>
          ))}
        </select>
      </div>
      {isCustomMode && (
        <>
          <div>
            <label className="mb-2 block font-medium text-gray-900 dark:text-white">
              Number of columns
            </label>
            <input
              ref={colsRef}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              defaultValue={WIDTH[Difficulty.custom]}
              type="number"
              min={8}
              max={100}
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-900 dark:text-white">
              Number of rows
            </label>
            <input
              ref={rowsRef}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              defaultValue={HEIGHT[Difficulty.custom]}
              type="number"
              min={8}
              max={100}
            />
          </div>
        </>
      )}
      {(!isGameEnabled || isCustomMode) && (
        <Button type="submit" customClassNames="m-0">
          Start!
        </Button>
      )}
    </form>
  );
};
