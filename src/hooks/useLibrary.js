import { useState, useEffect } from "react";

// [IA] Motivo: as 4 funcionalidades escolhidas (organizar, acompanhar
// episódios, e registrar opiniões) todas dependem do mesmo "banco de dados"
// local do usuário. Em vez de repetir lógica de localStorage em cada
// página, esse hook concentra a leitura/escrita num único lugar.
// O que faz: guarda no localStorage um objeto com a lista "quero assistir",
// a lista "assistidos", as notas/comentários e o progresso de episódios
// por série — e devolve funções simples para cada ação da tela usar.
const STORAGE_KEY = "proximo-tv-time:library";

const emptyLibrary = {
  wantToWatch: {}, // { [id]: { id, mediaType, title, posterPath } }
  watched: {},     // mesma forma acima
  reviews: {},      // { [id]: { rating, comment } }
  episodeProgress: {}, // { [seriesId]: { [episodeId]: true } }
};

function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyLibrary;
  } catch {
    return emptyLibrary;
  }
}

export function useLibrary() {
  const [library, setLibrary] = useState(loadLibrary);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  function addToWantToWatch(item) {
    setLibrary((prev) => ({
      ...prev,
      wantToWatch: { ...prev.wantToWatch, [item.id]: item },
    }));
  }

  function markAsWatched(item) {
    setLibrary((prev) => {
      const nextWantToWatch = { ...prev.wantToWatch };
      delete nextWantToWatch[item.id];
      return {
        ...prev,
        wantToWatch: nextWantToWatch,
        watched: { ...prev.watched, [item.id]: item },
      };
    });
  }

  function removeFromLibrary(id) {
    setLibrary((prev) => {
      const nextWantToWatch = { ...prev.wantToWatch };
      const nextWatched = { ...prev.watched };
      delete nextWantToWatch[id];
      delete nextWatched[id];
      return { ...prev, wantToWatch: nextWantToWatch, watched: nextWatched };
    });
  }

  function setReview(id, rating, comment) {
    setLibrary((prev) => ({
      ...prev,
      reviews: { ...prev.reviews, [id]: { rating, comment } },
    }));
  }

  function toggleEpisodeWatched(seriesId, episodeId) {
    setLibrary((prev) => {
      const seriesProgress = { ...(prev.episodeProgress[seriesId] || {}) };
      if (seriesProgress[episodeId]) {
        delete seriesProgress[episodeId];
      } else {
        seriesProgress[episodeId] = true;
      }
      return {
        ...prev,
        episodeProgress: { ...prev.episodeProgress, [seriesId]: seriesProgress },
      };
    });
  }

  return {
    library,
    addToWantToWatch,
    markAsWatched,
    removeFromLibrary,
    setReview,
    toggleEpisodeWatched,
  };
}
