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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log(`🚀 服务器启动成功！`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🤖 指令系统已启用:`);
  console.log(`   - 普通消息: 进行AI分析并记录到Notion`);
  console.log(`   - /ai 指令: 仅进行AI回答，不记录到Notion`);
});
