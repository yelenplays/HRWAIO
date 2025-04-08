// src/App.tsx - Sollte so schon passen
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from './services/firebaseService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseService';
import Auth from './components/Auth';
import ProfilePage from './pages/ProfilePage';
import UniversityDashboard from './components/UniversityDashboard';
import PomodoroPage from './pages/PomodoroPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';
import SchedulePage from './pages/SchedulePage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pkmn-yellow"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark-mode-active' : ''}`}>
        {isLoggedIn ? (
          <>
            <Header />
            <div className="flex flex-grow">
              <Sidebar />
              <main className="flex-grow p-4 m-4 gbc-border shadow-lg">
                <Routes>
                  <Route path="/" element={<UniversityDashboard />} />
                  <Route path="/dashboard" element={<UniversityDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/pomodoro" element={<PomodoroPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;