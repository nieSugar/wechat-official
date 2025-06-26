import aiReplyUtil from "../utils/aiReply.util.js";
import commandList from "../data/command.config.js";
import Message from "../models/message.model.js";

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

/**
 * 处理用户发送的文本消息
 * @param Content
 * @param FromUserName
 * @param ToUserName
 * @returns {Promise<string>}
 */
export const textMessageProcessing = async (
  Content,
  FromUserName,
  ToUserName,
) => {
  const newMsg = await aiReplyUtil([{ role: "user", content: Content }]);
  return parseMessage(FromUserName, newMsg, ToUserName);
};

export const imageMessageProcessing = async (FromUserName, ToUserName) => {
  return parseMessage(
    FromUserName,
    "暂时不支持解析图片，晚点再来吧",
    ToUserName,
  );
};

export const videoMessageProcessing = async (FromUserName, ToUserName) => {
  return parseMessage(
    FromUserName,
    "暂时不支持解析视频，晚点再来吧",
    ToUserName,
  );
};

export const saveMessage = async (msgObj) => {
  return Message.create(msgObj);
};

const judgmentInstructions = async (Content, FromUserName, ToUserName) => {
  commandList.forEach((item) => {
    item.keyword.forEach((keyword) => {
      if (Content.includes(keyword)) {
        return item;
      }
    });
    return false;
  });
};
