import aiReplyUtil from "../utils/aiReply.util.js";

export const aiReply = async (req, res) => {
  const { content, messages } = req.body;
  if (!content && !messages) {
    return res.status(400).send({
      message: "请输入内容",
      code: 4000,
    });
  }
  console.log(messages,'messages');
  console.log(content,'content');
  
  const reply = await aiReplyUtil(content);

  res.send({
    message: "回复成功",
    data: reply,
    code: 2000,
  });
};
