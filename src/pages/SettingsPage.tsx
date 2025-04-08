// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Importiere den Hook für Kalenderdaten

// Definiere den Typ für die Einstellungen
interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number; // Anzahl Sessions bis lange Pause
}

const SettingsPage: React.FC = () => {
  // Pomodoro Settings (Beispielhaft, falls benötigt)
  const [pomodoroSettings, setPomodoroSettings] = useLocalStorage('pomodoroSettings', {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [, setCalendarIcsData] = useLocalStorage<string | null>('calendarIcsData', null); // State für rohe ICS-Daten

  // Pomodoro Settings Change Handler (Beispielhaft)
  const handlePomodoroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPomodoroSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0, // Konvertiere zu Zahl
    }));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.ics')) {
      setImportMessage('Fehler: Bitte wählen Sie eine .ics Datei aus.');
      return;
    }

    setIsImporting(true);
    setImportMessage('Lese Kalenderdatei...');

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setCalendarIcsData(content); // Speichere rohe ICS-Daten im Local Storage
        setIsImporting(false);
        setImportMessage('Kalenderdaten erfolgreich importiert!');
        setTimeout(() => setImportMessage(null), 3000);
      } else {
        setIsImporting(false);
        setImportMessage('Fehler beim Lesen der Datei.');
        setTimeout(() => setImportMessage(null), 3000);
      }
    };

    reader.onerror = () => {
      setIsImporting(false);
      setImportMessage('Fehler beim Lesen der Datei.');
      setTimeout(() => setImportMessage(null), 3000);
    };

    reader.readAsText(file); // Lese die Datei als Text
  };

  // Dark Theme Handling (kommt im nächsten Schritt)
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const handleThemeToggle = () => {
     setIsDarkMode(prev => !prev);
     // Logik zum Umschalten der Theme-Klasse wird in App.tsx benötigt
  };

  // --- Hier könnten auch die manuellen Uni-Daten rein ---
  // const [manualUniData, setManualUniData] = useLocalStorage...

  return (
    <div className="pkmn-container">
      <div className="pkmn-card">
        <h2>Optionen</h2>
        
        <div className="settings-section">
          <h3 className="text-lg font-bold mb-4">Kalender Import</h3>
          
          <div className="mb-4">
            <p className="mb-2">Importieren Sie Ihren Stundenplan aus CampusNet:</p>
            <div className="flex items-center">
              <label 
                htmlFor="calendar-import" 
                className="pkmn-button cursor-pointer"
              >
                Kalenderdatei auswählen
              </label>
              <input 
                id="calendar-import" 
                type="file" 
                accept=".ics" 
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
            {importMessage && (
              <p className={`mt-2 ${importMessage.includes('erfolgreich') ? 'text-green-600' : 'text-red-600'}`}>
                {importMessage}
              </p>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Hinweis: Die .ics Datei können Sie aus CampusNet exportieren:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Studium → Belegungen → Stundenplan Export</li>
              <li>Aktuelle Kalenderwoche auswählen</li>
              <li>"Termine exportieren" → "Kalenderdatei"</li>
            </ol>
          </div>
        </div>
        
        <div className="settings-section mt-8">
          <h3 className="text-lg font-bold mb-4">Erscheinungsbild</h3>
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="dark-mode" 
              className="mr-2"
            />
            <label htmlFor="dark-mode">Dunkles Theme</label>
          </div>
        </div>
        
        <div className="settings-section mt-8">
          <h3 className="text-lg font-bold mb-4">Benachrichtigungen</h3>
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="notifications" 
              className="mr-2"
            />
            <label htmlFor="notifications">Benachrichtigungen aktivieren</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;