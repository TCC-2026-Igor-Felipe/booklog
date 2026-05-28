import { Link } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <h2>Booklog</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Pesquisa</Link>
        </li>
        <li>
          <Link to="/estante">Minha Estante</Link>
        </li>
        <li>
          <Link to="/perfil">Perfil</Link>
        </li>
      </ul>
    </nav>
  );
}