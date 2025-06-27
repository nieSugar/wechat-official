import aiReplyUtil from "../utils/aiReply.util.js";

export const aiReply = async (req, res) => {
  const { content } = req.body;
  console.log(content, "content");
  if (!content) {
    return res.status(400).send({
      message: "请输入内容",
      code: 4000,
    });
  }
  const reply = await aiReplyUtil(content);

  res.send({
    message: "回复成功",
    data: reply,
    code: 2000,
  });
};
