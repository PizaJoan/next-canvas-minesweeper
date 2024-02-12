'use client';
import { useRef, useState } from 'react';

import { useToggle } from '@/hooks/useToggle';

import { GameContext, initialGameContext } from './context/gameContext';

import { Game } from './components/game/game';
import { ConfigForm } from './components/config-form/config-form';
import { IGameContext } from './context/types';
import { mapBoard } from './components/game/core/minesweeper';
import { initGame } from './components/game/lib/requests';

export const Minesweeper = () => {
  const [configuration, setConfiguration] = useState(initialGameContext);
  const [isGameEnabled, toggleGameEnabled] = useToggle();

  const updateConfiguration = useRef((gameContext?: Partial<IGameContext>) =>
    initGame(gameContext ? gameContext : configuration).then(({ board }) => {
      setConfiguration({
        rows: board.rows,
        cols: board.cols,
        board: mapBoard(board.jsonBoard),
        difficulty: board.difficulty,
        mines: board.mines,
      });
    }),
  );

  return (
    <>
      <ConfigForm
        configuration={configuration}
        isGameEnabled={isGameEnabled}
        toggleGameEnabled={toggleGameEnabled}
        updateConfiguration={updateConfiguration.current}
      />
      {isGameEnabled && (
        <GameContext.Provider
          value={{ ...configuration, reset: updateConfiguration.current }}
        >
          <Game />
        </GameContext.Provider>
      )}
    </>
  );
};
