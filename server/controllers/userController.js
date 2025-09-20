import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
//API Controller Function to Get User Bookings 
export const getUserBookings = async(req, res) => {
    try{
        const user = req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        }).sort({createdAt: -1});
        res.json({success: true, bookings});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//API Controller Function to add favorite movie in clerk user metadata

export const updateFavoriteMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    let favoriteMovies = user.privateMetadata.favoriteMovies || [];

    if (!favoriteMovies.includes(movieId)) {
      favoriteMovies.push(movieId);
    } else {
      favoriteMovies = favoriteMovies.filter((id) => id !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { favoriteMovies }
    });

    res.json({ success: true, message: "Favorite movie updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const getFavoriteMovies = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favoriteMovies || []; 
    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
