'use client';
import { useRef, useState } from 'react';

import { useToggle } from '@/hooks/useToggle';

import { GameContext, initialGameContext } from './context/gameContext';

import { Game } from './components/game/game';
import { ConfigForm } from './components/config-form/config-form';
import { IGameContext } from './context/types';
import { mapBoard } from './components/game/core/minesweeper';

export const Minesweeper = () => {
  const [configuration, setConfiguration] = useState(initialGameContext);
  const [isGameEnabled, toggleGameEnabled] = useToggle();

  const updateConfiguration = useRef((gameContext?: Partial<IGameContext>) =>
    fetch('/api/game/init', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(gameContext ? gameContext : configuration),
    })
      .then((res) => res.json())
      .then(({ board }) => {
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
