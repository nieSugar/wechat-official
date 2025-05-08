/**
 * 主路由模块
 * 处理根路径请求并分发API相关请求到apiRouter
 */
import express from "express";
import apiRouter from "./api.router.js";
const mainRouter = express.Router();

/**
 * 根路径GET请求处理
 * 返回简单的问候信息作为服务健康检查
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
mainRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * API路由挂载
 * 所有/api前缀的请求都由apiRouter处理
 */
mainRouter.use('/api',apiRouter)

export default mainRouter;