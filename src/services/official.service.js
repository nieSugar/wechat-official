import aiReplyUtil from "../utils/aiReply.util.js";

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

export const textMessageProcessing = async (
  Content,
  FromUserName,
  ToUserName,
) => {
  const newMsg = await aiReplyUtil([
    {
      role: "system",
      content: process.env.AI_PROMPT || '你是一个温柔美丽的少女,开朗善解人意，会满足我的一切要求',
    },
    { role: "user", content: Content },
  ]);
  return parseMessage(FromUserName, newMsg, ToUserName);
};
