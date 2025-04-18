import React from 'react';
import { NavLink } from 'react-router-dom';

// Definiere die Menüpunkte
const menuItems = [
  { path: '/', name: 'Dashboard' }, // Entspricht "Pokédex" oder Hauptübersicht
  { path: '/schedule', name: 'Kalender' }, // Entspricht "Pokémon" oder Zeitplan
  { path: '/tasks', name: 'Planer' }, // Entspricht "Bag" oder Aufgaben
  { path: '/pomodoro', name: 'Lerntimer' }, // Entspricht "Pokégear" oder Timer
  { path: '/profile', name: 'Profil' },
  // { path: '/save', name: 'Save' }, // Save brauchen wir nicht unbedingt
  { path: '/settings', name: 'Optionen' },
  // { path: '/exit', name: 'Exit' }, // Exit ist der Browser-Schließen-Button :)
];

const Sidebar: React.FC = () => {
  return (
    // Feste Breite für die Sidebar, GBC-Rahmen anwenden
    <aside className="gbc-border w-48 flex-shrink-0 m-4 bg-opacity-95 shadow-lg"> {/* Feste Breite, Rand, Transparenz */}
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                // className bekommt eine Funktion, um die 'active' Klasse dynamisch zu setzen
                className={({ isActive }) =>
                  `gbc-menu-text ${isActive ? 'active' : ''}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;