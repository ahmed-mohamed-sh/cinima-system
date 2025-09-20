import express from "express";
import { creatBooking, getOccupiedSeats } from "../controllers/bookingController.js";


const bookingRouter = express.Router();

bookingRouter.post('/create', creatBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
