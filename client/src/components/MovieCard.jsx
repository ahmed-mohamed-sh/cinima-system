import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import TimeFormat from "../lib/TimeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const handleNavigate = () => {
    navigate(`/movies/${movie._id}`);
    scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition-transform duration-300 w-66">
      {/* Movie Poster */}
      <img
        onClick={handleNavigate}
        src={image_base_url + movie.backdrop_path}
        alt={movie.title || "Movie Poster"}
        className="rounded-lg h-52 w-full object-cover object-center cursor-pointer"
      />

      {/* Title */}
      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      {/* Extra Info */}
      <p className="text-sm text-gray-400 mt-2">
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "N/A"}{" "}
        •{" "}
        {movie.geners && movie.geners.length > 0
          ? movie.geners
              .slice(0, 2)
              .map((genere) => genere.name)
              .join(" | ")
          : "Unknown Genre"}{" "}
        • {movie.runtime ? TimeFormat(movie.runtime) : "N/A"}
      </p>

      {/* Buy + Rating */}
      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={handleNavigate}
          className="px-4 py-2 text-xs bg-[#F84565] hover:bg-[#F84565]/80 transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-[#F84565] fill-[#F84565]" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
