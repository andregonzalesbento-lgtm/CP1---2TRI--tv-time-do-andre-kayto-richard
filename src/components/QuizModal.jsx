import { useState } from "react";
import { FiX, FiRefreshCw, FiFilm } from "react-icons/fi";
import { discoverByGenre } from "../services/tmdb";
import MovieCard from "./MovieCard";

// [IA] Motivo: pedi ajuda para desenhar um quiz curto (3 perguntas) que
// converte as respostas em ids de gênero do TMDB e para decidir a melhor
// forma de guardar isso sem criar um hook novo — como as respostas só
// interessam enquanto o modal está aberto, tudo fica em useState aqui
// dentro, do mesmo jeito que o resto do projeto já guarda estado local.
// O que faz: pergunta o clima, se é pra filme ou série, e o tipo de
// história, junta os gêneros escolhidos e busca recomendações na TMDB.
const MOVIE_GENRES = {
  acao: 28,
  comedia: 35,
  drama: 18,
  misterio: 9648,
  ficcao: 878,
  realista: 80,
};

const TV_GENRES = {
  acao: 10759,
  comedia: 35,
  drama: 18,
  misterio: 9648,
  ficcao: 10765,
  realista: 80,
};

const QUESTIONS = [
  {
    id: "clima",
    title: "Qual clima combina com você agora?",
    options: [
      { label: "Ação e adrenalina", value: "acao" },
      { label: "Rir sem parar", value: "comedia" },
      { label: "Emoção e drama", value: "drama" },
      { label: "Mistério e suspense", value: "misterio" },
    ],
  },
  {
    id: "formato",
    title: "Você quer resolver em 2 horas ou maratonar?",
    options: [
      { label: "Filme — resolve hoje", value: "movie" },
      { label: "Série — quero maratonar", value: "tv" },
    ],
  },
  {
    id: "universo",
    title: "Que tipo de história te atrai mais?",
    options: [
      { label: "Ficção científica ou fantasia", value: "ficcao" },
      { label: "Algo mais realista, do mundo atual", value: "realista" },
    ],
  },
];

function QuizModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleAnswer(questionId, value) {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    runQuiz(nextAnswers);
  }

  async function runQuiz(finalAnswers) {
    setLoading(true);
    setError(false);

    const mediaType = finalAnswers.formato || "movie";
    const genreMap = mediaType === "tv" ? TV_GENRES : MOVIE_GENRES;

    const genreIds = [
      genreMap[finalAnswers.clima],
      genreMap[finalAnswers.universo],
    ].filter(Boolean);

    try {
      const data = await discoverByGenre(mediaType, genreIds);
      const items = (data.results || [])
        .slice(0, 6)
        .map((item) => ({ ...item, media_type: mediaType }));
      setResults(items);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setResults(null);
    setError(false);
  }

  const currentQuestion = QUESTIONS[step];
  const isFinished = results !== null || error;

  return (
    <div className="quiz-modal__overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="quiz-modal__close"
          onClick={onClose}
          aria-label="Fechar quiz"
        >
          <FiX />
        </button>

        <header className="quiz-modal__header">
          <FiFilm />
          <span>Não sabe o que assistir?</span>
        </header>

        {!isFinished && !loading && (
          <>
            <div className="quiz-modal__progress">
              {QUESTIONS.map((question, index) => (
                <span
                  key={question.id}
                  className={`quiz-modal__step-dot${
                    index <= step ? " quiz-modal__step-dot--active" : ""
                  }`}
                />
              ))}
            </div>

            <h3 className="quiz-modal__question">{currentQuestion.title}</h3>

            <div className="quiz-modal__options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="quiz-modal__option"
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        {loading && <p className="quiz-modal__loading">Procurando algo bom pra você...</p>}

        {error && (
          <p className="quiz-modal__loading">
            Não consegui buscar recomendações agora. Tenta de novo?
          </p>
        )}

        {results && (
          <>
            <p className="quiz-modal__result-title">
              É isso que você deveria estar assistindo:
            </p>

            <div className="quiz-modal__results">
              {results.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          </>
        )}

        {isFinished && (
          <button type="button" className="quiz-modal__restart" onClick={handleRestart}>
            <FiRefreshCw /> Refazer quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizModal;
