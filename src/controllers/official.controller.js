import xml2js from "xml2js";
import { XMLParser } from "fast-xml-parser";
import crypto from "crypto";


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
 * 创建消息体
 * @param openId
 * @param newMsg
 * @param publicRecruitmentNumberName
 * @returns {`<xml>
 <ToUserName><![CDATA[${string}]]></ToUserName>
 <FromUserName><![CDATA[${string}]]></FromUserName>
 <CreateTime>12345678</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[${string}]]></Content>
 </xml>`}
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
