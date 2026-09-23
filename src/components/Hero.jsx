import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { posterUrl } from "../services/tmdb";

// [IA] Motivo: o carrossel "coverflow" (card do meio grande, vizinhos menores
// e desfocados dos lados) e o auto-play foram pedidos com base em uma
// gravação de referência. Pedi ajuda para calcular a posição/escala de cada
// card a partir da distância até o índice ativo e para o timer de troca
// automática — a lógica de estado (useState/useEffect) e o restante dos
// componentes continuam no mesmo nível já usado no projeto.
// O que faz: mostra os títulos em destaque girando sozinho a cada poucos
// segundos, pausa quando o mouse passa por cima e permite trocar o slide
// clicando nos cards dos lados ou nas setas.
function Hero({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const carouselItems = items ? items.slice(0, 7) : [];

  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timerRef.current);
  }, [isPaused, carouselItems.length]);

  if (carouselItems.length === 0) return null;

  const current = carouselItems[currentIndex];
  const currentTitle = current.title || current.name;
  const currentMediaType = current.media_type;

  function goToPrevious() {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  }

  function goToNext() {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel__glow" />

      <div className="hero-carousel__track">
        {carouselItems.map((item, index) => {
          const offset = index - currentIndex;
          const distance = Math.abs(offset);
          const poster = posterUrl(item.poster_path, "w342");

          const cardStyle = {
            backgroundImage: poster ? `url(${poster})` : undefined,
            transform: `translate(-50%, -50%) translateX(${offset * 62}%) scale(${
              offset === 0 ? 1 : 0.78
            })`,
            opacity: distance > 2 ? 0 : 1 - distance * 0.3,
            zIndex: 10 - distance,
          };

          return (
            <button
              key={item.id}
              type="button"
              className={`hero-carousel__card${
                offset === 0 ? " hero-carousel__card--active" : ""
              }`}
              style={cardStyle}
              onClick={() => setCurrentIndex(index)}
              aria-label={item.title || item.name}
            />
          );
        })}
      </div>

      <div className="hero-carousel__info">
        <strong>{currentTitle}</strong>
        <span>
          <FaStar /> {current.vote_average ? current.vote_average.toFixed(1) : "-"}/10
          {" · "}
          {currentMediaType === "movie" ? "Filme" : "Série"}
        </span>
      </div>

      <div className="hero-carousel__controls">
        <button
          type="button"
          className="hero-carousel__nav-btn"
          onClick={goToPrevious}
          aria-label="Anterior"
        >
          <FiChevronLeft />
        </button>

        <Link
          to={`/titulo/${currentMediaType}/${current.id}`}
          className="hero-carousel__details-btn"
        >
          Ver detalhes <FiArrowUpRight />
        </Link>

        <button
          type="button"
          className="hero-carousel__nav-btn"
          onClick={goToNext}
          aria-label="Próximo"
        >
          <FiChevronRight />
        </button>
      </div>

      <div className="hero-carousel__dots">
        {carouselItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`hero-carousel__dot${
              index === currentIndex ? " hero-carousel__dot--active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
