/**
 * 微信公众号服务入口文件
 * 配置Express服务器和中间件
 * 导入路由并启动HTTP服务
 */
import express from "express";
import * as dotenv from "dotenv";
import mainRouter from "./routes/main.router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

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
