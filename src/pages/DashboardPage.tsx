import React from 'react';
import UniversityDashboard from '../components/UniversityDashboard';
// Später: Widgets importieren

const DashboardPage: React.FC = () => {
  return (
    // Eine Box für den Seiteninhalt
    <div className="gbc-border">
      <h2 className='text-lg font-bold mb-2'>DASHBOARD</h2>
      <div className="space-y-6">
        <UniversityDashboard />
        {/* Other dashboard widgets can be added here */}
      </div>
    </div>
  );
};

export default DashboardPage;