import { Link } from "react-router-dom";
import {
  FiFilm,
  FiBookmark,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <FiFilm /> A Escolha Certa
      </Link>

      <div className="navbar__links">
        <Link to="/minha-lista" className="navbar__link">
          <FiBookmark /> Minha lista
        </Link>

        <Link to="/lancamentos" className="navbar__link">
          <FiCalendar /> Lançamentos
        </Link>

        <Link to="/comunidade" className="navbar__link">
          <FiUsers /> Comunidade
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;