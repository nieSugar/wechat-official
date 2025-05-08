/**
 * 微信公众号控制器模块
 * 处理微信公众号的服务器验证、消息接收和回复等功能
 */
import xml2js from "xml2js";
import { XMLParser } from "fast-xml-parser";
import crypto from "crypto";

/**
 * 处理微信公众号服务器配置验证
 * 
 * 根据微信公众平台规范验证请求的合法性:
 * 1. 提取请求参数：signature(签名)、timestamp(时间戳)、nonce(随机数)、echostr(随机字符串)
 * 2. 将token、timestamp、nonce三个参数按字典序排序并拼接
 * 3. 对拼接后的字符串进行SHA1加密
 * 4. 加密结果与signature比对，匹配则验证通过，返回echostr
 * 
 * @param {Object} req - Express请求对象，包含查询参数
 * @param {Object} res - Express响应对象
 * @returns {Object} - 验证成功返回echostr，失败返回错误信息
 */
export const verification = (req, res) => {
  // 解构获取请求参数
  const { signature, timestamp, nonce, echostr } = req.query;
  // 从环境变量获取配置的Token
  const token = process.env.OFFICIAL_TOKEN;

  // 参数完整性校验
  if (!signature || !timestamp || !nonce || !echostr) {
    console.error("缺少验证参数");
    return res.status(400).json({ error: "缺少验证参数" });
  }

  // Token配置检查
  if (!token) {
    console.error("服务器未配置Token");
    return res.status(500).json({ error: "服务器未配置Token" });
  }

  // 按照微信加密规则进行验证
  // 1. 将token、timestamp、nonce三个参数进行字典序排序并拼接
  const sortedParams = [token, timestamp, nonce].sort().join("");
  // 2. 对拼接后的字符串进行SHA1加密
  const signatureCompare = crypto
    .createHash("sha1")
    .update(sortedParams)
    .digest("hex");

  // 3. 加密后的字符串与signature对比，匹配则返回echostr，验证成功
  if (signature === signatureCompare) {
    console.log("验证成功", echostr);
    res.send(echostr);
  } else {
    res.status(403).json({ error: "签名验证失败" });
  }
}

/**
 * 接收并处理微信公众号发来的消息
 * 
 * 流程：
 * 1. 解析微信发送的XML格式消息
 * 2. 根据消息类型和内容进行相应处理
 * 3. 返回成功响应
 * 
 * @param {Object} req - Express请求对象，包含XML格式的消息体
 * @param {Object} res - Express响应对象
 * @returns {string} - 返回"success"表示消息已收到
 */
export const receiveMessages = async (req, res) => {
  const xml = req.body; // 由于我们在路由中用 express.text 解析，req.body 就是字符串
  const parser = new XMLParser({ ignoreAttributes: false });
  console.log(parser.XMLParser);
  let msgObj;
  try {
    msgObj = parser.parse(xml).xml;
  } catch (e) {
    console.error("XML 解析失败：", e);
    return res.status(400).send("Invalid XML");
  }

  console.log("收到微信消息：", msgObj);
  res.send("success");
};

/**
 * 创建回复消息的XML格式
 * 
 * 根据微信公众平台的消息格式规范，构建回复用户的XML消息体
 * 
 * @param {string} openId - 用户的OpenID
 * @param {string} newMsg - 要发送给用户的消息内容
 * @param {string} publicRecruitmentNumberName - 公众号原始ID
 * @returns {string} - 格式化的XML消息字符串
 */
const parseMessage = (openId, newMsg, publicRecruitmentNumberName) => {
  return `<xml>
  <ToUserName><![CDATA[${openId}]]></ToUserName>
  <FromUserName><![CDATA[${publicRecruitmentNumberName}]]></FromUserName>
  <CreateTime>12345678</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${newMsg}]]></Content>
</xml>`;
};
