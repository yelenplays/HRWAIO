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
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/schedule" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Kalender
        </NavLink>
        <NavLink 
          to="/tasks" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Planer
        </NavLink>
        <NavLink 
          to="/pomodoro" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Lerntimer
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Profil
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `pkmn-nav-link ${isActive ? 'pkmn-nav-link-active' : ''}`
          }
        >
          Optionen
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;