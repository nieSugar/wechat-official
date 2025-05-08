import express from "express";
import * as dotenv from "dotenv";
import mainRouter from "./routes/main.router.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// 基础中间件
app.use(express.json());




app.use(mainRouter)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
