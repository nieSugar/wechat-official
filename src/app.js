/**
 * 微信公众号服务入口文件
 * 配置Express服务器和中间件
 * 导入路由并启动HTTP服务
 */
import express from "express";
import * as dotenv from "dotenv";
import mainRouter from "./routes/main.router.js";
import * as path from "node:path";
import { fileURLToPath } from "url";
import connectDatabase from "./config/dbConfig.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 连接数据库
connectDatabase().then((res) => {});

/**
 * 配置静态文件中间件
 */
app.use(express.static(path.join(__dirname, "../public")));

/**
 * 配置基础中间件
 * express.json() - 解析JSON格式的请求体
 */
app.use(express.json());

/**
 * 注册主路由
 * mainRouter处理所有API请求的分发
 */
app.use(mainRouter);

/**
 * 启动服务器
 * 监听指定端口，默认为3001
 * 输出服务器地址到控制台
 */
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
