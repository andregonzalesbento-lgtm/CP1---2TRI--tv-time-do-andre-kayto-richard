import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDetails, getWatchProviders, posterUrl } from "../services/tmdb";
import ProviderList from "../components/ProviderList";
import RatingStars from "../components/RatingStars";
import EpisodeTracker from "../components/EpisodeTracker";
import { useLibrary } from "../hooks/useLibrary";

function TitleDetails() {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [comment, setComment] = useState("");

  const {
    library,
    addToWantToWatch,
    markAsWatched,
    setReview,
    toggleEpisodeWatched,
  } = useLibrary();

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([getDetails(mediaType, id), getWatchProviders(mediaType, id)])
      .then(([detailsData, providersData]) => {
        setDetails(detailsData);
        setProviders(providersData.results?.BR?.flatrate || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  if (loading) return <p>Carregando...</p>;
  if (error || !details) return <p>Não foi possível carregar esse título.</p>;

  const title = details.title || details.name;
  const isWatched = Boolean(library.watched[id]);
  const isWantToWatch = Boolean(library.wantToWatch[id]);
  const review = library.reviews[id] || { rating: 0, comment: "" };

  const libraryItem = {
    id,
    mediaType,
    title,
    posterPath: details.poster_path,
  };

  function handleRate(rating) {
    setReview(id, rating, comment || review.comment);
  }

  function handleSaveComment() {
    setReview(id, review.rating, comment);
  }

  return (
    <div className="title-details">
      <div className="title-details__header">
        {posterUrl(details.poster_path) && (
          <img src={posterUrl(details.poster_path)} alt={title} />
        )}
        <div>
          <h1>{title}</h1>
          <p>{details.overview}</p>

          <div className="title-details__actions">
            {!isWantToWatch && !isWatched && (
              <button onClick={() => addToWantToWatch(libraryItem)}>
                Quero assistir
              </button>
            )}
            {!isWatched && (
              <button onClick={() => markAsWatched(libraryItem)}>
                Marcar como assistido
              </button>
            )}
            {isWatched && <span>Assistido ✔</span>}
          </div>

          <h3>Onde assistir</h3>
          <ProviderList providers={providers} />
        </div>
      </div>

      {isWatched && (
        <section className="title-details__review">
          <h3>Minha opinião</h3>
          <RatingStars rating={review.rating} onRate={handleRate} />
          <textarea
            placeholder="O que você achou?"
            value={comment || review.comment}
            onChange={(event) => setComment(event.target.value)}
            onBlur={handleSaveComment}
          />
        </section>
      )}

      {mediaType === "tv" && details.seasons && (
        <section className="title-details__episodes">
          <h3>Episódios</h3>
          <EpisodeTracker
            seriesId={id}
            seasons={details.seasons}
            progress={library.episodeProgress[id]}
            onToggleEpisode={(episodeId) => toggleEpisodeWatched(id, episodeId)}
          />
        </section>
      )}
    </div>
  );
}

export default TitleDetails;
