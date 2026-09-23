import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiCalendar,
  FiFilm,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getUpcomingMoviesPage,
  getBrazilCinemaDates,
  posterUrl,
} from "../services/tmdb";

function Upcoming() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadUpcoming() {
      try {
        setLoading(true);
        setError(false);

        // Busca várias páginas para termos mais lançamentos
        const pages = await Promise.all([
          getUpcomingMoviesPage(1),
          getUpcomingMoviesPage(2),
          getUpcomingMoviesPage(3),
        ]);

        const allMovies = pages.flatMap(
          (page) => page.results || []
        );

        // Remove filmes repetidos
        const uniqueMovies = Array.from(
          new Map(
            allMovies.map((movie) => [
              movie.id,
              movie,
            ])
          ).values()
        );

        // Consulta as datas brasileiras de cinema
        const moviesWithDates =
          await Promise.all(
            uniqueMovies.map(async (movie) => {
              try {
                const cinemaDates =
                  await getBrazilCinemaDates(
                    movie.id
                  );

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureDates =
                  cinemaDates.filter(
                    (release) =>
                      new Date(release.date) >=
                      today
                  );

                // Preferimos uma data futura de cinema no Brasil
                const nextCinemaDate =
                  futureDates[0];

                const originalYear =
                  movie.release_date
                    ? movie.release_date.substring(
                        0,
                        4
                      )
                    : null;

                const cinemaYear =
                  nextCinemaDate
                    ? nextCinemaDate.date.substring(
                        0,
                        4
                      )
                    : null;

                const isRerelease =
                  nextCinemaDate &&
                  originalYear &&
                  cinemaYear &&
                  Number(cinemaYear) >
                    Number(originalYear);

                return {
                  ...movie,

                  cinemaDate:
                    nextCinemaDate?.date ||
                    movie.release_date,

                  releaseNote:
                    nextCinemaDate?.note || "",

                  isRerelease,
                };
              } catch {
                return {
                  ...movie,
                  cinemaDate:
                    movie.release_date,
                  releaseNote: "",
                  isRerelease: false,
                };
              }
            })
          );

        // Mantém apenas os que possuem data
        const withValidDates =
          moviesWithDates
            .filter(
              (movie) => movie.cinemaDate
            )
            .sort(
              (a, b) =>
                new Date(a.cinemaDate) -
                new Date(b.cinemaDate)
            );

        setMovies(withValidDates);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadUpcoming();
  }, []);

  function formatDate(date) {
    return new Date(
      date
    ).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function monthTitle(date) {
    const text = new Date(
      date
    ).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1)
    );
  }

  const groupedMovies = movies.reduce(
    (groups, movie) => {
      const month = monthTitle(
        movie.cinemaDate
      );

      if (!groups[month]) {
        groups[month] = [];
      }

      groups[month].push(movie);

      return groups;
    },
    {}
  );

  return (
    <div className="upcoming-page">

      {/* CABEÇALHO */}
      <div className="upcoming-page__header">
        <div>
          <h1 className="section-title">
            <FiFilm />
            Próximos lançamentos
          </h1>

          <p>
            Confira os filmes que estão chegando aos
            cinemas e fique de olho nos relançamentos.
          </p>
        </div>
      </div>

      {/* CARREGANDO */}
      {loading && (
        <p className="upcoming-page__message">
          Buscando lançamentos e datas dos cinemas...
        </p>
      )}

      {/* ERRO */}
      {error && (
        <p className="upcoming-page__message">
          Não foi possível carregar os lançamentos.
        </p>
      )}

      {/* LANÇAMENTOS AGRUPADOS POR MÊS */}
      {!loading &&
        !error &&
        Object.entries(groupedMovies).map(
          ([month, monthMovies]) => (
            <section
              className="upcoming-page__month"
              key={month}
            >
              <h2>{month}</h2>

              <div className="upcoming-page__grid">
                {monthMovies.map((movie) => (
                  <Link
                    to={`/titulo/movie/${movie.id}`}
                    className="release-card"
                    key={movie.id}
                  >
                    {movie.poster_path ? (
                      <img
                        src={posterUrl(
                          movie.poster_path,
                          "w342"
                        )}
                        alt={movie.title}
                      />
                    ) : (
                      <div className="release-card__no-image">
                        Sem imagem
                      </div>
                    )}

                    <div className="release-card__info">
                      <h3>
                        {movie.title}
                      </h3>

                      {movie.isRerelease && (
                        <span className="release-card__rerelease">
                          <FiRefreshCw />
                          Relançamento nos cinemas
                        </span>
                      )}

                      <span className="release-card__date">
                        <FiCalendar />
                        {formatDate(
                          movie.cinemaDate
                        )}
                      </span>

                      {movie.isRerelease &&
                        movie.release_date && (
                          <span className="release-card__original">
                            Lançamento original:{" "}
                            {movie.release_date.substring(
                              0,
                              4
                            )}
                          </span>
                        )}

                      {movie.releaseNote && (
                        <span className="release-card__note">
                          {movie.releaseNote}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        )}
    </div>
  );
}

export default Upcoming;