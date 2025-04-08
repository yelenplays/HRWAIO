import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ICAL from 'ical.js'; // Import the library

interface CalendarEvent {
  summary: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
}

const SchedulePage: React.FC = () => {
  const [isGuideVisible, setIsGuideVisible] = useState(true);
  const [calendarData] = useLocalStorage<string | null>('calendarIcsData', null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (calendarData) {
      try {
        const jcalData = ICAL.parse(calendarData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const parsedEvents: CalendarEvent[] = vevents.map((vevent: any) => {
          const event = new ICAL.Event(vevent);
          return {
            summary: event.summary,
            startDate: event.startDate.toJSDate(),
            endDate: event.endDate.toJSDate(),
            location: event.location || 'N/A',
            description: event.description || 'Keine Beschreibung',
          };
        });

        // Sort events by start date
        parsedEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        
        setEvents(parsedEvents);
        setIsGuideVisible(parsedEvents.length === 0); // Hide guide if events are loaded
        setParseError(null);
      } catch (error) {
        console.error("Error parsing ICS data:", error);
        setParseError("Fehler beim Verarbeiten der Kalenderdaten. Bitte versuchen Sie, die Datei erneut zu importieren.");
        setEvents([]);
        setIsGuideVisible(true); // Show guide on error
      }
    } else {
      setEvents([]);
      setIsGuideVisible(true); // Show guide if no data
    }
  }, [calendarData]);

  const formatDate = (date: Date) => {
     return date.toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="gbc-border p-4">
      <h2 className='text-lg font-bold mb-3'>KALENDER</h2>

      {isGuideVisible && (
        <div className="guide-container mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-bold text-yellow-800">Anleitung: Stundenplan Import</h3>
            <button
              onClick={() => setIsGuideVisible(false)}
              className="text-yellow-700 hover:text-yellow-900 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-yellow-900">
            <li>In CampusNet: Studium → Belegungen → Stundenplan Export</li>
            <li>Aktuelle Kalenderwoche auswählen</li>
            <li>Oben rechts: "Termine exportieren" → "Kalenderdatei"</li>
            <li>Die .ics Datei herunterladen</li>
            <li>In dieser App: Optionen → Kalenderdatei auswählen & importieren</li>
          </ol>
        </div>
      )}

      {parseError && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {parseError}
         </div>
      )}

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white bg-opacity-80 p-3 rounded shadow border-l-4 border-blue-500">
              <h4 className="font-bold text-pkmn-dark text-sm">{event.summary}</h4>
              <p className="text-xs text-pkmn-medium"><strong>Zeit:</strong> {formatDate(event.startDate)} - {event.endDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-pkmn-medium"><strong>Ort:</strong> {event.location}</p>
              {event.description !== 'Keine Beschreibung' && 
                 <p className="text-xs text-pkmn-medium mt-1"><strong>Info:</strong> {event.description}</p>
              }
            </div>
          ))}
        </div>
      ) : (
        !isGuideVisible && !parseError && (
          <div className="text-center text-pkmn-medium py-10">
            <p>Keine Kalendereinträge gefunden.</p>
            <button
              onClick={() => setIsGuideVisible(true)}
              className="pkmn-button mt-4"
            >
              Import-Anleitung anzeigen
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default SchedulePage;