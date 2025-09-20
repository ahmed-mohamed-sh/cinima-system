import React from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Movies = () => {
  const {shows = []} = useAppContext();
  return shows && shows.length > 0 ?  (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
        <BlurCircle top="150px" left="0"/>
        <BlurCircle bottom="50px" right="50px"/>
      <h1 className="text-lg font-medium my-4">Now Showing</h1> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {shows.map((show) => (
              <MovieCard key={show._id} movie={show.movie} />
        ))}
      </div>
    </div>
  ): (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No Movies Found</h1>
    </div>
  );
};

export default Movies;
