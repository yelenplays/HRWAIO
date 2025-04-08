// src/components/widgets/PokeballCounter.tsx
import React from 'react';

interface PokeballCounterProps {
  completed: number; // Anzahl abgeschlossener Sessions
  total: number;     // Gesamtzahl Sessions bis lange Pause
}

const PokeballCounter: React.FC<PokeballCounterProps> = ({ completed, total }) => {
  // Erzeuge ein Array mit der Länge 'total' für die Iteration
  const balls = Array.from({ length: total }, (_, i) => i < completed); // true für abgeschlossen, false für offen

  return (
    // Container für die Pokébälle, zentriert und mit Abstand
    <div className="flex justify-center items-center space-x-1 my-3 h-6"> {/* Höhe anpassen! */}
      {balls.map((isCompleted, index) => (
        <img
          key={index}
          // Dynamischer Pfad zu den Icons im public-Ordner
          src={isCompleted ? '/assets/icons/pokeball-filled.png' : '/assets/icons/pokeball-empty.png'}
          alt={isCompleted ? 'Completed Session' : 'Pending Session'}
          className="w-5 h-5" // Größe der Pokébälle anpassen
          title={`Session ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PokeballCounter;