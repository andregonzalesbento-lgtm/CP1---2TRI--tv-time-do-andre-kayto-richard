import { Link } from "react-router-dom";
import { FiFilm, FiBookmark } from "react-icons/fi";

// Componente simples: só recebe a estrutura de navegação, sem lógica.
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <FiFilm /> A Escolha Certa
      </Link>
      <Link to="/minha-lista" className="navbar__link">
        <FiBookmark /> Minha lista
      </Link>
    </nav>
  );
}

export default Navbar;
