import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
  const [isLightMode, setIsLightMode] = useState(() => {
    return window.localStorage.getItem('booklog_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      window.localStorage.setItem('booklog_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      window.localStorage.setItem('booklog_theme', 'dark');
    }
  }, [isLightMode]);

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <h2>Booklog</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Pesquisa</Link></li>
        <li><Link to="/estante">Minha Estante</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/estatisticas">Estatísticas</Link></li>
        <li><Link to="/listas">Listas</Link></li>
        <li>
          <button 
            className="theme-toggle" 
            onClick={() => setIsLightMode(!isLightMode)}
            title="Alternar tema"
          >
            {isLightMode ? '🌙' : '☀️'}
          </button>
        </li>
      </ul>
    </nav>
  );
}