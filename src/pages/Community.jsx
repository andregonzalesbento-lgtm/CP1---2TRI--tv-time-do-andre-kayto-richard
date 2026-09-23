import { useEffect, useState } from "react";

import {
  FiMessageCircle,
  FiTrash2,
  FiHeart,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";

import {
  searchMulti,
  posterUrl,
} from "../services/tmdb";

function Community() {
  const [name, setName] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [posts, setPosts] = useState(() => {
    const savedPosts =
      localStorage.getItem("communityPosts");

    if (!savedPosts) {
      return [];
    }

    try {
      return JSON.parse(savedPosts);
    } catch {
      return [];
    }
  });

  // Salva publicações e curtidas
  useEffect(() => {
    localStorage.setItem(
      "communityPosts",
      JSON.stringify(posts)
    );
  }, [posts]);

  // Busca filmes e séries enquanto digita
  useEffect(() => {
    if (
      titleQuery.trim().length < 2 ||
      selectedTitle
    ) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchMulti(titleQuery)
        .then((data) => {
          const results = (data.results || [])
            .filter(
              (item) =>
                item.media_type === "movie" ||
                item.media_type === "tv"
            )
            .slice(0, 6);

          setSuggestions(results);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [titleQuery, selectedTitle]);

  function selectTitle(item) {
    setSelectedTitle(item);
    setTitleQuery(
      item.title || item.name
    );
    setSuggestions([]);
  }

  function handleTitleChange(event) {
    setTitleQuery(event.target.value);
    setSelectedTitle(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      !selectedTitle ||
      !comment.trim()
    ) {
      return;
    }

    const newPost = {
      id: Date.now(),
      name: name.trim(),
      title:
        selectedTitle.title ||
        selectedTitle.name,
      mediaType: selectedTitle.media_type,
      tmdbId: selectedTitle.id,
      posterPath:
        selectedTitle.poster_path,
      comment: comment.trim(),
      rating,
      date: new Date().toLocaleDateString(
        "pt-BR"
      ),
      likes: 0,
      liked: false,
    };

    setPosts((currentPosts) => [
      newPost,
      ...currentPosts,
    ]);

    setTitleQuery("");
    setSelectedTitle(null);
    setComment("");
    setRating(5);
  }

  function deletePost(id) {
    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== id
      )
    );
  }

  // CURTIR / DESCURTIR
  function toggleLike(id) {
    const updatedPosts = posts.map(
      (post) => {
        if (post.id !== id) {
          return post;
        }

        const isLiked = Boolean(
          post.liked
        );

        const currentLikes =
          Number(post.likes) || 0;

        return {
          ...post,
          liked: !isLiked,
          likes: isLiked
            ? Math.max(
                currentLikes - 1,
                0
              )
            : currentLikes + 1,
        };
      }
    );

    setPosts(updatedPosts);

    localStorage.setItem(
      "communityPosts",
      JSON.stringify(updatedPosts)
    );
  }

  return (
    <div className="community">

      {/* CABEÇALHO */}
      <div className="community__header">
        <FiMessageCircle />

        <div>
          <h1>Comunidade</h1>

          <p>
            Compartilhe o que você está
            assistindo e descubra recomendações
            da comunidade.
          </p>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <form
        className="community__form"
        onSubmit={handleSubmit}
      >
        <h2>Compartilhe sua opinião</h2>

        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <div className="community__movie-search">
          <input
            type="text"
            placeholder="Digite o nome do filme ou série..."
            value={titleQuery}
            onChange={handleTitleChange}
            autoComplete="off"
          />

          {suggestions.length > 0 && (
            <div className="community__suggestions">
              {suggestions.map(
                (item) => {
                  const title =
                    item.title ||
                    item.name;

                  const date =
                    item.release_date ||
                    item.first_air_date ||
                    "";

                  const year = date
                    ? date.substring(0, 4)
                    : "";

                  return (
                    <button
                      type="button"
                      className="community__suggestion"
                      key={`${item.media_type}-${item.id}`}
                      onClick={() =>
                        selectTitle(item)
                      }
                    >
                      {item.poster_path ? (
                        <img
                          src={posterUrl(
                            item.poster_path,
                            "w92"
                          )}
                          alt={title}
                        />
                      ) : (
                        <div className="community__no-poster">
                          Sem imagem
                        </div>
                      )}

                      <div>
                        <strong>
                          {title}
                        </strong>

                        <span>
                          {item.media_type ===
                          "movie"
                            ? "Filme"
                            : "Série"}

                          {year &&
                            ` • ${year}`}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* TÍTULO SELECIONADO */}
        {selectedTitle && (
          <div className="community__selected">
            <FiCheckCircle />

            <span>
              {selectedTitle.title ||
                selectedTitle.name}{" "}
              selecionado
            </span>
          </div>
        )}

        <textarea
          placeholder="O que você achou? Recomenda?"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
        />

        {/* AVALIAÇÃO */}
        <div className="community__rating">
          <span>Sua nota:</span>

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                type="button"
                key={star}
                className={
                  star <= rating
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRating(star)
                }
                aria-label={`${star} estrelas`}
              >
                <FiStar />
              </button>
            )
          )}
        </div>

        <button
          className="community__submit"
          type="submit"
        >
          Publicar
        </button>
      </form>

      {/* PUBLICAÇÕES */}
      <section className="community__posts">
        <h2>Publicações recentes</h2>

        {posts.length === 0 && (
          <p className="community__empty">
            Ainda não há publicações. Seja o
            primeiro a recomendar um filme!
          </p>
        )}

        {posts.map((post) => (
          <article
            className="community__post"
            key={post.id}
          >
            <div className="community__post-top">
              <div>
                <strong>
                  {post.name}
                </strong>

                <span>
                  {post.date}
                </span>
              </div>

              <button
                type="button"
                className="community__delete"
                onClick={() =>
                  deletePost(post.id)
                }
                title="Excluir publicação"
              >
                <FiTrash2 />
              </button>
            </div>

            <div className="community__post-content">
              {post.posterPath && (
                <img
                  className="community__post-poster"
                  src={posterUrl(
                    post.posterPath,
                    "w154"
                  )}
                  alt={post.title}
                />
              )}

              <div>
                <h3>{post.title}</h3>

                {/* ESTRELAS DA PUBLICAÇÃO */}
                <div className="community__stars">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FiStar
                        key={star}
                        className={
                          star <= post.rating
                            ? "filled"
                            : "empty"
                        }
                      />
                    )
                  )}
                </div>

                <p>{post.comment}</p>

                {/* CURTIDAS */}
                <div className="community__like-area">
                  <button
                    type="button"
                    className={`community__like ${
                      post.liked
                        ? "liked"
                        : ""
                    }`}
                    onClick={() =>
                      toggleLike(post.id)
                    }
                  >
                    <FiHeart />

                    {post.liked
                      ? "Curtido"
                      : "Curtir"}
                  </button>

                  <span>
                    {Number(
                      post.likes
                    ) || 0}{" "}
                    {(Number(
                      post.likes
                    ) || 0) === 1
                      ? "curtida"
                      : "curtidas"}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Community;