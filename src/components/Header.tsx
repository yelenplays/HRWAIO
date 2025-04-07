import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'; // NavLink für active class

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const controlNavbar = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  return (
    <header className={`pkmn-header ${isVisible ? '' : 'header-hidden'}`}>
      <nav className="flex justify-center items-center">
        {/* NavLink fügt automatisch die 'active' Klasse hinzu */}
        <NavLink to="/">Status</NavLink>
        <NavLink to="/schedule">Calendar</NavLink>
        <NavLink to="/tasks">Quest Log</NavLink>
        <NavLink to="/pomodoro">Timer</NavLink>
        <NavLink to="/settings">Options</NavLink>
      </nav>
    </header>
  );
};

export default Header;