import { useState, useEffect } from "react";
import { getSeasonEpisodes } from "../services/tmdb";

// [IA] Motivo: acompanhar episódios exige combinar duas coisas que mudam de
// forma independente — os episódios de uma temporada (vêm da API, mudam
// quando o usuário troca de temporada) e quais desses episódios já foram
// marcados (vêm do hook useLibrary, guardado no localStorage). Esse
// componente existe para isolar essa combinação e não espalhar fetch de
// episódio pelas outras telas.
// O que faz: busca os episódios da temporada selecionada, mostra a lista
// com checkbox de "assistido" e calcula o progresso (x/y episódios) da
// série inteira somando o progresso salvo de todas as temporadas.
function EpisodeTracker({ seriesId, seasons, progress, onToggleEpisode }) {
  const [selectedSeason, setSelectedSeason] = useState(
    seasons?.[0]?.season_number ?? 1
  );
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSeasonEpisodes(seriesId, selectedSeason)
      .then((data) => setEpisodes(data.episodes || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoading(false));
  }, [seriesId, selectedSeason]);

  const totalEpisodes = seasons.reduce(
    (sum, season) => sum + (season.episode_count || 0),
    0
  );
  const watchedCount = Object.keys(progress || {}).length;

  return (
    <div className="episode-tracker">
      <p className="episode-tracker__progress">
        Progresso: {watchedCount}/{totalEpisodes} episódios
      </p>

      <div className="episode-tracker__seasons">
        {seasons
          .filter((season) => season.season_number > 0)
          .map((season) => (
            <button
              key={season.id}
              type="button"
              className={season.season_number === selectedSeason ? "active" : ""}
              onClick={() => setSelectedSeason(season.season_number)}
            >
              Temp. {season.season_number}
            </button>
          ))}
      </div>

      {loading ? (
        <p>Carregando episódios...</p>
      ) : (
        <ul className="episode-tracker__list">
          {episodes.map((episode) => (
            <li key={episode.id}>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(progress?.[episode.id])}
                  onChange={() => onToggleEpisode(episode.id)}
                />
                {episode.episode_number}. {episode.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EpisodeTracker;
