import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';

interface UniversityData {
  totalCredits: number;
  gpa: number;
  remainingModules: number;
}

const UniversityDashboard: React.FC = () => {
  const [universityData, setUniversityData] = useState<UniversityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = firebaseService.getCurrentUser();
        if (!user) {
          setError('Bitte melden Sie sich an, um Ihre Universitätsdaten anzuzeigen');
          return;
        }

        const data = await firebaseService.getUserData(user.username);
        if (data && data.universityData) {
          setUniversityData(data.universityData);
        } else {
          setUniversityData(null); // Ensure data is cleared if not found
          // No error here, just show the empty state
        }
      } catch (err) {
        setError('Fehler beim Laden der Universitätsdaten');
        console.error('Error loading university data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Navigation to settings for import
  const navigateToSettings = () => {
    // Assuming you have a navigate function from react-router-dom
    // If not, this needs to be adjusted based on your routing setup
    // Example: navigate('/settings');
    alert('Navigiere zu den Optionen, um Daten zu importieren.');
    // Ideally, use the actual navigation function here
    window.location.href = '/settings'; // Simple browser navigation as fallback
  };

  if (isLoading) {
    return (
      <div className="gbc-border p-4">
        <h2 className='text-lg font-bold mb-3'>LADEN...</h2>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pkmn-yellow mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="gbc-border p-4">
      <h2 className='text-lg font-bold mb-3'>DASHBOARD</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}
      
      {universityData ? (
        <div className="pkmn-dashboard-grid">
          <div className="pkmn-dashboard-item">
            <h3>Gesamt Credits</h3>
            <p>{universityData.totalCredits}</p>
          </div>
          <div className="pkmn-dashboard-item">
            <h3>Notendurchschnitt</h3>
            <p>{universityData.gpa.toFixed(2)}</p>
          </div>
          <div className="pkmn-dashboard-item">
            <h3>Verbleibende Module</h3>
            <p>{universityData.remainingModules}</p>
          </div>
        </div>
      ) : (
        <div className="pkmn-dashboard-empty">
          <p>Keine Universitätsdaten gefunden.</p>
          <button onClick={navigateToSettings} className="pkmn-button">
            Daten importieren (in Optionen)
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard; 