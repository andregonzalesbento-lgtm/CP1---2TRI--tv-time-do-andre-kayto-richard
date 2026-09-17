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

export function posterUrl(path, size = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
