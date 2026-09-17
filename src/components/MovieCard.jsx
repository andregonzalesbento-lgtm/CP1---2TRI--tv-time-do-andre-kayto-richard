import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";

// Recebe o título via props e mostra um card clicável para a página de detalhes.
function MovieCard({ item }) {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  return (
    <Link to={`/titulo/${mediaType}/${item.id}`} className="movie-card">
      {posterUrl(item.poster_path) ? (
        <img src={posterUrl(item.poster_path)} alt={title} />
      ) : (
        <div className="movie-card__no-image">Sem imagem</div>
      )}
      <div className="movie-card__info">
        <strong>{title}</strong>
        {year && <span>{year}</span>}
      </div>
    </Link>
  );
}

export default MovieCard;
