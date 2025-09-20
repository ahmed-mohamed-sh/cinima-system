import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import TimeFormat from "../lib/TimeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const { shows, axios, getToken, fetchFavoriteMovies, favoriteMovie, image_base_url, user} = useAppContext();

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to add to favorites");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: show.movie._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getShow = async () => {
      try {
        const { data } = await axios.get(`/api/show/${id}`);
        if (data.success) {
          setShow(data); 
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getShow();
  }, [id, axios]);

  return show ? (
    <div className="mt-32 px-6 md:px-16 lg:px-40 py-10">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
          alt={show.movie.title}
          className="mx-auto rounded-xl h-80 w-56 object-cover shadow-lg"
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-[#F84565] uppercase">{show.movie.original_language}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="h-5 w-5 text-[#F84565] fill-[#F84565]" />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{show.movie.overview}</p>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {TimeFormat(show.movie.runtime)}
            <span className="mx-2 text-lg align-middle">•</span>
            {show.movie.geners.map((genre) => genre.name).join(", ")}
            <span className="mx-2 text-lg align-middle">•</span>
            {show.movie.release_date.split("-")[0]}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
  onClick={() => {() =>{}}
  }
  className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
>
  <PlayCircleIcon className="w-5 h-5" /> Watch Trailer
</button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-[#F84565] hover:bg-[#F84565]/80 transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
             <Heart
  className={`w-5 h-5 ${
    favoriteMovie.find(movie => movie._id === show.movie._id) ? "text-[#F84565] fill-[#F84565]"  : "text-gray-300"
  }`}
/>
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex gap-8 w-max px-4">
          {show.movie.cast.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image_base_url + cast.profile_path}
                alt={cast.name}
                className="h-20 object-cover rounded-full md:h-20 aspect-square"
              />
              <p className="text-xs mt-3 font-medium">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
       {shows.map((show) => (
                    <MovieCard key={show._id} movie={show.movie} />
              ))}

      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="bg-[#F84565] hover:bg-[#F84565]/80 transition-all rounded-md font-medium text-sm px-10 py-3 cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
