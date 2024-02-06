'use client';
import { useState } from 'react';

import { useToggle } from '@/hooks/useToggle';

import { GameContext, initialGameContext } from './context/gameContext';

import { Game } from './components/game/game';
import { ConfigForm } from './components/config-form/config-form';

export const Minesweeper = () => {
  const [configuration, setConfiguration] = useState(initialGameContext);
  const [isGameEnabled, toggleGameEnabled] = useToggle();

  return (
    <>
      <ConfigForm
        configuration={configuration}
        isGameEnabled={isGameEnabled}
        toggleGameEnabled={toggleGameEnabled}
        updateConfiguration={setConfiguration}
      />
      {isGameEnabled && (
        <GameContext.Provider value={configuration}>
          <Game />
        </GameContext.Provider>
      )}
    </>
  );
};
