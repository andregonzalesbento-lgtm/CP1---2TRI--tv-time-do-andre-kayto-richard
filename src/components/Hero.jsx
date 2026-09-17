import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { posterUrl } from "../services/tmdb";

// Recebe os títulos em destaque (já buscados na API pela Home) via props
// e monta os cards grandes com imagem de fundo, nota e título por cima.
function Hero({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="hero">
      {items.slice(0, 3).map((item) => {
        const title = item.title || item.name;
        const mediaType = item.media_type;
        const backdrop = posterUrl(item.backdrop_path || item.poster_path, "w780");

        return (
          <Link
            key={item.id}
            to={`/titulo/${mediaType}/${item.id}`}
            className="hero__card"
            style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
          >
            <span className="hero__badge">
              <FaStar /> {item.vote_average ? item.vote_average.toFixed(1) : "-"}/10
            </span>
            <div className="hero__info">
              <strong>{title}</strong>
              <span>{mediaType === "movie" ? "Filme" : "Série"}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Hero;
