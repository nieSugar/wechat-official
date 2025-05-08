import OpenAI from "openai";

const aiReplyUtil = async (message) => {
  const openai = new OpenAI({
    baseURL: process.env.AI_API_URL,
    apiKey: process.env.AI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: message,
      model: process.env.AI_MODEL,
    });
    return completion.choices[0].message.content;
  } catch (e) {
    console.log(e);
    return `服务器开小差了:${e.message}`;
  }
};

export default aiReplyUtil;
