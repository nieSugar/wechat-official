import aiReplyUtil from "../utils/aiReply.util.js";

export const aiReply = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).send({
      message: "请输入内容",
      code: 4000,
    });
  }
  const message = [{ role: "user", content }];
  const reply = await aiReplyUtil(message);
  console.log(reply);
  res.send(reply);
};
