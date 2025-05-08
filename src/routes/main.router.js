import express from "express";
import apiRouter from "./api.router.js";
const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
    res.send('Hello World!');
});
mainRouter.use('/api',apiRouter)

export default mainRouter;