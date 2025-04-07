// src/App.tsx - Sollte so schon passen
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Stellt sicher, dass dieses Layout importiert wird
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import TasksPage from './pages/TasksPage';
import PomodoroPage from './pages/PomodoroPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}> {/* Layout als Parent */}
          <Route index element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="pomodoro" element={<PomodoroPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;