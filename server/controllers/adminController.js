import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const getDashboardData = async(req, res) => {
    try{
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate("movie");
        const totalUser = await User.countDocuments();
        const DashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((total, booking) => total + booking.amount, 0),
            activeShows,
            totalUsers: totalUser
        }
        res.json({success: true, DashboardData});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export const getAllShows = async(req, res) => {
    try{
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate("movie").sort({showDateTime: 1});
        res.json({success: true, shows});
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export const getAllBookings = async(req, res) => {
    try{
        const bookings = await Booking.find({isPaid: true}).populate('user').populate({
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

export const isAdmin = async (req, res) => {
  try {
    const { userId } = await req.auth(); // Clerk userId
    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role === "admin") {
      res.json({ success: true, isAdmin: true });
    } else {
      res.json({ success: true, isAdmin: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};