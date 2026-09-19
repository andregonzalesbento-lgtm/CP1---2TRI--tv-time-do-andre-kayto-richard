import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FiSearch,
  FiTrendingUp,
  FiZap,
  FiSmile,
  FiTv,
  FiCalendar,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";

import {
  searchMulti,
  getTrending,
  getPopularMovies,
  getActionMovies,
  getComedyMovies,
  getAnime,
  getUpcomingMovies,
  getBrazilCinemaDates,
} from "../services/tmdb";

import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";

function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [anime, setAnime] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Carrega todas as categorias quando a página abre
  useEffect(() => {
    async function loadHome() {
      try {
        setLoading(true);
        setError(false);

        const [
          trendingData,
          popularData,
          actionData,
          comedyData,
          animeData,
          upcomingData,
        ] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getActionMovies(),
          getComedyMovies(),
          getAnime(),
          getUpcomingMovies(),
        ]);

        setTrending(trendingData.results || []);
        setPopular(popularData.results || []);
        setAction(actionData.results || []);
        setComedy(comedyData.results || []);
        setAnime(animeData.results || []);

        // Pegamos somente os 12 filmes mostrados na Home
        const upcomingMovies = (
          upcomingData.results || []
        ).slice(0, 12);

        // Consulta as datas brasileiras de cinema
        const upcomingWithCinemaDates =
          await Promise.all(
            upcomingMovies.map(async (movie) => {
              try {
                const cinemaDates =
                  await getBrazilCinemaDates(movie.id);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Procura datas de cinema que ainda vão acontecer
                const futureDates = cinemaDates.filter(
                  (release) =>
                    new Date(release.date) >= today
                );

                const nextCinemaDate = futureDates[0];

                const originalYear = movie.release_date
                  ? Number(
                      movie.release_date.substring(0, 4)
                    )
                  : null;

                const cinemaYear = nextCinemaDate
                  ? Number(
                      nextCinemaDate.date.substring(0, 4)
                    )
                  : null;

                // É relançamento quando a nova ida ao cinema
                // acontece depois do ano do lançamento original
                const isRerelease = Boolean(
                  nextCinemaDate &&
                    originalYear &&
                    cinemaYear &&
                    cinemaYear > originalYear
                );

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
                  cinemaDate: movie.release_date,
                  releaseNote: "",
                  isRerelease: false,
                };
              }
            })
          );

        setUpcoming(upcomingWithCinemaDates);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  // Busca filmes e séries
  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      setError(false);

      searchMulti(query)
        .then((data) =>
          setSearchResults(
            (data.results || []).filter(
              (item) => item.media_type !== "person"
            )
          )
        )
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const isSearching = query.trim() !== "";

  // Formata YYYY-MM-DD para DD/MM/AAAA
  function formatDate(date) {
    if (!date) {
      return "Data não informada";
    }

    return new Date(
      `${date.substring(0, 10)}T00:00:00`
    ).toLocaleDateString("pt-BR");
  }

  return (
    <div className="home">
      {!isSearching && <Hero items={trending} />}

      <input
        className="home__search"
        type="text"
        placeholder="Buscar filmes e séries..."
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
      />

      {loading && <p>Carregando...</p>}

      {error && (
        <p>
          Não foi possível carregar os títulos agora.
        </p>
      )}

      {/* RESULTADOS DA BUSCA */}
      {isSearching && !loading && !error && (
        <>
          <h2 className="section-title">
            <FiSearch />
            Resultados da busca
          </h2>

          {searchResults.length === 0 ? (
            <p>Nenhum resultado encontrado.</p>
          ) : (
            <div className="home__grid">
              {searchResults.map((item) => (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* CATEGORIAS */}
      {!isSearching && !loading && !error && (
        <>
          {/* RECOMENDADOS */}
          <section className="home__section">
            <h2 className="section-title">
              <FiTrendingUp />
              Recomendados / Mais populares
            </h2>

            <div className="home__grid">
              {popular.slice(0, 12).map((item) => (
                <MovieCard
                  key={`popular-${item.id}`}
                  item={{
                    ...item,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>

          {/* AÇÃO */}
          <section className="home__section">
            <h2 className="section-title">
              <FiZap />
              Ação
            </h2>

            <div className="home__grid">
              {action.slice(0, 12).map((item) => (
                <MovieCard
                  key={`action-${item.id}`}
                  item={{
                    ...item,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>

          {/* COMÉDIA */}
          <section className="home__section">
            <h2 className="section-title">
              <FiSmile />
              Comédia
            </h2>

            <div className="home__grid">
              {comedy.slice(0, 12).map((item) => (
                <MovieCard
                  key={`comedy-${item.id}`}
                  item={{
                    ...item,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>

          {/* ANIMES */}
          <section className="home__section">
            <h2 className="section-title">
              <FiTv />
              Animes
            </h2>

            <div className="home__grid">
              {anime.slice(0, 12).map((item) => (
                <MovieCard
                  key={`anime-${item.id}`}
                  item={{
                    ...item,
                    media_type: "tv",
                  }}
                />
              ))}
            </div>
          </section>

          {/* PRÓXIMOS LANÇAMENTOS */}
          <section className="home__section">
            <div className="home__section-header">
              <h2 className="section-title">
                <FiCalendar />
                Próximos lançamentos
              </h2>

              <Link
                to="/lancamentos"
                className="home__see-all"
              >
                Ver todos
                <FiArrowRight />
              </Link>
            </div>

            <div className="home__grid">
              {upcoming.map((item) => (
                <div
                  className="upcoming-card"
                  key={`upcoming-${item.id}`}
                >
                  <MovieCard
                    item={{
                      ...item,
                      media_type: "movie",
                    }}
                  />

                  {item.isRerelease ? (
                    <>
                      <span className="upcoming-card__rerelease">
                        <FiRefreshCw />
                        Relançamento
                      </span>

                      <span className="upcoming-card__date">
                        Nos cinemas:{" "}
                        {formatDate(item.cinemaDate)}
                      </span>

                      {item.release_date && (
                        <span className="upcoming-card__original">
                          Original:{" "}
                          {item.release_date.substring(
                            0,
                            4
                          )}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="upcoming-card__date">
                      Estreia:{" "}
                      {formatDate(item.cinemaDate)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;