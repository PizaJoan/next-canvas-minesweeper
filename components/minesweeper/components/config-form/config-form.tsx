import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { capitalize } from '@/lib/utils';

import { useToggle } from '@/hooks/useToggle';
import { useIsSmallDevice } from '@/components/minesweeper/components/game/hooks/useIsSmallDevice';

import { Button } from '@/components/button';

import { Difficulty } from '../../types';
import { IGameContext } from '../../context/types';
import { HEIGHT, WIDTH } from '../../constants';

export const ConfigForm = ({
  configuration,
  updateConfiguration,
  isGameEnabled,
  toggleGameEnabled,
}: {
  configuration: IGameContext;
  updateConfiguration: IGameContext['reset'];
  isGameEnabled: boolean;
  toggleGameEnabled: () => void;
}) => {
  const { isSmallDevice } = useIsSmallDevice();
  const [difficulty, setDifficulty] = useState<Difficulty>(
    configuration.difficulty,
  );
  const [isCustomMode, toggleCustomMode] = useToggle();
  const isGameEnabledRef = useRef(isGameEnabled);
  const toggleGameEnabledRef = useRef(toggleGameEnabled);

  const rowsRef = useRef<HTMLInputElement>(null);
  const colsRef = useRef<HTMLInputElement>(null);

  const handleUpdateConfig = useCallback(() => {
    const selectedConfig: Partial<IGameContext> = {
      difficulty: difficulty,
    };

    if (isCustomMode) {
      selectedConfig.difficulty = Difficulty.custom;
      selectedConfig.rows = +rowsRef.current!.value;
      selectedConfig.cols = +colsRef.current!.value;
    }

    updateConfiguration?.(selectedConfig).then(() => {
      if (!isGameEnabledRef.current) {
        toggleGameEnabledRef.current();
        isGameEnabledRef.current = true;
      }
    });
  }, [difficulty, isCustomMode, updateConfiguration]);

  const handleSubmitConfiguration = (e: FormEvent) => {
    e.preventDefault();

    handleUpdateConfig();
  };

  const handleChangeMode = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Difficulty;

    if (isCustomMode || value === Difficulty.custom) toggleCustomMode();
    else setDifficulty(value);
  };

  useEffect(() => {
    if (isGameEnabledRef.current) handleUpdateConfig();
  }, [difficulty, handleUpdateConfig]);

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
          {Object.values(Difficulty)
            .filter((difficulty) =>
              isSmallDevice
                ? ![Difficulty.custom, Difficulty.hard].includes(difficulty)
                : true,
            )
            .map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {capitalize(difficulty)}
              </option>
            ))}
        </select>
      </div>
      {isCustomMode && !isSmallDevice && (
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
      {(!isGameEnabled || isCustomMode || isSmallDevice) && (
        <Button type="submit" customClassNames="m-0">
          {!isGameEnabled ? 'Start!' : 'Reload'}
        </Button>
      )}
    </form>
  );
};
