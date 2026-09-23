// [IA] Motivo: centralizar as chamadas à API do TMDB em um único lugar,
// evitando repetir a URL base e a chave de API em cada componente.
// O que faz: monta a URL, adiciona a key automaticamente e já devolve
// o JSON pronto (ou lança um erro que o useEffect que chamou pode tratar).
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "pt-BR";

async function tmdbFetch(path, params = {}) {
  const url = new URL(BASE_URL + path);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", LANGUAGE);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Falha ao buscar dados na TMDB");
  }
  return response.json();
}

// Busca filmes e séries pelo texto digitado na busca
export function searchMulti(query) {
  return tmdbFetch("/search/multi", { query, include_adult: "false" });
}

// Detalhes de um filme ou série (mediaType: "movie" | "tv")
export function getDetails(mediaType, id) {
  return tmdbFetch(`/${mediaType}/${id}`);
}

// Lista de episódios de uma temporada específica de uma série
export function getSeasonEpisodes(seriesId, seasonNumber) {
  return tmdbFetch(`/tv/${seriesId}/season/${seasonNumber}`);
}

// Onde assistir (watch providers) um filme ou série
export function getWatchProviders(mediaType, id) {
  return tmdbFetch(`/${mediaType}/${id}/watch/providers`);
}

// Título em destaque para a home (populares da semana)
export function getTrending() {
  return tmdbFetch("/trending/all/week");
}
export function getPopularMovies() {
  return tmdbFetch("/movie/popular", {
    include_adult: "false",
    page: "1",
  });
}

// Filmes de ação
export function getActionMovies() {
  return tmdbFetch("/discover/movie", {
    with_genres: "28",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: "1",
  });
}

// Filmes de comédia
export function getComedyMovies() {
  return tmdbFetch("/discover/movie", {
    with_genres: "35",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: "1",
  });
}

// Animes / animações
export function getAnime() {
  return tmdbFetch("/discover/tv", {
    with_genres: "16",
    with_origin_country: "JP",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: "1",
  });
}

// Próximos lançamentos no cinema
export function getUpcomingMovies() {
  return tmdbFetch("/movie/upcoming", {
    region: "BR",
    page: "1",
  });
}

// Próximos lançamentos - permite buscar várias páginas
export function getUpcomingMoviesPage(page = 1) {
  return tmdbFetch("/movie/upcoming", {
    region: "BR",
    page: String(page),
  });
}

// Datas de lançamento de um filme por país
export function getMovieReleaseDates(movieId) {
  return tmdbFetch(`/movie/${movieId}/release_dates`);
}

// Procura as datas de cinema de um filme no Brasil
export async function getBrazilCinemaDates(movieId) {
  const data = await getMovieReleaseDates(movieId);

  const brazil = (data.results || []).find(
    (country) => country.iso_3166_1 === "BR"
  );

  if (!brazil) {
    return [];
  }

  return (brazil.release_dates || [])
    .filter(
      (release) =>
        release.type === 2 || release.type === 3
    )
    .map((release) => ({
      date: release.release_date,
      type: release.type,
      note: release.note || "",
    }))
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );
}

// Vídeos e trailers de filmes e séries
export function getVideos(mediaType, id) {
  return tmdbFetch(`/${mediaType}/${id}/videos`);
}

// Elenco de filmes e séries
export function getCredits(mediaType, id) {
  return tmdbFetch(`/${mediaType}/${id}/credits`);
}

// Busca os dados de um ator ou atriz
export function getPersonDetails(personId) {
  return tmdbFetch(`/person/${personId}`);
}

// Busca filmes e séries em que a pessoa participou
export function getPersonCredits(personId) {
  return tmdbFetch(`/person/${personId}/combined_credits`);
}


// [IA] Motivo: o quiz "o que assistir" precisa buscar filmes/séries por
// combinações de gênero (ex.: ação + filme, comédia + série) sem repetir a
// mesma chamada em cada pergunta. Pedi ajuda pra deixar essa função genérica,
// reaproveitando o tmdbFetch que já existia.
// O que faz: recebe o tipo (movie/tv) e uma lista de ids de gênero do TMDB
// e devolve os títulos mais populares que combinam com aquele gênero.
export function discoverByGenre(mediaType, genreIds) {
  return tmdbFetch(`/discover/${mediaType}`, {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    include_adult: "false",
    "vote_count.gte": "50",
    page: "1",
  });
}

export function posterUrl(path, size = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
