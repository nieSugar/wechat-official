import express from "express";
import officialRouter from "./modules/official.router.js";

const apiRouter = express.Router();

apiRouter.use('/official',officialRouter)

export default apiRouter;