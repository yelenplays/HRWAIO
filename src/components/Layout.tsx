import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Importiere die neue Sidebar

const Layout: React.FC = () => {
  return (
    // Hauptcontainer mit Flexbox, nimmt ganze Höhe ein
    <div className="flex min-h-screen">
      <Sidebar /> {/* Sidebar links */}
      {/* Hauptinhaltsbereich nimmt den Rest des Platzes ein */}
      <main className="gbc-main-content">
        <Outlet /> {/* Hier werden die Seiteninhalte gerendert */}
      </main>
    </div>
  );
};

export default Layout;