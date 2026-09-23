import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiCheckCircle, FiStar, FiTrash2, FiFilm } from "react-icons/fi";
import { useLibrary } from "../hooks/useLibrary";
import { posterUrl } from "../services/tmdb";

// [IA] Motivo: pesquisei rapidamente como Netflix, Letterboxd e o próprio
// TV Time organizam a tela de lista pessoal — todos usam abas separando
// "quero ver" de "já visto" em vez de duas listas soltas na mesma página,
// e mostram a nota por cima do pôster ao passar o mouse. Pedi ajuda pra
// montar essa mesma estrutura aqui com uma aba controlada por useState
// (mesmo padrão já usado na busca da Home), sem mudar nada do useLibrary.
// O que faz: mostra um resumo no topo e duas abas com grade de pôsteres;
// passando o mouse aparece a opção de remover e, se já assistido, a nota.
function MyList() {
  const { library, removeFromLibrary } = useLibrary();
  const [activeTab, setActiveTab] = useState("wantToWatch");

  const wantToWatch = Object.values(library.wantToWatch);
  const watched = Object.values(library.watched);
  const items = activeTab === "wantToWatch" ? wantToWatch : watched;

  return (
    <div className="my-list">
      <header className="my-list__header">
        <h1>Minha lista</h1>
        <p className="my-list__subtitle">
          {wantToWatch.length + watched.length === 0
            ? "Ainda vazia — comece adicionando algo pela página de detalhes."
            : `${wantToWatch.length} para assistir · ${watched.length} já assistidos`}
        </p>
      </header>

      <div className="my-list__tabs">
        <button
          type="button"
          className={`my-list__tab${activeTab === "wantToWatch" ? " my-list__tab--active" : ""}`}
          onClick={() => setActiveTab("wantToWatch")}
        >
          <FiBookmark /> Quero assistir ({wantToWatch.length})
        </button>

        <button
          type="button"
          className={`my-list__tab${activeTab === "watched" ? " my-list__tab--active" : ""}`}
          onClick={() => setActiveTab("watched")}
        >
          <FiCheckCircle /> Já assisti ({watched.length})
        </button>
      </div>

      {items.length === 0 ? (
        <div className="my-list__empty">
          <FiFilm />
          <p>
            {activeTab === "wantToWatch"
              ? "Você ainda não adicionou nada aqui."
              : "Você ainda não marcou nada como assistido."}
          </p>
          <Link to="/" className="my-list__empty-link">
            Explorar filmes e séries
          </Link>
        </div>
      ) : (
        <div className="my-list__grid">
          {items.map((item) => {
            const review = library.reviews[item.id];

            return (
              <div key={item.id} className="my-list__item">
                <Link to={`/titulo/${item.mediaType}/${item.id}`} className="my-list__poster">
                  {posterUrl(item.posterPath) ? (
                    <img src={posterUrl(item.posterPath)} alt={item.title} />
                  ) : (
                    <div className="my-list__no-image">Sem imagem</div>
                  )}

                  {activeTab === "watched" && review?.rating > 0 && (
                    <span className="my-list__rating-badge">
                      <FiStar /> {review.rating}/5
                    </span>
                  )}

                  <div className="my-list__overlay">
                    <button
                      type="button"
                      className="my-list__remove"
                      onClick={(event) => {
                        event.preventDefault();
                        removeFromLibrary(item.id);
                      }}
                      aria-label={`Remover ${item.title}`}
                    >
                      <FiTrash2 /> Remover
                    </button>
                  </div>
                </Link>

                <span className="my-list__title">{item.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyList;
