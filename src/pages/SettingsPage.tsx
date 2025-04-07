// src/pages/SettingsPage.tsx
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Importiere den Hook

// Definiere den Typ für die Einstellungen
interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number; // Anzahl Sessions bis lange Pause
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoroSettings', {
    workMinutes: 25, // Standardwerte
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  });

  // Handler zum Aktualisieren der Einstellungen
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0 // Stelle sicher, dass es eine Zahl ist
    }));
  };

  // --- Hier könnten auch die manuellen Uni-Daten rein ---
  // const [manualUniData, setManualUniData] = useLocalStorage...

  return (
    // Box für den Seiteninhalt
    <div className="gbc-border">
      <h2 className='text-lg font-bold mb-3'>OPTIONS</h2>

      {/* Pomodoro Config Section */}
      <div className="mb-6">
          <h3 className='font-bold mb-2 border-b border-pkmn-medium pb-1'>Pomodoro Timer</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div className="flex flex-col">
                  <label htmlFor="workMinutes" className="mb-1">Work (min):</label>
                  <input type="number" id="workMinutes" name="workMinutes" value={settings.workMinutes} onChange={handleChange} className="pkmn-input w-full"/>
              </div>
              <div className="flex flex-col">
                  <label htmlFor="shortBreakMinutes" className="mb-1">Short Break (min):</label>
                  <input type="number" id="shortBreakMinutes" name="shortBreakMinutes" value={settings.shortBreakMinutes} onChange={handleChange} className="pkmn-input w-full"/>
              </div>
              <div className="flex flex-col">
                  <label htmlFor="longBreakMinutes" className="mb-1">Long Break (min):</label>
                  <input type="number" id="longBreakMinutes" name="longBreakMinutes" value={settings.longBreakMinutes} onChange={handleChange} className="pkmn-input w-full"/>
              </div>
               <div className="flex flex-col">
                  <label htmlFor="sessionsBeforeLongBreak" className="mb-1">Sessions / Long Break:</label>
                  <input type="number" id="sessionsBeforeLongBreak" name="sessionsBeforeLongBreak" value={settings.sessionsBeforeLongBreak} onChange={handleChange} className="pkmn-input w-full"/>
              </div>
          </div>
      </div>

      {/* Manual Uni Data Section (Platzhalter) */}
      <div className="mb-6">
          <h3 className='font-bold mb-2 border-b border-pkmn-medium pb-1'>Manual University Data</h3>
          <p className="text-sm text-pkmn-medium">(Inputs here)</p>
      </div>

      {/* Sync Section (Platzhalter) */}
      <div className='opacity-60'>
          <h3 className='font-bold mb-2 border-b border-pkmn-medium pb-1'>[EXPERIMENTAL] University Sync</h3>
          <p className="text-sm mb-2 text-pkmn-medium">Automatic fetching under consideration.</p>
          <button className="pkmn-button" disabled>Connect (WIP)</button>
      </div>

    </div>
  );
};
export default SettingsPage;