// src/pages/PomodoroPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Typen für Einstellungen und Timer-Modus
interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}
type TimerMode = 'Work' | 'Short Break' | 'Long Break';

// Hilfsfunktion zum Formatieren der Zeit
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PomodoroPage: React.FC = () => {
  // Lade Einstellungen aus localStorage oder verwende Standards
  const [settings] = useLocalStorage<PomodoroSettings>('pomodoroSettings', {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  });

  // State für den Timer
  const [mode, setMode] = useState<TimerMode>('Work');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60); // Zeit in Sekunden
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Ref für das Interval, um es stoppen zu können
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Funktion zum Wechseln des Modus und Reseten des Timers
  const switchMode = useCallback((nextMode: TimerMode) => {
    setMode(nextMode);
    setIsActive(false); // Timer stoppen beim Moduswechsel

    switch (nextMode) {
      case 'Work':
        setTimeLeft(settings.workMinutes * 60);
        break;
      case 'Short Break':
        setTimeLeft(settings.shortBreakMinutes * 60);
        break;
      case 'Long Break':
        setTimeLeft(settings.longBreakMinutes * 60);
        setCompletedSessions(0); // Zähler für lange Pause zurücksetzen
        break;
    }
  }, [settings]); // Abhängig von den Einstellungen

   // Haupt-Effekt für den Countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
       // Timer abgelaufen!
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Sound abspielen (optional, braucht eine Sounddatei)
      // const audio = new Audio('/path/to/your/sound.mp3');
      // audio.play();
       alert(`${mode} session finished!`); // Einfacher Alert

      // Nächsten Modus bestimmen
      if (mode === 'Work') {
          const newSessionCount = completedSessions + 1;
          setCompletedSessions(newSessionCount);
          if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
              switchMode('Long Break');
          } else {
              switchMode('Short Break');
          }
      } else { // Nach einer Pause kommt immer Arbeit
          switchMode('Work');
      }

    } else {
       // Timer ist nicht aktiv oder Zeit > 0
       if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Aufräumfunktion: Interval löschen, wenn Komponente unmountet oder isActive/timeLeft sich ändert
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, mode, completedSessions, settings, switchMode]); // Abhängigkeiten des Effekts

  // Effekt, um Timer neu zu setzen, wenn Einstellungen geändert werden
  // (während der Timer NICHT läuft)
  useEffect(() => {
      if (!isActive) {
          switch(mode) {
              case 'Work': setTimeLeft(settings.workMinutes * 60); break;
              case 'Short Break': setTimeLeft(settings.shortBreakMinutes * 60); break;
              case 'Long Break': setTimeLeft(settings.longBreakMinutes * 60); break;
          }
      }
  }, [settings, mode, isActive]); // Abhängig von Einstellungen etc.

  // Handler für Buttons
  const toggleTimer = () => setIsActive(!isActive);
  const handleReset = () => switchMode(mode); // Reset zum aktuellen Modus

  return (
    <div className="gbc-border">
       <h2 className='text-lg font-bold mb-3 uppercase tracking-wide'>FOCUS TIMER</h2>
       <div className="text-center">
          {/* Aktueller Modus */}
          <p className="mb-4">Mode: <span className='font-bold'>{mode}</span> ({completedSessions}/{settings.sessionsBeforeLongBreak})</p>

          {/* Verbleibende Zeit */}
          <p className="text-6xl mb-6 font-bold">{formatTime(timeLeft)}</p>

          {/* Steuerungsbuttons */}
          <div className="space-x-3">
              <button onClick={toggleTimer} className="pkmn-button">
                  {isActive ? 'PAUSE' : 'START'}
              </button>
              <button onClick={handleReset} className="pkmn-button">
                  RESET
              </button>
               {/* Optionaler Skip-Button */}
               <button
                  onClick={() => {
                      if (window.confirm(`Skip current ${mode} session?`)) {
                        // Direkten Moduswechsel auslösen (simuliert Timer-Ende)
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        const nextSession = mode === 'Work' ? completedSessions + 1 : completedSessions;
                        setCompletedSessions(nextSession);
                        if (mode === 'Work' && nextSession % settings.sessionsBeforeLongBreak === 0) {
                            switchMode('Long Break');
                        } else if (mode === 'Work') {
                            switchMode('Short Break');
                        } else {
                            switchMode('Work');
                        }
                      }
                  }}
                  className="pkmn-button"
                  title="Skip to next session"
              >
                  SKIP
              </button>
          </div>
       </div>
    </div>
  );
};

export default PomodoroPage;  