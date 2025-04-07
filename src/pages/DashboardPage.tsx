import React from 'react';
// Später: Widgets importieren

const DashboardPage: React.FC = () => {
  return (
    // Eine Box für den Seiteninhalt
    <div className="gbc-border">
      <h2 className='text-lg font-bold mb-2'>DASHBOARD</h2>
       <p className="dialog-text">Hier kommt dein Dashboard-Inhalt hin (Widgets etc.)</p>
      {/* Hier kommen später die Widgets rein */}
    </div>
  );
};
export default DashboardPage;