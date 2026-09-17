import { useLibrary } from "../hooks/useLibrary";
import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";

function MyList() {
  const { library, removeFromLibrary } = useLibrary();
  const wantToWatch = Object.values(library.wantToWatch);
  const watched = Object.values(library.watched);

  return (
    <div className="my-list">
      <h1>Minha lista</h1>

      <section>
        <h2>Quero assistir ({wantToWatch.length})</h2>
        {wantToWatch.length === 0 && <p>Você ainda não adicionou nada aqui.</p>}
        <div className="my-list__grid">
          {wantToWatch.map((item) => (
            <div key={item.id} className="my-list__item">
              <Link to={`/titulo/${item.mediaType}/${item.id}`}>
                {posterUrl(item.posterPath) && (
                  <img src={posterUrl(item.posterPath)} alt={item.title} />
                )}
                <span>{item.title}</span>
              </Link>
              <button onClick={() => removeFromLibrary(item.id)}>Remover</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Já assisti ({watched.length})</h2>
        {watched.length === 0 && <p>Você ainda não marcou nada como assistido.</p>}
        <div className="my-list__grid">
          {watched.map((item) => {
            const review = library.reviews[item.id];
            return (
              <div key={item.id} className="my-list__item">
                <Link to={`/titulo/${item.mediaType}/${item.id}`}>
                  {posterUrl(item.posterPath) && (
                    <img src={posterUrl(item.posterPath)} alt={item.title} />
                  )}
                  <span>{item.title}</span>
                  {review?.rating > 0 && <span>Nota: {review.rating}/5</span>}
                </Link>
                <button onClick={() => removeFromLibrary(item.id)}>Remover</button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default MyList;
