import express from "express";
import {aiReply} from "../../controllers/ai.controller.js";

const aiRouter = express.Router();


aiRouter.post('/', aiReply)


export default aiRouter;