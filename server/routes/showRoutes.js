import express from "express";
import { addShow, getNowShowing, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get("/now-playing",protectAdmin, getNowShowing );

showRouter.post("/add-show", protectAdmin, addShow);

showRouter.get("/all", getShows);

showRouter.get("/:movieId", getShow);




export default showRouter;