import { Link } from "react-router-dom";
import { FiFilm, FiBookmark, FiGithub } from "react-icons/fi";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="footer__brand-title">
            <FiFilm /> A Escolha Certa
          </span>
          <p className="footer__tagline">
            Descubra filmes e séries e monte sua lista, tudo em um só lugar.
          </p>
        </div>

        <nav className="footer__links">
          <span className="footer__links-title">Navegação</span>
          <Link to="/">Início</Link>
          <Link to="/minha-lista">
            <FiBookmark /> Minha lista
          </Link>
        </nav>

        <div className="footer__credits">
          <span className="footer__links-title">Sobre</span>
          <p>
            Dados de filmes e séries fornecidos por{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
              TMDB
            </a>
            .
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {year} A Escolha Certa. Projeto acadêmico.</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="footer__github"
        >
          <FiGithub /> Código no GitHub
        </a>
      </div>
    </footer>
  );
}

export default Footer;
