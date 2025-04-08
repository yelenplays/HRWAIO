// src/pages/PomodoroPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PokeballCounter from '../components/widgets/PokeballCounter';

// Types
interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}
type TimerMode = 'Arbeit' | 'Kurze Pause' | 'Lange Pause';

// Formatting function
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Audio hook
const useAudio = (src: string) => {
  const audioRef = useRef<any>(null);

  useEffect(() => {
    // Only execute in browser
    if (typeof Audio !== "undefined") {
      try {
        const audioInstance = new Audio(src);
        audioInstance.load(); // Try to preload
        audioRef.current = audioInstance;
      } catch (e) {
        console.error(`Error loading audio: ${src}`, e);
        audioRef.current = null; // Set ref to null on error
      }
    }
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.play) {
      // Try to play, catch errors (e.g., interaction needed)
      audioRef.current.play().catch((e: Error) => console.error(`Error playing audio: ${src}`, e));
    }
  }, [src]);

  return play;
};

const PomodoroPage: React.FC = () => {
  const [settings] = useLocalStorage<PomodoroSettings>('pomodoroSettings', {
    workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, sessionsBeforeLongBreak: 4,
  });
  const [mode, setMode] = useState<TimerMode>('Arbeit');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio hooks - commented out until audio files are available
  // const playStartSound = useAudio('/assets/audio/start.wav');
  // const playCompleteSound = useAudio('/assets/audio/complete.wav');
  
  // Placeholder functions for audio
  const playStartSound = useCallback(() => {
    console.log('Start sound would play here');
  }, []);
  
  const playCompleteSound = useCallback(() => {
    console.log('Complete sound would play here');
  }, []);

  const switchMode = useCallback((nextMode: TimerMode) => {
    setMode(nextMode);
    setIsActive(false);
    switch (nextMode) {
      case 'Arbeit': setTimeLeft(settings.workMinutes * 60); break;
      case 'Kurze Pause': setTimeLeft(settings.shortBreakMinutes * 60); break;
      case 'Lange Pause':
        setTimeLeft(settings.longBreakMinutes * 60);
        setCompletedSessions(0);
        break;
    }
  }, [settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playCompleteSound();
      alert(`${mode} beendet!`);

      if (mode === 'Arbeit') {
        const newSessionCount = completedSessions + 1;
        setCompletedSessions(newSessionCount);
        if (newSessionCount >= settings.sessionsBeforeLongBreak) {
          switchMode('Lange Pause');
        } else {
          switchMode('Kurze Pause');
        }
      } else {
        switchMode('Arbeit');
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, timeLeft, mode, completedSessions, settings, switchMode, playCompleteSound]);

  useEffect(() => {
    if (!isActive) {
      switch (mode) {
        case 'Arbeit': setTimeLeft(settings.workMinutes * 60); break;
        case 'Kurze Pause': setTimeLeft(settings.shortBreakMinutes * 60); break;
        case 'Lange Pause': setTimeLeft(settings.longBreakMinutes * 60); break;
      }
    }
  }, [settings, mode, isActive]);

  const toggleTimer = () => {
    const nextIsActive = !isActive;
    setIsActive(nextIsActive);
    if (nextIsActive) {
      playStartSound();
    }
  };

  const handleReset = () => {
    switchMode(mode);
  };

  const handleSkip = () => {
    if (window.confirm(`Aktuelle ${mode} überspringen?`)) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playCompleteSound();

      const nextSession = mode === 'Arbeit' ? completedSessions + 1 : completedSessions;
      setCompletedSessions(nextSession);
      if (mode === 'Arbeit' && nextSession >= settings.sessionsBeforeLongBreak) {
        switchMode('Lange Pause');
      } else if (mode === 'Arbeit') {
        switchMode('Kurze Pause');
      } else {
        switchMode('Arbeit');
      }
    }
  };

  return (
    <div className="gbc-border flex flex-col items-center justify-center h-full bg-opacity-95 shadow-lg">
      <h2 className='text-lg font-bold mb-2 uppercase tracking-wide self-start text-pkmn-dark'>FOKUS TIMER</h2>

      <div className="flex flex-col items-center text-center flex-grow justify-center w-full">
        <p className="mb-1 text-pkmn-dark">Modus: <span className='font-bold'>{mode}</span></p>

        {mode === 'Arbeit' && (
          <PokeballCounter
            completed={completedSessions}
            total={settings.sessionsBeforeLongBreak}
          />
        )}
        
        {mode !== 'Arbeit' && (
          <div className='h-6 my-3'></div>
        )}

        <p className="text-6xl mb-4 font-bold text-pkmn-dark">{formatTime(timeLeft)}</p>

        <div className="flex justify-center items-center space-x-5">
          <button onClick={toggleTimer} className={`pkmn-button ${isActive ? 'pkmn-button-pause' : 'pkmn-button-start'}`}>
            {isActive ? 'PAUSE' : 'START'}
          </button>
          <button onClick={handleReset} className="pkmn-button pkmn-button-control">
            ZURÜCK
          </button>
          <button onClick={handleSkip} className="pkmn-button pkmn-button-control">
            ÜBERSPRINGEN
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;