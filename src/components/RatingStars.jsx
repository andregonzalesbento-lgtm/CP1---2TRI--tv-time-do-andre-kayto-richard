import { FaStar, FaRegStar } from "react-icons/fa";

// Recebe a nota atual e uma função (via props) para avisar quando o usuário clicar.
function RatingStars({ rating = 0, onRate }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onRate(value)}
          aria-label={`Dar nota ${value}`}
        >
          {value <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
