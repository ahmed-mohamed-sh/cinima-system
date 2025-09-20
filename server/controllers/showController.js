import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// ====================== Get Now Playing Movies ======================
export const getNowShowing = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ====================== Add Shows ======================
export const addShow = async (req, res) => {
  try {
    const { movieId, showInput, ShowPrice } = req.body;

    let movie = await Movie.findById(movieId);

    // لو الفيلم مش موجود في الداتابيز هنسحبه من TMDB
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieApiData.id,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        geners: movieApiData.genres,
        cast: movieCreditsData.cast,
        tagline: movieApiData.tagline || "",
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        runtime: movieApiData.runtime,
        vote_average: movieApiData.vote_average,
        credits: movieCreditsData.cast,
      };

      movie = await Movie.create(movieDetails);
    }

    // تجهيز الـ shows للإضافة
    const showsToCreate = [];
    showInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movie._id,
          showDateTime: new Date(dateTimeString),
          ShowPrice: ShowPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Shows added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ====================== Get All Shows ======================
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // تصفية العروض بحيث يكون الفيلم unique
    const uniqueShowsMap = new Map();
    shows.forEach((show) => {
      if (!uniqueShowsMap.has(show.movie._id.toString())) {
        uniqueShowsMap.set(show.movie._id.toString(), show);
      }
    });

    res.json({ success: true, shows: Array.from(uniqueShowsMap.values()) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ====================== Get Single Show ======================
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // كل العروض القادمة لفيلم معين
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);

    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
        price: show.ShowPrice, // هنا السعر هيبان مع كل عرض
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
