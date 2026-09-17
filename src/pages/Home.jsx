import { useState, useEffect } from "react";
import { searchMulti, getTrending } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";

function Home() {
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Carrega os títulos em alta assim que a página abre (usados no Hero e na grade)
  useEffect(() => {
    setLoading(true);
    getTrending()
      .then((data) => setTrending(data.results || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Refaz a busca sempre que o usuário digita (com um pequeno delay)
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
          setSearchResults((data.results || []).filter((item) => item.media_type !== "person"))
        )
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const isSearching = query.trim() !== "";
  const listToShow = isSearching ? searchResults : trending;

  return (
    <div className="home">
      {!isSearching && <Hero items={trending} />}

      <input
        className="home__search"
        type="text"
        placeholder="Buscar filmes e séries..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <h2>{isSearching ? "Resultados da busca" : "Populares da semana"}</h2>

      {loading && <p>Carregando...</p>}
      {error && <p>Não foi possível carregar os títulos agora.</p>}
      {!loading && !error && listToShow.length === 0 && <p>Nenhum resultado encontrado.</p>}

      <div className="home__grid">
        {listToShow.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;
