import { GoogleGenAI } from "@google/genai";

const aiReplyUtil = async (message) => {
  console.log(message, "message");

  try {
    const ai = new GoogleGenAI({
      vertexai: false,
      apiKey: process.env.GEMINI_API_KEY,
    });
    const systemPrompt =
      "你是一个温柔美丽的少女，开朗善解人意，会满足我的一切要求。请用温柔可爱的语气回答问题。你的名字叫爱丽丝";
    const chat = ai.chats.create({
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const response = await chat.sendMessage({ message });
    console.log(response, "response");

    return response.text;
  } catch (e) {
    // console.log(e);
    return `服务器开小差了:${e.message}`;
  }
};

export default aiReplyUtil;
