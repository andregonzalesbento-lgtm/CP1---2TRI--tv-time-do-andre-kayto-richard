import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiCalendar,
  FiClock,
  FiFilm,
  FiMonitor,
  FiPlayCircle,
  FiStar,
  FiUsers,
} from "react-icons/fi";

import {
  getDetails,
  getWatchProviders,
  getVideos,
  getCredits,
  posterUrl,
} from "../services/tmdb";

import ProviderList from "../components/ProviderList";
import RatingStars from "../components/RatingStars";
import EpisodeTracker from "../components/EpisodeTracker";
import { useLibrary } from "../hooks/useLibrary";

function TitleDetails() {
  const { mediaType, id } = useParams();

  const [details, setDetails] = useState(null);
  const [providers, setProviders] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);

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

    Promise.all([
      getDetails(mediaType, id),
      getWatchProviders(mediaType, id),
      getVideos(mediaType, id),
      getCredits(mediaType, id),
    ])
      .then(
        ([
          detailsData,
          providersData,
          videosData,
          creditsData,
        ]) => {
          setDetails(detailsData);

          setProviders(
            providersData.results?.BR?.flatrate || []
          );

          const videos = videosData.results || [];

          const officialTrailer = videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official
          );

          const anyTrailer = videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer"
          );

          setTrailer(
            officialTrailer || anyTrailer || null
          );

          setCast(
            (creditsData.cast || []).slice(0, 8)
          );
        }
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error || !details) {
    return (
      <p>
        Não foi possível carregar esse título.
      </p>
    );
  }

  const title =
    details.title || details.name;

  const releaseDate =
    details.release_date ||
    details.first_air_date ||
    "";

  const year = releaseDate
    ? releaseDate.substring(0, 4)
    : "Não informado";

  const isWatched = Boolean(
    library.watched[id]
  );

  const isWantToWatch = Boolean(
    library.wantToWatch[id]
  );

  const review = library.reviews[id] || {
    rating: 0,
    comment: "",
  };

  const libraryItem = {
    id,
    mediaType,
    title,
    posterPath: details.poster_path,
  };

  function handleRate(rating) {
    setReview(
      id,
      rating,
      comment || review.comment
    );
  }

  function handleSaveComment() {
    setReview(
      id,
      review.rating,
      comment
    );
  }

  function formatRuntime(minutes) {
    if (!minutes) {
      return null;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    return `${hours}h ${remainingMinutes}min`;
  }

  const runtime =
    mediaType === "movie"
      ? formatRuntime(details.runtime)
      : details.episode_run_time?.[0]
        ? `${details.episode_run_time[0]} min por episódio`
        : null;

  return (
    <div className="title-details">
      <div className="title-details__header">
        {posterUrl(details.poster_path) && (
          <img
            src={posterUrl(details.poster_path)}
            alt={title}
          />
        )}

        <div className="title-details__main">
          <h1>{title}</h1>

          <div className="title-details__meta">
            <span>
              <FiCalendar /> {year}
            </span>

            {runtime && (
              <span>
                <FiClock /> {runtime}
              </span>
            )}

            {details.vote_average > 0 && (
              <span>
                <FiStar />{" "}
                {details.vote_average.toFixed(1)} / 10
              </span>
            )}

            {mediaType === "tv" &&
              details.number_of_seasons && (
                <span>
                  <FiMonitor />{" "}
                  {details.number_of_seasons}{" "}
                  {details.number_of_seasons === 1
                    ? "temporada"
                    : "temporadas"}
                </span>
              )}
          </div>

          {details.genres?.length > 0 && (
            <div className="title-details__genres">
              {details.genres.map((genre) => (
                <span key={genre.id}>
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="title-details__overview">
            {details.overview ||
              "Sinopse não disponível."}
          </p>

          <div className="title-details__actions">
            {!isWantToWatch && !isWatched && (
              <button
                onClick={() =>
                  addToWantToWatch(libraryItem)
                }
              >
                Quero assistir
              </button>
            )}

            {!isWatched && (
              <button
                onClick={() =>
                  markAsWatched(libraryItem)
                }
              >
                Marcar como assistido
              </button>
            )}

            {isWatched && (
              <span>Assistido</span>
            )}
          </div>

          <h3>Onde assistir</h3>

          <ProviderList providers={providers} />
        </div>
      </div>

      {trailer && (
        <section className="title-details__trailer">
          <h2 className="section-title">
            <FiPlayCircle />
            Trailer
          </h2>

          <div className="title-details__video">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`Trailer de ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {cast.length > 0 && (
        <section className="title-details__cast">
          <h2 className="section-title">
            <FiUsers />
            Elenco principal
          </h2>

          <div className="title-details__cast-grid">
            {cast.map((person) => (
              <Link
                to={`/pessoa/${person.id}`}
                className="cast-card"
                key={
                  person.cast_id ||
                  person.credit_id ||
                  person.id
                }
              >
                {person.profile_path ? (
                  <img
                    src={posterUrl(
                      person.profile_path,
                      "w185"
                    )}
                    alt={person.name}
                  />
                ) : (
                  <div className="cast-card__no-photo">
                    Sem foto
                  </div>
                )}

                <strong>{person.name}</strong>

                {person.character && (
                  <span>{person.character}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {isWatched && (
        <section className="title-details__review">
          <h3>Minha opinião</h3>

          <RatingStars
            rating={review.rating}
            onRate={handleRate}
          />

          <textarea
            placeholder="O que você achou?"
            value={comment || review.comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            onBlur={handleSaveComment}
          />
        </section>
      )}

      {mediaType === "tv" &&
        details.seasons && (
          <section className="title-details__episodes">
            <h3 className="section-title">
              <FiFilm />
              Episódios
            </h3>

            <EpisodeTracker
              seriesId={id}
              seasons={details.seasons}
              progress={
                library.episodeProgress[id]
              }
              onToggleEpisode={(episodeId) =>
                toggleEpisodeWatched(
                  id,
                  episodeId
                )
              }
            />
          </section>
        )}
    </div>
  );
}

export default TitleDetails;