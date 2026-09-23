import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiFilm,
  FiUser,
} from "react-icons/fi";

import {
  getPersonDetails,
  getPersonCredits,
  posterUrl,
} from "../services/tmdb";

function PersonDetails() {
  const { id } = useParams();

  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPerson() {
      try {
        setLoading(true);
        setError(false);

        const [personData, creditsData] =
          await Promise.all([
            getPersonDetails(id),
            getPersonCredits(id),
          ]);

        setPerson(personData);

        const validCredits = (creditsData.cast || [])
          .filter(
            (item) =>
              (item.media_type === "movie" ||
                item.media_type === "tv") &&
              item.poster_path
          )
          .sort(
            (a, b) =>
              (b.vote_count || 0) -
              (a.vote_count || 0)
          )
          .slice(0, 12);

        setCredits(validCredits);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPerson();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error || !person) {
    return (
      <p>
        Não foi possível carregar as informações.
      </p>
    );
  }

  function formatDate(date) {
    if (!date) return null;

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("pt-BR");
  }

  function translateDepartment(department) {
    const translations = {
      Acting: "Atuação",
      Directing: "Direção",
      Production: "Produção",
      Writing: "Roteiro",
      Editing: "Edição",
      Camera: "Fotografia",
      Sound: "Som",
    };

    return translations[department] || department;
  }

  return (
    <div className="person-details">
      <div className="person-details__header">
        {person.profile_path ? (
          <img
            className="person-details__photo"
            src={posterUrl(
              person.profile_path,
              "w500"
            )}
            alt={person.name}
          />
        ) : (
          <div className="person-details__no-photo">
            Sem foto
          </div>
        )}

        <div className="person-details__info">
          <h1>{person.name}</h1>

          {person.known_for_department && (
            <p className="person-details__profession">
              <FiUser />{" "}
              {translateDepartment(
                person.known_for_department
              )}
            </p>
          )}

          {person.birthday && (
            <p>
              <strong>Nascimento:</strong>{" "}
              {formatDate(person.birthday)}
            </p>
          )}

          {person.place_of_birth && (
            <p>
              <strong>
                Local de nascimento:
              </strong>{" "}
              {person.place_of_birth}
            </p>
          )}

          {person.biography ? (
            <>
              <h2>Biografia</h2>

              <p className="person-details__biography">
                {person.biography}
              </p>
            </>
          ) : (
            <p className="person-details__biography">
              Biografia não disponível.
            </p>
          )}
        </div>
      </div>

      {credits.length > 0 && (
        <section className="person-details__works">
          <h2 className="section-title">
            <FiFilm />
            Filmes e séries conhecidos
          </h2>

          <div className="person-details__grid">
            {credits.map((item) => {
              const title =
                item.title ||
                item.name ||
                "Sem título";

              const date =
                item.release_date ||
                item.first_air_date ||
                "";

              const year = date
                ? date.substring(0, 4)
                : "";

              return (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  to={`/titulo/${item.media_type}/${item.id}`}
                  className="person-work-card"
                >
                  <img
                    src={posterUrl(
                      item.poster_path,
                      "w342"
                    )}
                    alt={title}
                  />

                  <div className="person-work-card__info">
                    <strong>{title}</strong>

                    {year && <span>{year}</span>}

                    {item.character && (
                      <small>
                        {item.character}
                      </small>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default PersonDetails;