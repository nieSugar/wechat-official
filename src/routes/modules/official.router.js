/**
 * 微信公众号路由模块
 * 处理所有与微信公众号相关的HTTP请求
 * 包括服务器验证和消息接收功能
 */
import express from "express";
import crypto from "crypto";
import { receiveMessages, verification } from "../../controllers/official.controller.js";

const officialRouter = express.Router();

/**
 * GET / - 处理微信公众号服务器配置验证
 *
 * 验证流程：
 * 1. 获取请求参数：signature（微信加密签名）、timestamp（时间戳）、nonce（随机数）、echostr（随机字符串）
 * 2. 将token、timestamp、nonce三个参数进行字典序排序并拼接
 * 3. 对拼接后的字符串进行SHA1加密
 * 4. 将加密后的字符串与signature对比，匹配则返回echostr，否则返回错误
 *
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
officialRouter.get("/", verification);

/**
 * POST / - 接收微信公众号发送的消息
 *
 * 流程：
 * 1. 使用express.text中间件解析XML格式的请求体
 * 2. 将解析后的XML消息传递给receiveMessages控制器处理
 * 3. 返回处理结果
 *
 * @param {Object} req - Express请求对象，包含XML格式的消息体
 * @param {Object} res - Express响应对象
 */
officialRouter.post('/',  express.text({ type: ['text/xml', 'application/xml'], limit: '2mb' }), receiveMessages);

export default officialRouter;
